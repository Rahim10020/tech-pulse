// scripts/create-default-categories.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDefaultCategories() {
    console.log('🚀 Création des catégories par défaut...');

    const categories = [
        {
            name: 'Développement',
            slug: 'developpement',
            description: 'Programmation, langages, frameworks',
            icon: 'Code',
            color: 'bg-blue-100',
            textColor: 'text-blue-800'
        },
        {
            name: 'Intelligence Artificielle',
            slug: 'intelligence-artificielle',
            description: 'IA, Machine Learning, Deep Learning',
            icon: 'Brain',
            color: 'bg-purple-100',
            textColor: 'text-purple-800'
        },
        {
            name: 'Cybersécurité',
            slug: 'cybersecurite',
            description: 'Sécurité informatique, protection des données',
            icon: 'Shield',
            color: 'bg-green-100',
            textColor: 'text-green-800'
        },
        {
            name: 'Cloud Computing',
            slug: 'cloud-computing',
            description: 'Services cloud, AWS, Azure, GCP',
            icon: 'Cloud',
            color: 'bg-teal-100',
            textColor: 'text-teal-800'
        },
        {
            name: 'Design',
            slug: 'design',
            description: 'UI/UX, graphisme, expérience utilisateur',
            icon: 'Palette',
            color: 'bg-pink-100',
            textColor: 'text-pink-800'
        }
    ];

    for (const category of categories) {
        const result = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category
        });
        console.log(`✅ Catégorie "${result.name}" créée/mise à jour`);
    }

    console.log('🎉 Toutes les catégories ont été créées avec succès !');
}

createDefaultCategories()
    .catch((error) => {
        console.error('❌ Erreur :', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });