// lib/utils.js - Main utilities file - Re-exports from specialized modules

// Re-export blog statistics functions
export { getBlogStats, getHomePageContent } from './blog-stats';

// Re-export search functions
export { globalSearch } from './search';

// Re-export tag functions
export { getAllTags, getPopularTags } from './tags';

// Re-export text processing functions
export {
  generateSlug,
  calculateReadTime,
  formatDate,
  getExcerpt,
  stripHtml,
  getHtmlExcerpt
} from './text-utils';

// Re-export authentication utilities
export {
  generatePasswordResetCode,
  generatePasswordResetToken,
  isExpired,
  isValidEmail
} from './auth-utils';