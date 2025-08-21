import { PrismaClient } from '@prisma/client';

// Utiliser globalThis pour stocker l’instance
const globalForPrisma = globalThis;

// Configuration Prisma
const prismaConfig = {
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
};

// Créer / réutiliser l’instance
const prismaClient = globalForPrisma._prisma ?? new PrismaClient(prismaConfig);

// En dev, éviter les multiples instances avec HMR
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma._prisma = prismaClient;
}

// Fonction utilitaire
export async function checkDatabaseConnection() {
    try {
        await prismaClient.$queryRaw`SELECT 1`;
        console.log('✅ Connexion à la base de données établie');
        return true;
    } catch (error) {
        console.error('❌ Impossible de se connecter à la base de données:', error);
        return false;
    }
}

// Export nommé
export const prisma = prismaClient;

// Export par défaut
export default prismaClient;
