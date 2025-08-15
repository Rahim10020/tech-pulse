// ================================================================
// 4. SCRIPT DE GÉNÉRATION DE CLÉ (scripts/generate-jwt-secret.js)
// ================================================================

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Générateur de clé JWT sécurisée pour TechPulse\n');

// Générer une clé aléatoire de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('base64');

console.log('✅ Clé JWT générée avec succès !');
console.log('🔑 Votre JWT_SECRET sécurisé :');
console.log('\n' + '='.repeat(80));
console.log(jwtSecret);
console.log('='.repeat(80) + '\n');

// Essayer de mettre à jour le fichier .env
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

try {
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('JWT_SECRET=')) {
      // Remplacer la ligne existante
      envContent = envContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET="${jwtSecret}"`
      );
    } else {
      // Ajouter la nouvelle ligne
      envContent += `\nJWT_SECRET="${jwtSecret}"\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env mis à jour automatiquement');
  } else if (fs.existsSync(envExamplePath)) {
    // Copier .env.example vers .env
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET="${jwtSecret}"`
    );
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env créé à partir de .env.example');
  } else {
    console.log('⚠️  Ajoutez manuellement cette ligne à votre fichier .env :');
    console.log(`JWT_SECRET="${jwtSecret}"`);
  }
} catch (error) {
  console.log('⚠️  Impossible de mettre à jour automatiquement le fichier .env');
  console.log('📝 Ajoutez manuellement cette ligne à votre fichier .env :');
  console.log(`JWT_SECRET="${jwtSecret}"`);
}

console.log('\n📋 Instructions :');
console.log('1. Copiez la clé ci-dessus dans votre fichier .env');
console.log('2. Ne partagez JAMAIS cette clé');
console.log('3. Utilisez une clé différente pour la production');
console.log('4. Redémarrez votre serveur de développement');