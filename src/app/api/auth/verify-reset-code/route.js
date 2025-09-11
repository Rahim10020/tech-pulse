import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isExpired } from '@/lib/utils';

export async function POST(request) {
    try {
        const { email, code } = await request.json();

        // Validation des données
        if (!email || !code) {
            return NextResponse.json(
                {
                    error: 'Email et code requis',
                    code: 'MISSING_DATA'
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

        // Rechercher le code dans la base de données
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

        // Vérifier si le code n'a pas expiré
        if (isExpired(resetCode.expiresAt)) {
            return NextResponse.json(
                {
                    error: 'Code expiré',
                    code: 'EXPIRED_CODE'
                },
                { status: 400 }
            );
        }

        // Marquer le code comme utilisé
        await prisma.passwordResetCode.update({
            where: { id: resetCode.id },
            data: { used: true }
        });

        return NextResponse.json({
            success: true,
            message: 'Code vérifié avec succès',
            email: resetCode.email
        });

    } catch (error) {
        console.error('Verify reset code error:', error);
        return NextResponse.json(
            {
                error: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            },
            { status: 500 }
        );
    }
}