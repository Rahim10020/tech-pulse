// src/lib/prisma.js - Singleton PrismaClient corrigé
import { PrismaClient } from '@prisma/client';

// Utiliser globalThis pour éviter les conflits
const globalForPrisma = globalThis;

// Configuration optimisée pour la production
const prismaConfig = {
    // Log des requêtes en développement seulement
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],

    // Configuration des erreurs plus détaillées en dev
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
};

// Créer ou réutiliser l'instance Prisma (nom différent pour éviter le conflit)
const prismaInstance = globalForPrisma.prisma ?? new PrismaClient(prismaConfig);

// En développement, stocker l'instance dans global pour éviter les reconnexions
// lors du rechargement à chaud (hot reload)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
}

// Middleware pour gérer les erreurs de connexion
prismaInstance.$use(async (params, next) => {
    const start = Date.now();

    try {
        const result = await next(params);

        // Log des requêtes lentes en développement
        if (process.env.NODE_ENV === 'development') {
            const duration = Date.now() - start;
            if (duration > 1000) { // Plus de 1 seconde
                console.warn(`🐌 Requête lente détectée: ${params.model}.${params.action} (${duration}ms)`);
            }
        }

        return result;
    } catch (error) {
        const duration = Date.now() - start;
        console.error(`❌ Erreur DB après ${duration}ms:`, {
            model: params.model,
            action: params.action,
            error: error.message
        });
        throw error;
    }
});

// Gestion propre de la fermeture de l'application
process.on('beforeExit', async () => {
    console.log('🔌 Fermeture de la connexion Prisma...');
    await prismaInstance.$disconnect();
});

process.on('SIGINT', async () => {
    console.log('🔌 Arrêt forcé - Fermeture de la connexion Prisma...');
    await prismaInstance.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🔌 Arrêt du processus - Fermeture de la connexion Prisma...');
    await prismaInstance.$disconnect();
    process.exit(0);
});

// Fonction utilitaire pour vérifier la connexion
export async function checkDatabaseConnection() {
    try {
        await prismaInstance.$queryRaw`SELECT 1`;
        console.log('✅ Connexion à la base de données établie');
        return true;
    } catch (error) {
        console.error('❌ Impossible de se connecter à la base de données:', error);
        return false;
    }
}

// Export de l'instance (nom clair)
export const prisma = prismaInstance;

// Export par défaut pour faciliter l'import
export default prismaInstance;