#!/usr/bin/env node

/**
 * Script de test rapide pour SendGrid
 * Usage: node scripts/test-sendgrid.js
 */

async function testSendGrid() {
    console.log('🚀 Test de configuration SendGrid');
    console.log('='.repeat(50));

    // Vérifier les variables d'environnement
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    console.log('🔧 Configuration détectée :');
    console.log(`   Host: ${smtpHost || '❌ Non configuré'}`);
    console.log(`   Port: ${smtpPort || '❌ Non configuré'}`);
    console.log(`   User: ${smtpUser ? '✅ Configuré' : '❌ Non configuré'}`);
    console.log(`   Pass: ${smtpPass ? '✅ Configuré (masqué)' : '❌ Non configuré'}`);

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        console.log('\n❌ Configuration SendGrid manquante !');
        console.log('\n📋 Configuration requise dans .env :');
        console.log('SMTP_HOST="smtp.sendgrid.net"');
        console.log('SMTP_PORT="587"');
        console.log('SMTP_USER="apikey"');
        console.log('SMTP_PASS="SG.votre-cle-api-sendgrid"');
        console.log('\n📖 Consultez EMAIL_SETUP.md pour les instructions complètes');
        process.exit(1);
    }

    // Vérifier si c'est bien SendGrid
    if (smtpHost !== 'smtp.sendgrid.net') {
        console.log('\n⚠️ Configuration détectée mais ce n\'est pas SendGrid');
        console.log('Pour tester SendGrid, configurez :');
        console.log('SMTP_HOST="smtp.sendgrid.net"');
        return;
    }

    console.log('\n✅ Configuration SendGrid détectée !');

    // Tester la connexion
    try {
        console.log('\n🔌 Test de connexion SMTP...');

        const nodemailer = await import('nodemailer');

        const transporter = nodemailer.createTransporter({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: false, // false pour 587
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // Vérifier la connexion
        await transporter.verify();
        console.log('✅ Connexion SMTP réussie !');

        // Test d'envoi d'email
        console.log('\n📧 Test d\'envoi d\'email...');

        const testEmail = process.argv[2] || 'test@example.com';
        console.log(`📨 Envoi à: ${testEmail}`);

        const mailOptions = {
            from: {
                name: 'PixelPulse',
                address: smtpUser === 'apikey' ? 'noreply@pixelpulse.com' : smtpUser
            },
            to: testEmail,
            subject: 'Test SendGrid - PixelPulse',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>🎉 Test SendGrid réussi !</h2>
                    <p>Votre configuration SendGrid fonctionne parfaitement.</p>
                    <p><strong>Email envoyé le:</strong> ${new Date().toLocaleString('fr-FR')}</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        Ceci est un email de test automatique.
                    </p>
                </div>
            `,
            text: `
Test SendGrid réussi !

Votre configuration SendGrid fonctionne parfaitement.
Email envoyé le: ${new Date().toLocaleString('fr-FR')}

Ceci est un email de test automatique.
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email envoyé avec succès !');
        console.log(`📧 ID du message: ${info.messageId}`);

        // Instructions pour vérifier
        console.log('\n📋 Prochaines étapes :');
        console.log('1. Vérifiez votre boîte email');
        console.log('2. Vérifiez le dashboard SendGrid dans "Activity Feed"');
        console.log('3. Testez le système de mot de passe oublié :');
        console.log('   node scripts/test-forgot-password.js votre-email@test.com');

    } catch (error) {
        console.error('❌ Erreur lors du test SendGrid:', error.message);

        if (error.message.includes('Invalid login')) {
            console.log('\n🔍 Causes possibles :');
            console.log('• Clé API SendGrid incorrecte');
            console.log('• Clé API expirée ou révoquée');
            console.log('• Permissions insuffisantes (besoin de Mail Send)');
        } else if (error.message.includes('Sender')) {
            console.log('\n🔍 Causes possibles :');
            console.log('• Expéditeur non vérifié dans SendGrid');
            console.log('• Domaine non authentifié');
        }

        console.log('\n📖 Consultez EMAIL_SETUP.md pour résoudre le problème');
        process.exit(1);
    }
}

testSendGrid();