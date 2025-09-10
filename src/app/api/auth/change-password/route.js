// app/api/auth/change-password/route.js - Changement de mot de passe
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { changeUserPassword } from '@/lib/auth-db';

export async function PUT(request) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        // Validation des données
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Mot de passe actuel et nouveau mot de passe requis' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        const result = await changeUserPassword(decoded.userId, currentPassword, newPassword);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message
            });
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}