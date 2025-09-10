// lib/auth-roles.js - Helpers pour la gestion des rôles

// Définition des rôles et permissions
export const ROLES = {
  ADMIN: 'admin',
  PUBLISHER: 'publisher',
  READER: 'reader'
};

export const PERMISSIONS = {
  // Articles
  CREATE_ARTICLE: 'create_article',
  EDIT_ARTICLE: 'edit_article',
  DELETE_ARTICLE: 'delete_article',
  PUBLISH_ARTICLE: 'publish_article',

  // Commentaires
  CREATE_COMMENT: 'create_comment',
  MODERATE_COMMENT: 'moderate_comment',
  DELETE_ANY_COMMENT: 'delete_any_comment',

  // Utilisateurs
  MANAGE_USERS: 'manage_users',
  CHANGE_USER_ROLE: 'change_user_role',

  // Likes
  LIKE_ARTICLE: 'like_article',

  // Catégories/Tags
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_TAGS: 'manage_tags'
};

// Mapping des rôles vers les permissions
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_ARTICLE,
    PERMISSIONS.DELETE_ARTICLE,
    PERMISSIONS.PUBLISH_ARTICLE,
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.MODERATE_COMMENT,
    PERMISSIONS.DELETE_ANY_COMMENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CHANGE_USER_ROLE,
    PERMISSIONS.LIKE_ARTICLE,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TAGS
  ],
  [ROLES.PUBLISHER]: [
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_ARTICLE,
    PERMISSIONS.PUBLISH_ARTICLE,
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.LIKE_ARTICLE
  ],
  [ROLES.READER]: [
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.LIKE_ARTICLE
  ]
};

// Vérifier si un utilisateur a un rôle spécifique
export function hasRole(user, role) {
  return user?.role === role;
}

// Vérifier si un utilisateur est admin
export function isAdmin(user) {
  return hasRole(user, ROLES.ADMIN);
}

// Vérifier si un utilisateur est reader
export function isReader(user) {
  return hasRole(user, ROLES.READER);
}

// Vérifier si un utilisateur est publisher
export function isPublisher(user) {
  return hasRole(user, ROLES.PUBLISHER);
}

// Vérifier si un utilisateur a une permission spécifique
export function hasPermission(user, permission) {
  if (!user || !user.role) return false;

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

// Vérifier plusieurs permissions (OU logique)
export function hasAnyPermission(user, permissions) {
  return permissions.some(permission => hasPermission(user, permission));
}

// Vérifier plusieurs permissions (ET logique)
export function hasAllPermissions(user, permissions) {
  return permissions.every(permission => hasPermission(user, permission));
}

// Vérifier si un utilisateur peut écrire des articles
export function canWriteArticles(user) {
  return hasPermission(user, PERMISSIONS.CREATE_ARTICLE);
}

// Vérifier si un utilisateur peut modérer
export function canModerate(user) {
  return hasAnyPermission(user, [
    PERMISSIONS.MODERATE_COMMENT,
    PERMISSIONS.DELETE_ANY_COMMENT,
    PERMISSIONS.MANAGE_USERS
  ]);
}

// Vérifier si un utilisateur peut gérer les autres utilisateurs
export function canManageUsers(user) {
  return hasPermission(user, PERMISSIONS.MANAGE_USERS);
}

// Middleware pour les API routes
export function withRoleAuth(allowedRoles = []) {
  return function (handler) {
    return async (req, res) => {
      try {
        // Récupérer le token
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Token manquant',
            code: 'MISSING_TOKEN'
          });
        }

        // Vérifier le token (tu dois avoir cette fonction dans lib/auth.js)
        const { verifyToken } = await import('./auth.js');
        const decoded = await verifyToken(token);

        if (!decoded) {
          return res.status(401).json({
            success: false,
            error: 'Token invalide',
            code: 'INVALID_TOKEN'
          });
        }

        // Récupérer l'utilisateur complet avec son rôle
        const { getUserById } = await import('./auth-db.js');
        const user = await getUserById(decoded.userId);

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Utilisateur non trouvé',
            code: 'USER_NOT_FOUND'
          });
        }

        // Vérifier les rôles autorisés
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          return res.status(403).json({
            success: false,
            error: 'Accès refusé - Permissions insuffisantes',
            code: 'INSUFFICIENT_PERMISSIONS'
          });
        }

        // Ajouter les données utilisateur à la requête
        req.user = user;
        return handler(req, res);

      } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
          success: false,
          error: 'Erreur serveur',
          code: 'INTERNAL_ERROR'
        });
      }
    };
  };
}

// Composant React pour vérifier les permissions
export function PermissionGate({ user, permission, fallback = null, children }) {
  if (hasPermission(user, permission)) {
    return children;
  }
  return fallback;
}

// Hook React pour les permissions
export function usePermissions(user) {
  return {
    isAdmin: isAdmin(user),
    isReader: isReader(user),
    canWriteArticles: canWriteArticles(user),
    canModerate: canModerate(user),
    canManageUsers: canManageUsers(user),
    hasPermission: (permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions)
  };
}