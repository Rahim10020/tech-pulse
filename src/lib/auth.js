// lib/auth.js - Utilitaires d'authentification avec JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation au démarrage de l'application
if (!JWT_SECRET) {
  console.error('🚨 ERREUR CRITIQUE: JWT_SECRET manquant dans les variables d\'environnement');
  console.error('💡 Ajoutez JWT_SECRET="votre-clé-ultra-secrète" dans votre fichier .env');
  console.error('🔧 Générez une clé sécurisée avec: openssl rand -base64 32');
  process.exit(1); // Arrêter l'application si pas de clé
}

// Validation de la qualité de la clé
if (JWT_SECRET.length < 32) {
  console.warn('⚠️  ATTENTION: JWT_SECRET trop court (< 32 caractères)');
  console.warn('🔧 Utilisez une clé plus longue pour une sécurité optimale');
}

// Créer un token JWT avec validation renforcée
export function createToken(payload) {
  try {
    // Ajouter des metadata de sécurité
    const enhancedPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000), // Issued at
      jti: crypto.randomUUID(), // JWT ID unique pour tracking
    };

    return jwt.sign(enhancedPayload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256', // Forcer l'algorithme pour éviter les attaques
      issuer: 'techpulse-app',
      audience: 'techpulse-users'
    });
  } catch (error) {
    console.error('Erreur création token JWT:', error);
    throw new Error('Impossible de créer le token d\'authentification');
  }
}

// Vérifier un token JWT avec validation renforcée
export function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Accepter seulement HS256
      issuer: 'techpulse-app',
      audience: 'techpulse-users'
    });

    // Vérifier que le token n'est pas trop ancien
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 7 * 24 * 60 * 60; // 7 jours en secondes
    
    if (decoded.iat && (now - decoded.iat) > maxAge) {
      console.warn('Token trop ancien, considéré comme invalide');
      return null;
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expiré');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Token invalide');
    } else {
      console.error('Erreur vérification token:', error.message);
    }
    return null;
  }
}

// Nouvelle fonction : Blacklist des tokens (optionnel)
const tokenBlacklist = new Set();

export function blacklistToken(token) {
  const decoded = decodeToken(token);
  if (decoded?.jti) {
    tokenBlacklist.add(decoded.jti);
  }
}

export function isTokenBlacklisted(token) {
  const decoded = decodeToken(token);
  return decoded?.jti ? tokenBlacklist.has(decoded.jti) : false;
}

// Middleware amélioré avec vérification blacklist
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'authentification requis',
        code: 'MISSING_TOKEN'
      });
    }

    // Vérifier si le token est blacklisté
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ 
        error: 'Token révoqué',
        code: 'REVOKED_TOKEN'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Token invalide ou expiré',
        code: 'INVALID_TOKEN'
      });
    }

    // Ajouter les données utilisateur à la requête
    req.user = decoded;
    return handler(req, res);
  };
}