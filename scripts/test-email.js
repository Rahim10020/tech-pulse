#!/usr/bin/env node

/**
 * Script de test pour l'envoi d'emails
 * Usage: node scripts/test-email.js votre-email@test.com
 */

import { sendPasswordResetEmail } from '../src/lib/email.js';

async function testEmail() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Usage: node scripts/test-email.js votre-email@test.com');
        process.exit(1);
    }

    console.log(`📧 Test d'envoi d'email à: ${email}`);

    try {
        // Générer un token de test
        const crypto = require('crypto');
        const testToken = crypto.randomBytes(32).toString('hex');

        console.log('🔄 Envoi de l\'email de test...');
        const result = await sendPasswordResetEmail(email, testToken);

        if (result.success) {
            console.log('✅ Email envoyé avec succès!');
            console.log(`📨 ID du message: ${result.messageId}`);
            console.log(`🔗 Lien de test: http://localhost:3000/reset-password/${testToken}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error.message);
        console.log('\n🔧 Vérifiez votre configuration dans le fichier .env');
        console.log('📖 Consultez EMAIL_SETUP.md pour les instructions');
        process.exit(1);
    }
}

// Vérifier les variables d'environnement
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\n🔧 Configurez ces variables dans votre fichier .env');
    console.log('📖 Consultez EMAIL_SETUP.md pour les instructions');
    process.exit(1);
}

testEmail();