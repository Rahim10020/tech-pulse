// lib/data.js - Données d'exemple pour TechPulse
export const sampleArticles = [
  {
    id: 1,
    slug: 'introduction-nextjs-app-router',
    title: "L'avenir de l'IA dans le développement logiciel",
    description: "Découvrez comment l'intelligence artificielle transforme le processus de création de logiciels, de l'automatisation des tâches à l'amélioration de la qualité du code.",
    content: "L'intelligence artificielle révolutionne le développement logiciel...",
    author: {
      id: 1,
      name: "Sophie Martin",
      username: "sophiemartin",
      avatar: null,
      bio: "Développeuse Full Stack passionnée par l'IA"
    },
    publishedAt: "2024-01-15",
    readTime: "10 min",
    category: "Intelligence Artificielle",
    tags: ["IA", "Développement", "Machine Learning"],
    imageColor: "bg-teal-100",
    likes: 125,
    comments: 32,
    featured: true
  },
  {
    id: 2,
    slug: 'securite-applications-web',
    title: "Les meilleures pratiques pour la sécurité des applications web",
    description: "Un guide complet sur les mesures de sécurité essentielles pour protéger vos applications web contre les vulnérabilités et les attaques.",
    content: "La sécurité des applications web est cruciale...",
    author: {
      id: 2,
      name: "Thomas Dubois",
      username: "thomasdubois",
      avatar: null,
      bio: "Expert en cybersécurité"
    },
    publishedAt: "2024-01-12",
    readTime: "15 min",
    category: "Cybersécurité",
    tags: ["Sécurité", "Web", "HTTPS", "Authentication"],
    imageColor: "bg-orange-100",
    likes: 89,
    comments: 24,
    featured: false
  },
  {
    id: 3,
    slug: 'frameworks-javascript-2024',
    title: "Les frameworks JavaScript les plus populaires en 2024",
    description: "Une comparaison des frameworks JavaScript les plus utilisés, mettant en évidence leurs avantages, leurs inconvénients et leurs cas d'utilisation idéaux.",
    content: "Le paysage JavaScript continue d'évoluer...",
    author: {
      id: 3,
      name: "Clara Dupont",
      username: "claradupont",
      avatar: null,
      bio: "Développeuse Frontend spécialisée en React"
    },
    publishedAt: "2024-01-10",
    readTime: "12 min",
    category: "Développement",
    tags: ["JavaScript", "React", "Vue", "Angular", "Svelte"],
    imageColor: "bg-amber-100",
    likes: 156,
    comments: 45,
    featured: true
  },
  {
    id: 4,
    slug: 'optimisation-performances-web',
    title: "Comment optimiser les performances de votre site web",
    description: "Des techniques et des outils pour améliorer la vitesse de chargement et la réactivité de votre site web, offrant une meilleure expérience utilisateur.",
    content: "L'optimisation des performances web est essentielle...",
    author: {
      id: 1,
      name: "Sophie Martin",
      username: "sophiemartin",
      avatar: null,
      bio: "Développeuse Full Stack passionnée par l'IA"
    },
    publishedAt: "2024-01-08",
    readTime: "8 min",
    category: "Développement",
    tags: ["Performance", "Optimisation", "Web", "UX"],
    imageColor: "bg-orange-100",
    likes: 78,
    comments: 19,
    featured: false
  },
  {
    id: 5,
    slug: 'introduction-cloud-computing',
    title: "Introduction au cloud computing : concepts et avantages",
    description: "Une introduction au cloud computing, expliquant les différents types de services cloud et les avantages qu'ils offrent aux entreprises et aux particuliers.",
    content: "Le cloud computing transforme la façon dont nous utilisons la technologie...",
    author: {
      id: 4,
      name: "Marc Leroy",
      username: "marcleroy",
      avatar: null,
      bio: "Architecte Cloud et DevOps"
    },
    publishedAt: "2024-01-05",
    readTime: "14 min",
    category: "Cloud Computing",
    tags: ["Cloud", "AWS", "Azure", "Infrastructure"],
    imageColor: "bg-teal-100",
    likes: 92,
    comments: 31,
    featured: false
  }
];

export const categories = [
  {
    id: 1,
    name: "Développement",
    slug: "developpement",
    description: "Tout sur le codage et les langages de programmation.",
    icon: "Code",
    color: "bg-blue-100",
    textColor: "text-blue-800",
    count: 15
  },
  {
    id: 2,
    name: "Intelligence Artificielle",
    slug: "intelligence-artificielle",
    description: "Les dernières avancées en IA et apprentissage automatique.",
    icon: "Brain",
    color: "bg-purple-100",
    textColor: "text-purple-800",
    count: 8
  },
  {
    id: 3,
    name: "Cybersécurité",
    slug: "cybersecurite",
    description: "Sécurité informatique et protection des données.",
    icon: "Shield",
    color: "bg-green-100",
    textColor: "text-green-800",
    count: 12
  },
  {
    id: 4,
    name: "Cloud Computing",
    slug: "cloud-computing",
    description: "Services et solutions cloud pour les entreprises.",
    icon: "Cloud",
    color: "bg-teal-100",
    textColor: "text-teal-800",
    count: 6
  },
  {
    id: 5,
    name: "Développement Mobile",
    slug: "developpement-mobile",
    description: "Création d'applications pour smartphones et tablettes.",
    icon: "Smartphone",
    color: "bg-orange-100",
    textColor: "text-orange-800",
    count: 9
  },
  {
    id: 6,
    name: "Réseaux",
    slug: "reseaux",
    description: "Fonctionnement et sécurité des réseaux informatiques.",
    icon: "Globe",
    color: "bg-gray-100",
    textColor: "text-gray-800",
    count: 4
  }
];

