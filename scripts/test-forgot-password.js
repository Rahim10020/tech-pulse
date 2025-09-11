#!/usr/bin/env node

/**
 * Script de test rapide pour le système de mot de passe oublié
 * Usage: node scripts/test-forgot-password.js votre-email@test.com
 */

async function testForgotPassword() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Usage: node scripts/test-forgot-password.js votre-email@test.com');
        process.exit(1);
    }

    console.log(`🧪 Test du système de mot de passe oublié pour: ${email}`);
    console.log('='.repeat(60));

    try {
        // Test de l'API forgot-password
        console.log('📤 Test de l\'API forgot-password...');
        const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Erreur API:', errorData.error);
            process.exit(1);
        }

        const data = await response.json();
        console.log('✅ API forgot-password: OK');
        console.log(`📧 Message: ${data.message}`);

        if (data.resetCode) {
            console.log(`🔑 Code généré (dev): ${data.resetCode}`);

            // Test de l'API verify-reset-code
            console.log('\n🔍 Test de l\'API verify-reset-code...');
            const verifyResponse = await fetch('http://localhost:3000/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: data.resetCode
                }),
            });

            if (verifyResponse.ok) {
                console.log('✅ API verify-reset-code: OK');
            } else {
                const verifyError = await verifyResponse.json();
                console.error('❌ Erreur verify:', verifyError.error);
            }

            // Test de l'API reset-password
            console.log('\n🔄 Test de l\'API reset-password...');
            const resetResponse = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: data.resetCode,
                    password: 'nouveaumotdepasse123'
                }),
            });

            if (resetResponse.ok) {
                console.log('✅ API reset-password: OK');
                console.log('🎉 Flux complet réussi !');
            } else {
                const resetError = await resetResponse.json();
                console.error('❌ Erreur reset:', resetError.error);
            }
        } else {
            console.log('ℹ️ Code non retourné (mode production ou email envoyé)');
        }

    } catch (error) {
        console.error('❌ Erreur réseau:', error.message);
        console.log('\n💡 Assurez-vous que le serveur est démarré:');
        console.log('   npm run dev');
        process.exit(1);
    }
}

// Vérifier si le serveur est accessible
async function checkServer() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'OPTIONS'
        });
        return true;
    } catch (error) {
        console.error('❌ Serveur non accessible sur http://localhost:3000');
        console.log('🚀 Démarrez le serveur avec: npm run dev');
        return false;
    }
}

async function main() {
    console.log('🔧 Vérification du serveur...');
    const serverUp = await checkServer();

    if (!serverUp) {
        process.exit(1);
    }

    await testForgotPassword();
}

main();