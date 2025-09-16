import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const runtime = 'nodejs';
import bcrypt from 'bcryptjs';
import { withRateLimit } from '@/lib/rate-limit';
import { isExpired } from '@/lib/utils';

async function resetPasswordHandler(request) {
    try {
        const { email, code, password } = await request.json();

        // Validation des données
        if (!email || !code || !password) {
            return NextResponse.json(
                {
                    error: 'Email, code et mot de passe requis',
                    code: 'MISSING_DATA'
                },
                { status: 400 }
            );
        }

        // Validation du mot de passe
        if (password.length < 8) {
            return NextResponse.json(
                {
                    error: 'Le mot de passe doit contenir au moins 8 caractères',
                    code: 'WEAK_PASSWORD'
                },
                { status: 400 }
            );
        }

        // Validation du format du code (6 chiffres)
        if (!/^\d{6}$/.test(code)) {
            return NextResponse.json(
                {
                    error: 'Format de code invalide',
                    code: 'INVALID_CODE_FORMAT'
                },
                { status: 400 }
            );
        }

        // Vérifier le code
        const resetCode = await prisma.passwordResetCode.findFirst({
            where: {
                email: email.toLowerCase().trim(),
                code: code,
                used: false
            }
        });

        if (!resetCode) {
            return NextResponse.json(
                {
                    error: 'Code invalide ou expiré',
                    code: 'INVALID_CODE'
                },
                { status: 400 }
            );
        }

        // Vérifier si le code a expiré
        if (isExpired(resetCode.expiresAt)) {
            return NextResponse.json(
                {
                    error: 'Code expiré',
                    code: 'EXPIRED_CODE'
                },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: resetCode.email },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: 'Utilisateur non trouvé',
                    code: 'USER_NOT_FOUND'
                },
                { status: 400 }
            );
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Mettre à jour le mot de passe
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Marquer le code comme utilisé
        await prisma.passwordResetCode.update({
            where: { id: resetCode.id },
            data: { used: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Mot de passe mis à jour avec succès'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            {
                error: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            },
            { status: 500 }
        );
    }
}

// ✅ APPLIQUER LE RATE LIMITING
export const POST = withRateLimit('reset-password')(resetPasswordHandler);