export const authors = [
  {
    id: 1,
    name: "Sophie Martin",
    username: "sophiemartin",
    email: "sophie@techpulse.com",
    avatar: null,
    bio: "Développeuse Full Stack passionnée par l'IA et les nouvelles technologies. 5 ans d'expérience en développement web moderne.",
    joinedAt: "2021-03-15",
    location: "Paris, France",
    website: "https://sophiemartin.dev",
    social: {
      twitter: "@sophiemartin_dev",
      linkedin: "sophie-martin-dev",
      github: "sophiemartin"
    },
    stats: {
      articles: 24,
      followers: 1250,
      following: 180
    },
    specialties: ["React", "Node.js", "IA", "TypeScript"]
  },
  {
    id: 2,
    name: "Thomas Dubois",
    username: "thomasdubois",
    email: "thomas@techpulse.com",
    avatar: null,
    bio: "Expert en cybersécurité avec plus de 8 ans d'expérience. Spécialisé dans la sécurité des applications web et la cryptographie.",
    joinedAt: "2020-11-22",
    location: "Lyon, France",
    website: "https://secureweb.fr",
    social: {
      twitter: "@thomas_sec",
      linkedin: "thomas-dubois-security"
    },
    stats: {
      articles: 18,
      followers: 890,
      following: 95
    },
    specialties: ["Cybersécurité", "Cryptographie", "Pentesting", "OWASP"]
  },
  {
    id: 3,
    name: "Clara Dupont",
    username: "claradupont",
    email: "clara@techpulse.com",
    avatar: null,
    bio: "Développeuse Frontend passionnée par l'expérience utilisateur et les interfaces modernes. Experte React et Vue.js.",
    joinedAt: "2022-01-10",
    location: "Bordeaux, France",
    website: "https://claradupont.fr",
    social: {
      twitter: "@clara_frontend",
      linkedin: "clara-dupont-frontend",
      github: "claradupont"
    },
    stats: {
      articles: 16,
      followers: 650,
      following: 220
    },
    specialties: ["React", "Vue.js", "UX/UI", "CSS", "Animation"]
  }
];

export const comments = [
  {
    id: 1,
    articleId: 1,
    author: {
      name: "Jean Dupont",
      username: "jeandupont",
      avatar: null
    },
    content: "Excellent article, Sophie ! J'ai particulièrement apprécié la clarté avec laquelle vous avez expliqué les différentes tendances de l'IA.",
    createdAt: "2024-01-16T10:30:00Z",
    likes: 5,
    replies: []
  },
  {
    id: 2,
    articleId: 1,
    author: {
      name: "Marie Dubois",
      username: "mariedubois",
      avatar: null
    },
    content: "Merci pour cet aperçu complet. Je suis curieuse de voir comment l'IA va continuer à évoluer dans les années à venir.",
    createdAt: "2024-01-17T14:15:00Z",
    likes: 3,
    replies: [
      {
        id: 3,
        author: {
          name: "Sophie Martin",
          username: "sophiemartin",
          avatar: null
        },
        content: "Merci Marie ! Je prépare justement un article sur les prédictions IA pour 2024.",
        createdAt: "2024-01-17T16:20:00Z",
        likes: 2
      }
    ]
  }
];

// Fonctions utilitaires pour manipuler les données
export function getArticleById(id) {
  return sampleArticles.find(article => article.id === parseInt(id));
}

export function getArticleBySlug(slug) {
  return sampleArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(categorySlug) {
  if (categorySlug === 'all' || !categorySlug) {
    return sampleArticles;
  }
  
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return sampleArticles.filter(article => 
    article.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );
}

export function getArticlesByAuthor(authorId) {
  return sampleArticles.filter(article => article.author.id === parseInt(authorId));
}

export function getFeaturedArticles() {
  return sampleArticles.filter(article => article.featured);
}

export function getRecentArticles(limit = 5) {
  return sampleArticles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

export function searchArticles(query) {
  const searchTerm = query.toLowerCase();
  return sampleArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.category.toLowerCase().includes(searchTerm)
  );
}

export function getCategoryBySlug(slug) {
  return categories.find(category => category.slug === slug);
}

export function getAuthorById(id) {
  return authors.find(author => author.id === parseInt(id));
}

export function getAuthorByUsername(username) {
  return authors.find(author => author.username === username);
}

export function getCommentsByArticleId(articleId) {
  return comments.filter(comment => comment.articleId === parseInt(articleId));
}