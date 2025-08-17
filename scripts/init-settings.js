// scripts/init-settings.js - Initialiser les paramètres du site
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSettings() {
  try {
    console.log('🔧 Initialisation des paramètres du site...');

    // Vérifier s'il existe déjà des paramètres
    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      console.log('✅ Les paramètres existent déjà');
      return;
    }

    // Créer les paramètres par défaut
    const settings = await prisma.siteSettings.create({
      data: {
        siteName: 'pixelpulse',
        siteDescription: 'Modern and innovative technology blog',
        siteUrl: 'https://pixelpulse.com',
        contactEmail: 'rahim100codeur@gmail.com',
        contactPhone: '+228 91 79 61 15',
        contactAddress: '123 Rue de la Tech, 75001 Lome, Togo',
        socialTwitter: 'https://twitter.com/pixelpulse',
        socialLinkedin: 'https://linkedin.com/company/pixelpulse',
        socialGithub: 'https://github.com/pixelpulse',
        analyticsCode: '',
        seoTitle: 'pixelpulse - Technology blog',
        seoDescription: 'Discover the latest technological news and current innovations',
        seoKeywords: 'tech, technology, innovation, blog, articles',
        maintenanceMode: false,
        allowComments: true,
        allowRegistration: true
      }
    });

    console.log('✅ Paramètres initialisés avec succès');
    console.log('📋 Paramètres créés :', settings.siteName);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSettings(); 