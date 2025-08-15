// ========================================
// 2. CRÉER src/lib/rate-limit.js
// ========================================

import { NextResponse } from 'next/server';

// Configuration des limites par type d'endpoint
const RATE_LIMITS = {
  // Authentification - très strict
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives par IP
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    skipSuccessfulRequests: true // Ne pas compter les connexions réussies
  },
  
  // Upload de fichiers - strict
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads par minute
    message: 'Trop d\'uploads. Attendez 1 minute.',
    skipSuccessfulRequests: false
  },
  
  // API générale - modéré
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requêtes par minute
    message: 'Trop de requêtes. Ralentissez un peu.',
    skipSuccessfulRequests: true
  },
  
  // Contact/Email - très strict
  contact: {
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // 3 messages par heure
    message: 'Trop de messages envoyés. Attendez 1 heure.',
    skipSuccessfulRequests: false
  },
  
  // Création de compte - strict
  signup: {
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // 3 comptes par IP par heure
    message: 'Trop de créations de compte. Attendez 1 heure.',
    skipSuccessfulRequests: false
  }
};

// Store en mémoire pour le rate limiting (en production, utilisez Redis)
class InMemoryStore {
  constructor() {
    this.clients = new Map();
    this.resetTime = new Map();
  }

  increment(key, windowMs) {
    const now = Date.now();
    
    // Nettoyer les entrées expirées
    if (this.resetTime.has(key) && now > this.resetTime.get(key)) {
      this.clients.delete(key);
      this.resetTime.delete(key);
    }
    
    // Initialiser ou incrémenter
    const current = this.clients.get(key) || 0;
    const newCount = current + 1;
    
    this.clients.set(key, newCount);
    
    if (!this.resetTime.has(key)) {
      this.resetTime.set(key, now + windowMs);
    }
    
    return {
      current: newCount,
      remaining: Math.max(0, this.getLimit(key) - newCount),
      resetTime: this.resetTime.get(key)
    };
  }
  
  getLimit(key) {
    // Extraire le type de limite depuis la clé
    for (const [type, config] of Object.entries(RATE_LIMITS)) {
      if (key.includes(type)) {
        return config.max;
      }
    }
    return RATE_LIMITS.api.max; // Par défaut
  }
  
  get(key) {
    const current = this.clients.get(key) || 0;
    const resetTime = this.resetTime.get(key) || Date.now();
    
    return {
      current,
      remaining: Math.max(0, this.getLimit(key) - current),
      resetTime
    };
  }
}

const store = new InMemoryStore();

// Fonction pour obtenir l'IP du client
function getClientIP(request) {
  // Vérifier les headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfIP) {
    return cfIP;
  }
  
  // Fallback (ne fonctionne pas avec les proxies)
  return request.ip || '127.0.0.1';
}

// Middleware de rate limiting
export function withRateLimit(type = 'api') {
  return function(handler) {
    return async (request, ...args) => {
      const config = RATE_LIMITS[type];
      if (!config) {
        console.warn(`Type de rate limit inconnu: ${type}`);
        return handler(request, ...args);
      }
      
      const ip = getClientIP(request);
      const key = `${type}:${ip}`;
      
      // Incrémenter le compteur
      const result = store.increment(key, config.windowMs);
      
      // Vérifier si la limite est dépassée
      if (result.current > config.max) {
        console.warn(`Rate limit dépassé pour ${ip} sur ${type}: ${result.current}/${config.max}`);
        
        return NextResponse.json(
          {
            error: config.message,
            code: 'RATE_LIMIT_EXCEEDED',
            type: type,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          },
          {
            status: 429, // Too Many Requests
            headers: {
              'X-RateLimit-Limit': config.max.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString(),
              'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
            }
          }
        );
      }
      
      // Ajouter les headers de rate limit à la réponse
      const response = await handler(request, ...args);
      
      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', config.max.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      }
      
      return response;
    };
  };
}

// Rate limiting conditionnel (plus strict pour les échecs)
export function withConditionalRateLimit(type = 'api') {
  return function(handler) {
    return async (request, ...args) => {
      const response = await handler(request, ...args);
      
      // Si c'est une réponse d'erreur (4xx, 5xx), appliquer le rate limiting
      if (response instanceof NextResponse && response.status >= 400) {
        const rateLimitedHandler = withRateLimit(type)(handler);
        return rateLimitedHandler(request, ...args);
      }
      
      return response;
    };
  };
}

// Fonction pour nettoyer le store (à appeler périodiquement)
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, resetTime] of store.resetTime.entries()) {
    if (now > resetTime) {
      store.clients.delete(key);
      store.resetTime.delete(key);
    }
  }
}

// Nettoyer automatiquement toutes les heures
setInterval(cleanupRateLimit, 60 * 60 * 1000);
