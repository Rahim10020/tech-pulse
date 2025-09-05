const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanData() {
    try {
        console.log('Suppression des données (sauf settings)...');

        // Supprimer dans l'ordre à cause des relations
        await prisma.like.deleteMany();
        console.log('✓ Likes supprimés');

        await prisma.comment.deleteMany();
        console.log('✓ Commentaires supprimés');

        await prisma.article.deleteMany();
        console.log('✓ Articles supprimés');

        await prisma.user.deleteMany();
        console.log('✓ Utilisateurs supprimés');

        await prisma.category.deleteMany();
        console.log('✓ Catégories supprimées');

        await prisma.tag.deleteMany();
        console.log('✓ Tags supprimés');

        await prisma.contact.deleteMany();
        console.log('✓ Messages de contact supprimés');

        // On garde siteSettings
        console.log('✓ Settings conservés');

        console.log('Nettoyage terminé !');
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanData();