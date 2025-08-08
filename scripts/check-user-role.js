// scripts/check-user-role.js - Script pour vérifier le rôle en base
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    console.log('🔍 Vérification du rôle utilisateur...\n');

    const adminEmail = 'rahialighi@gmail.com';
    
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé avec l\'email:', adminEmail);
      console.log('\n💡 Suggestions:');
      console.log('   1. Vérifiez que l\'email est correct');
      console.log('   2. Exécutez le script setup-admin.js');
      return;
    }

    console.log('👤 Informations utilisateur:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nom: ${user.name}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role || 'AUCUN RÔLE!'}`);
    console.log(`   Créé le: ${user.createdAt}`);
    console.log(`   Modifié le: ${user.updatedAt}`);

    // Vérifications
    console.log('\n🔐 Vérifications:');
    console.log(`   - A un rôle: ${user.role ? '✅' : '❌'}`);
    console.log(`   - Est admin: ${user.role === 'admin' ? '✅' : '❌'}`);
    console.log(`   - Peut accéder à l'admin: ${user.role === 'admin' ? '✅' : '❌'}`);

    // Si pas admin, proposer de le faire
    if (user.role !== 'admin') {
      console.log('\n⚠️  L\'utilisateur n\'est pas admin!');
      console.log('\n🔧 Pour corriger cela, exécutez:');
      console.log('   npm run setup-admin');
      console.log('   ou');
      console.log('   node scripts/setup-admin.js');
      
      // Correction automatique (optionnel)
      console.log('\n❓ Voulez-vous corriger automatiquement? (Ctrl+C pour annuler)');
      
      // Attendre 3 secondes puis corriger
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('🔧 Correction du rôle en cours...');
      
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      
      console.log('✅ Rôle mis à jour avec succès!');
      console.log('👤 Nouvelles informations:', updatedUser);
    } else {
      console.log('\n✅ L\'utilisateur a bien le rôle admin!');
    }

    // Compter les autres utilisateurs
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({
      where: { role: 'admin' }
    });

    console.log('\n📊 Statistiques:');
    console.log(`   - Total utilisateurs: ${totalUsers}`);
    console.log(`   - Administrateurs: ${adminUsers}`);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la vérification
checkUserRole();