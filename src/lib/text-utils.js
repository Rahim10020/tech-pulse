// lib/text-utils.js - Text processing utilities

// Fonction pour générer un slug à partir d'un titre
export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/[\s_-]+/g, '-') // Remplacer les espaces par des tirets
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets au début/fin
}

// Fonction pour calculer le temps de lecture estimé
export function calculateReadTime(content) {
    const wordsPerMinute = 200; // Vitesse moyenne de lecture
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min`;
}

// Fonction pour formater une date
export function formatDate(date, locale = 'fr-FR') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Fonction pour obtenir un extrait d'un texte
export function getExcerpt(text, maxLength = 150) {
    if (text.length <= maxLength) {
        return text;
    }

    const excerpt = text.substring(0, maxLength);
    const lastSpaceIndex = excerpt.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
        return excerpt.substring(0, lastSpaceIndex) + '...';
    }

    return excerpt + '...';
}

// Fonction pour nettoyer le HTML et obtenir du texte brut
export function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Fonction pour obtenir un extrait d'un contenu HTML
export function getHtmlExcerpt(htmlContent, maxLength = 150) {
    const textOnly = stripHtml(htmlContent);
    return getExcerpt(textOnly, maxLength);
}