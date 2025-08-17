// prisma/seed.js - Script pour insérer des données de test
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // 1. Créer les catégories
  console.log('Création des catégories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'developpement' },
      update: {},
      create: {
        name: 'Développement',
        slug: 'developpement',
        description: 'Tout sur le codage et les langages de programmation.',
        icon: 'Code',
        color: 'bg-blue-100',
        textColor: 'text-blue-800'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'intelligence-artificielle' },
      update: {},
      create: {
        name: 'Intelligence Artificielle',
        slug: 'intelligence-artificielle',
        description: 'Les dernières avancées en IA et apprentissage automatique.',
        icon: 'Brain',
        color: 'bg-purple-100',
        textColor: 'text-purple-800'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'cybersecurite' },
      update: {},
      create: {
        name: 'Cybersécurité',
        slug: 'cybersecurite',
        description: 'Sécurité informatique et protection des données.',
        icon: 'Shield',
        color: 'bg-green-100',
        textColor: 'text-green-800'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'cloud-computing' },
      update: {},
      create: {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Services et solutions cloud pour les entreprises.',
        icon: 'Cloud',
        color: 'bg-teal-100',
        textColor: 'text-teal-800'
      }
    })
  ]);

  // 2. Créer les tags
  console.log('Création des tags...');
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'JavaScript', slug: 'javascript' }
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' }
    }),
    prisma.tag.upsert({
      where: { slug: 'ia' },
      update: {},
      create: { name: 'IA', slug: 'ia' }
    }),
    prisma.tag.upsert({
      where: { slug: 'machine-learning' },
      update: {},
      create: { name: 'Machine Learning', slug: 'machine-learning' }
    }),
    prisma.tag.upsert({
      where: { slug: 'securite' },
      update: {},
      create: { name: 'Sécurité', slug: 'securite' }
    }),
    prisma.tag.upsert({
      where: { slug: 'cloud' },
      update: {},
      create: { name: 'Cloud', slug: 'cloud' }
    }),
    prisma.tag.upsert({
      where: { slug: 'aws' },
      update: {},
      create: { name: 'AWS', slug: 'aws' }
    })
  ]);

  // 3. Créer les utilisateurs
  console.log('Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sophie@pixelpulse.com' },
      update: {},
      create: {
        name: 'Sophie Martin',
        username: 'sophiemartin',
        email: 'sophie@pixelpulse.com',
        password: hashedPassword,
        bio: 'Développeuse Full Stack passionnée par l\'IA et les nouvelles technologies. 5 ans d\'expérience en développement web moderne.',
        location: 'Paris, France',
        website: 'https://sophiemartin.dev',
        twitter: '@sophiemartin_dev',
        linkedin: 'sophie-martin-dev',
        github: 'sophiemartin'
      }
    }),
    prisma.user.upsert({
      where: { email: 'thomas@pixelpulse.com' },
      update: {},
      create: {
        name: 'Thomas Dubois',
        username: 'thomasdubois',
        email: 'thomas@pixelpulse.com',
        password: hashedPassword,
        bio: 'Expert en cybersécurité avec plus de 8 ans d\'expérience. Spécialisé dans la sécurité des applications web et la cryptographie.',
        location: 'Lyon, France',
        website: 'https://secureweb.fr',
        twitter: '@thomas_sec',
        linkedin: 'thomas-dubois-security'
      }
    }),
    prisma.user.upsert({
      where: { email: 'clara@pixelpulse.com' },
      update: {},
      create: {
        name: 'Clara Dupont',
        username: 'claradupont',
        email: 'clara@pixelpulse.com',
        password: hashedPassword,
        bio: 'Développeuse Frontend passionnée par l\'expérience utilisateur et les interfaces modernes. Experte React et Vue.js.',
        location: 'Bordeaux, France',
        website: 'https://claradupont.fr',
        twitter: '@clara_frontend',
        linkedin: 'clara-dupont-frontend',
        github: 'claradupont'
      }
    }),
    prisma.user.upsert({
      where: { email: 'marc@pixelpulse.com' },
      update: {},
      create: {
        name: 'Marc Leroy',
        username: 'marcleroy',
        email: 'marc@pixelpulse.com',
        password: hashedPassword,
        bio: 'Architecte Cloud et DevOps avec une passion pour l\'automatisation et l\'infrastructure moderne.',
        location: 'Toulouse, France',
        website: 'https://marcleroy.tech',
        github: 'marcleroy'
      }
    })
  ]);

  // 4. Créer quelques articles avec tags
  console.log('Création des articles...');

  const article1 = await prisma.article.upsert({
    where: { slug: 'avenir-ia-developpement-logiciel' },
    update: {},
    create: {
      title: "L'avenir de l'IA dans le développement logiciel",
      slug: 'avenir-ia-developpement-logiciel',
      description: "Découvrez comment l'intelligence artificielle transforme le processus de création de logiciels, de l'automatisation des tâches à l'amélioration de la qualité du code.",
      content: `L'intelligence artificielle révolutionne le développement logiciel de manière spectaculaire. 

## L'automatisation du code

Les outils comme GitHub Copilot et ChatGPT changent la façon dont nous écrivons du code. Ces assistants IA peuvent :

- Générer du code à partir de commentaires en langage naturel
- Détecter et corriger automatiquement les bugs
- Optimiser les performances du code existant
- Suggérer des améliorations architecturales

## Impact sur les développeurs

Cette révolution ne remplace pas les développeurs, mais transforme leur rôle :

1. **Plus de temps pour la créativité** : Moins de code répétitif, plus de focus sur l'innovation
2. **Amélioration de la qualité** : L'IA aide à détecter les erreurs plus rapidement
3. **Apprentissage accéléré** : Les nouveaux développeurs peuvent apprendre plus vite

## L'avenir proche

Dans les prochaines années, nous verrons probablement :
- Des IDEs entièrement intégrés à l'IA
- La génération automatique de tests
- Des architectures logicielles auto-optimisées

L'IA devient un partenaire indispensable pour tout développeur moderne.`,
      authorId: users[0].id,
      categoryId: categories[1].id, // Intelligence Artificielle
      featured: true,
      readTime: '8 min',
      imageColor: 'bg-purple-100',
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'ia').id },
          { id: tags.find(t => t.slug === 'machine-learning').id }
        ]
      }
    }
  });

  const article2 = await prisma.article.upsert({
    where: { slug: 'guide-api-rest-nextjs-15' },
    update: {},
    create: {
      title: "Guide complet : Créer une API REST avec Next.js 15",
      slug: 'guide-api-rest-nextjs-15',
      description: "Apprenez à construire une API REST moderne et performante avec Next.js 15, incluant l'authentification, la validation et les bonnes pratiques.",
      content: `Next.js 15 révolutionne la création d'APIs avec son App Router et ses nouvelles fonctionnalités.

## Pourquoi Next.js pour une API ?

Next.js offre plusieurs avantages pour créer des APIs :

- **Simplicité** : Route handlers intégrés
- **Performance** : Optimisations automatiques
- **TypeScript** : Support natif et excellent
- **Déploiement** : Facilité avec Vercel

## Structure d'une API Route

\`\`\`javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request) {
  const data = await request.json();
  const user = await db.user.create({ data });
  return NextResponse.json(user, { status: 201 });
}
\`\`\`

## Authentification JWT

L'intégration d'un système d'auth JWT est simple :

\`\`\`javascript
import jwt from 'jsonwebtoken';

export function verifyToken(request) {
  const token = request.headers.get('authorization');
  return jwt.verify(token, process.env.JWT_SECRET);
}
\`\`\`

## Bonnes pratiques

1. **Validation des données** avec Zod
2. **Gestion d'erreurs** centralisée
3. **Rate limiting** pour la sécurité
4. **Documentation** avec OpenAPI

Next.js 15 rend la création d'APIs à la fois puissante et accessible !`,
      authorId: users[0].id,
      categoryId: categories[0].id, // Développement
      featured: true,
      readTime: '12 min',
      imageColor: 'bg-blue-100',
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'nextjs').id },
          { id: tags.find(t => t.slug === 'javascript').id }
        ]
      }
    }
  });

  const article3 = await prisma.article.upsert({
    where: { slug: 'securiser-application-web-2024' },
    update: {},
    create: {
      title: "Sécuriser votre application web : Guide des bonnes pratiques 2024",
      slug: 'securiser-application-web-2024',
      description: "Un guide complet des meilleures pratiques de sécurité pour protéger vos applications web contre les vulnérabilités et attaques modernes.",
      content: `La sécurité web n'a jamais été aussi critique qu'en 2024. Voici les pratiques essentielles.

## Les vulnérabilités les plus courantes

### 1. Injection SQL
Toujours utiliser des requêtes préparées :

\`\`\`sql
-- ❌ Vulnérable
SELECT * FROM users WHERE id = \${userInput}

-- ✅ Sécurisé
SELECT * FROM users WHERE id = ?
\`\`\`

### 2. XSS (Cross-Site Scripting)
- Échapper toutes les données utilisateur
- Utiliser Content Security Policy (CSP)
- Valider côté serveur ET client

### 3. CSRF (Cross-Site Request Forgery)
- Tokens CSRF sur tous les formulaires
- Vérification de l'origine des requêtes
- SameSite cookies

## Authentification moderne

### JWT sécurisé
\`\`\`javascript
// Bonnes pratiques JWT
const token = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  { 
    expiresIn: '15m',
    algorithm: 'HS256'
  }
);
\`\`\`

### Gestion des sessions
- Refresh tokens pour la persistance
- Invalidation côté serveur
- Rotation automatique des tokens

## Sécurité infrastructure

1. **HTTPS partout** : Même en développement
2. **Headers de sécurité** : HSTS, CSP, X-Frame-Options
3. **Rate limiting** : Prévenir les attaques par déni de service
4. **Monitoring** : Logs et alertes automatiques

## Outils recommandés

- **Helmet.js** : Headers de sécurité automatiques
- **bcrypt** : Hachage des mots de passe
- **express-rate-limit** : Protection contre le spam
- **OWASP ZAP** : Tests de sécurité automatisés

La sécurité est un processus continu, pas une destination !`,
      authorId: users[1].id,
      categoryId: categories[2].id, // Cybersécurité
      featured: false,
      readTime: '15 min',
      imageColor: 'bg-green-100',
      tags: {
        connect: [
          { id: tags.find(t => t.slug === 'securite').id },
          { id: tags.find(t => t.slug === 'javascript').id }
        ]
      }
    }
  });

  // 5. Créer quelques commentaires
  console.log('Création des commentaires...');

  // Vérifier si les commentaires existent déjà
  const existingComment1 = await prisma.comment.findFirst({
    where: { articleId: article1.id, authorId: users[1].id }
  });

  if (!existingComment1) {
    await prisma.comment.create({
      data: {
        content: "Excellent article Sophie ! J'ai particulièrement apprécié la partie sur GitHub Copilot. C'est vrai que ça change vraiment la donne pour la productivité.",
        authorId: users[1].id,
        articleId: article1.id
      }
    });
  }

  const existingComment2 = await prisma.comment.findFirst({
    where: { articleId: article2.id, authorId: users[2].id }
  });

  if (!existingComment2) {
    await prisma.comment.create({
      data: {
        content: "Merci pour ce guide très détaillé ! La partie sur l'authentification JWT est particulièrement utile. Avez-vous des recommandations pour le rate limiting ?",
        authorId: users[2].id,
        articleId: article2.id
      }
    });
  }

  // 6. Créer quelques likes
  console.log('Création des likes...');

  // Vérifier si les likes existent déjà (contrainte unique)
  const likes = [
    { userId: users[1].id, articleId: article1.id },
    { userId: users[2].id, articleId: article1.id },
    { userId: users[0].id, articleId: article2.id }
  ];

  for (const like of likes) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: like.userId,
          articleId: like.articleId
        }
      }
    });

    if (!existingLike) {
      await prisma.like.create({ data: like });
    }
  }

  console.log('Seeding terminé avec succès !');

  // Statistiques
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.article.count(),
    prisma.comment.count(),
    prisma.like.count()
  ]);

  console.log(`
Données créées :
- ${stats[0]} utilisateurs
- ${stats[1]} catégories  
- ${stats[2]} tags
- ${stats[3]} articles
- ${stats[4]} commentaires
- ${stats[5]} likes
  `);
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });