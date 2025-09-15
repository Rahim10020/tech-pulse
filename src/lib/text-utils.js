/**
 * Text processing utilities
 */

/**
 * Génère un slug à partir d'un titre
 * @param {string} title - Le titre à convertir en slug
 * @returns {string} Le slug généré
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/[\s_-]+/g, '-') // Remplacer les espaces par des tirets
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets au début/fin
}

/**
 * Calcule le temps de lecture estimé d'un contenu
 * @param {string} content - Le contenu texte
 * @returns {string} Le temps de lecture estimé en minutes
 */
export function calculateReadTime(content) {
    const wordsPerMinute = 200; // Vitesse moyenne de lecture
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min`;
}

/**
 * Formate une date selon la locale spécifiée
 * @param {string|Date} date - La date à formater
 * @param {string} locale - La locale pour le formatage (défaut: 'fr-FR')
 * @returns {string} La date formatée
 */
export function formatDate(date, locale = 'fr-FR') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Obtient un extrait d'un texte avec une longueur maximale
 * @param {string} text - Le texte source
 * @param {number} maxLength - La longueur maximale de l'extrait (défaut: 150)
 * @returns {string} L'extrait du texte
 */
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

/**
 * Nettoie le HTML et obtient du texte brut
 * @param {string} html - Le contenu HTML à nettoyer
 * @returns {string} Le texte brut sans balises HTML
 */
export function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Obtient un extrait d'un contenu HTML
 * @param {string} htmlContent - Le contenu HTML source
 * @param {number} maxLength - La longueur maximale de l'extrait (défaut: 150)
 * @returns {string} L'extrait du contenu HTML
 */
export function getHtmlExcerpt(htmlContent, maxLength = 150) {
    const textOnly = stripHtml(htmlContent);
    return getExcerpt(textOnly, maxLength);
}