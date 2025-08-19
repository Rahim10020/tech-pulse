// scripts/migrate-prisma-singleton.js - Script pour migrer automatiquement vers le singleton
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

// Motifs à rechercher et remplacer
const patterns = [
    {
        search: /import { PrismaClient } from ['""]@prisma\/client['""];?\n/g,
        replace: ''
    },
    {
        search: /const prisma = new PrismaClient\(\);?\n?/g,
        replace: ''
    },
    {
        search: /import { PrismaClient } from ['""]@prisma\/client['""];?\nconst prisma = new PrismaClient\(\);?\n?/g,
        replace: ''
    }
];

// Import à ajouter si prisma est utilisé dans le fichier
const prismaImport = "import { prisma } from '@/lib/prisma';\n";

// Fonction pour vérifier si un fichier utilise prisma
function usesPrisma(content) {
    return content.includes('prisma.') ||
        content.includes('await prisma') ||
        content.includes('prisma.$') ||
        content.includes('prisma ');
}

// Fonction pour vérifier si l'import prisma existe déjà
function hasExistingPrismaImport(content) {
    return content.includes("from '@/lib/prisma'") ||
        content.includes('from "@/lib/prisma"');
}

// Fonction pour ajouter l'import au bon endroit
function addPrismaImport(content) {
    const lines = content.split('\n');
    let insertIndex = 0;

    // Trouver le bon endroit pour insérer l'import (après les autres imports)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith("import ")) {
            insertIndex = i + 1;
        } else if (lines[i].trim() === '' && insertIndex > 0) {
            // Ligne vide après les imports
            break;
        }
    }

    lines.splice(insertIndex, 0, prismaImport);
    return lines.join('\n');
}

// Fonction pour traiter un fichier
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Appliquer les patterns de remplacement
        patterns.forEach(pattern => {
            content = content.replace(pattern.search, pattern.replace);
        });

        // Si le fichier utilise prisma et n'a pas déjà l'import, l'ajouter
        if (usesPrisma(content) && !hasExistingPrismaImport(content)) {
            content = addPrismaImport(content);
        }

        // Nettoyer les lignes vides multiples
        content = content.replace(/\n{3,}/g, '\n\n');

        // Sauvegarder seulement si le contenu a changé
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Migré: ${path.relative(projectRoot, filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
        return false;
    }
}

// Fonction pour parcourir récursivement les fichiers
function walkDirectory(dir, callback) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Ignorer node_modules et .next
            if (!['node_modules', '.next', '.git'].includes(file)) {
                walkDirectory(filePath, callback);
            }
        } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
            callback(filePath);
        }
    });
}

// Script principal
function main() {
    console.log('🔄 Début de la migration vers le singleton Prisma...\n');

    let processedFiles = 0;
    let modifiedFiles = 0;

    // Traiter tous les fichiers JS/TS dans src/
    walkDirectory(srcDir, (filePath) => {
        processedFiles++;

        if (processFile(filePath)) {
            modifiedFiles++;
        }
    });

    console.log(`\n📊 Résumé de la migration:`);
    console.log(`   📁 Fichiers traités: ${processedFiles}`);
    console.log(`   ✏️  Fichiers modifiés: ${modifiedFiles}`);
    console.log(`   ✅ Fichiers inchangés: ${processedFiles - modifiedFiles}`);

    if (modifiedFiles > 0) {
        console.log(`\n🎉 Migration terminée avec succès !`);
        console.log(`\n📝 Prochaines étapes:`);
        console.log(`   1. Vérifiez que le fichier src/lib/prisma.js existe`);
        console.log(`   2. Testez votre application`);
        console.log(`   3. Commitez les changements`);
        console.log(`\n💡 Astuce: Surveillez les logs pour détecter les requêtes lentes`);
    } else {
        console.log(`\n✨ Aucune modification nécessaire - tout semble déjà correct !`);
    }
}

// Exécuter le script
main();