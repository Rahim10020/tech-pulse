import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth-db';
import { prisma } from '@/lib/prisma';
export const runtime = 'nodejs';
import { withRateLimit } from '@/lib/rate-limit';
import { sendPasswordResetEmail } from '@/lib/email';
import { generatePasswordResetCode } from '@/lib/utils';

async function forgotPasswordHandler(request) {
    try {
        const { email } = await request.json();

        // Validation des données
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                {
                    error: 'Email requis',
                    code: 'MISSING_EMAIL'
                },
                { status: 400 }
            );
        }

        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    error: 'Format d\'email invalide',
                    code: 'INVALID_EMAIL'
                },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe
        const user = await getUserByEmail(email.toLowerCase().trim());
        if (!user) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
            return NextResponse.json({
                success: true,
                message: 'Si cet email est associé à un compte, un code de réinitialisation a été généré.',
                // En développement, on retourne aussi le code pour faciliter les tests
                resetCode: process.env.NODE_ENV === 'development' ? '000000' : undefined
            });
        }

        // Générer un code de 6 chiffres
        const resetCode = generatePasswordResetCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Sauvegarder le code dans la base de données
        await prisma.passwordResetCode.create({
            data: {
                code: resetCode,
                email: email.toLowerCase().trim(),
                expiresAt,
            },
        });

        // Afficher le code dans la console (pour le développement)
        console.log(`🔐 CODE DE RÉINITIALISATION pour ${email}: ${resetCode}`);
        console.log(`⏰ Ce code expire dans 10 minutes`);

        // Essayer d'envoyer l'email (optionnel)
        try {
            await sendPasswordResetEmail(email.toLowerCase().trim(), resetCode);
            console.log(`✅ Email avec code de réinitialisation envoyé à ${email}`);
        } catch (emailError) {
            console.log('⚠️ Email non envoyé (configuration manquante), mais code généré:', resetCode);
            // On ne retourne pas d'erreur pour éviter de révéler si l'email existe
        }

        return NextResponse.json({
            success: true,
            message: 'Si cet email est associé à un compte, un lien de réinitialisation a été envoyé.',
            // En développement, retourner aussi le code pour faciliter les tests
            resetCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
        });
    } catch (error) {
        console.error('Forgot password error:', error);
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
export const POST = withRateLimit('forgot-password')(forgotPasswordHandler);