/**
 * Application Routes Constants
 * Centralize all route paths to avoid hardcoding strings throughout the app
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  ARTICLES: "/articles",
  CATEGORIES: "/categories",
  ABOUT: "/about",
  CONTACT: "/contact",
  SEARCH: "/search",

  // Authentication routes
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected user routes
  CREATE: "/create",
  DRAFTS: "/drafts",
  PROFILE_EDIT: "/profile/edit",

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ARTICLES: "/admin/articles",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_MANAGE_USERS: "/admin/manage-users",

  // Other routes
  MAINTENANCE: "/maintenance",
  SECRET_ADMIN_ACCESS: "/secret-admin-access",
};

/**
 * Dynamic route builders
 */
export const getArticleRoute = (slug) => `/articles/${slug}`;
export const getCategoryRoute = (category) => `/categories/${category}`;
export const getProfileRoute = (userId) => `/profile/${userId}`;
export const getAdminEditArticleRoute = (id) => `/admin/articles/${id}/edit`;
export const getCreateDraftRoute = (draftId) => `/create?draft=${draftId}`;
export const getArticlesWithQueryRoute = (query) => `/articles?${query}`;
export const getLoginWithCallbackRoute = (callbackUrl) =>
  `/login?callbackUrl=${callbackUrl}`;
