// lib/auth.js - Compatible avec Edge Runtime et Node.js
import { SignJWT, jwtVerify } from 'jose';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation stricte au chargement - BLOQUANTE pour la sécurité
if (!JWT_SECRET) {
  throw new Error(
    '❌ JWT_SECRET manquant dans les variables d\'environnement.\n' +
    'Ajoutez JWT_SECRET dans votre fichier .env avec au moins 64 caractères aléatoires.'
  );
}

// Validation de la qualité de la clé - minimum 64 caractères pour HS256
if (JWT_SECRET.length < 64) {
  throw new Error(
    `❌ JWT_SECRET trop court (${JWT_SECRET.length} caractères).\n` +
    'Pour une sécurité optimale avec HS256, utilisez au moins 64 caractères.\n' +
    'Générez une clé sécurisée : openssl rand -base64 64'
  );
}

// Convertir l'expiration en secondes
function parseExpiresIn(expiresIn) {
  if (typeof expiresIn === 'number') return expiresIn;

  const match = expiresIn.match(/^(\d+)([dwh])$/);
  if (!match) return 7 * 24 * 60 * 60; // 7 jours par défaut

  const [, num, unit] = match;
  const value = parseInt(num);

  switch (unit) {
    case 'd': return value * 24 * 60 * 60;
    case 'w': return value * 7 * 24 * 60 * 60;
    case 'h': return value * 60 * 60;
    default: return value;
  }
}

// Créer un token JWT avec jose (compatible Edge Runtime)
export async function createToken(payload) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET manquant');
    }
    const secret = new TextEncoder().encode(JWT_SECRET);
    const expiresInSeconds = parseExpiresIn(JWT_EXPIRES_IN);

    // Ajouter des metadata de sécurité
    const enhancedPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(), // UUID aléatoire
    };

    const jwt = await new SignJWT(enhancedPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
      .setIssuer('pixelpulse-app')
      .setAudience('pixelpulse-users')
      .sign(secret);

    return jwt;
  } catch (error) {
    console.error('Erreur création token JWT:', error);
    throw new Error('Impossible de créer le token d\'authentification');
  }
}

// Vérifier un token JWT avec jose (compatible Edge Runtime)
export async function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    if (!JWT_SECRET) {
      console.error('JWT_SECRET manquant');
      return null;
    }
    const secret = new TextEncoder().encode(JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'pixelpulse-app',
      audience: 'pixelpulse-users'
    });

    // jwtVerify vérifie automatiquement l'expiration (exp claim)
    // Pas besoin de vérification manuelle de l'âge du token
    return payload;
  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.log('Token expiré');
    } else if (error.code === 'ERR_JWT_INVALID') {
      console.log('Token invalide');
    } else {
      console.error('Erreur vérification token:', error.message);
    }
    return null;
  }
}

// Fonction pour décoder un token sans vérification (pour la blacklist)
export function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

// Blacklist des tokens (optionnel)
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

    const decoded = await verifyToken(token);
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

// NextAuth configuration
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only include Google provider if credentials are properly configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' &&
      process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret'
      ? [Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })]
      : []
    ),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          // Check if user exists with this Google ID
          let existingUser = await prisma.user.findUnique({
            where: { googleId: profile.sub }
          });

          if (!existingUser) {
            // Check if user exists with this email
            existingUser = await prisma.user.findUnique({
              where: { email: profile.email }
            });

            if (existingUser) {
              // Link Google account to existing user
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: profile.sub,
                  provider: 'google',
                  avatar: profile.picture || existingUser.avatar,
                }
              });
            } else {
              // Create new user
              const username = profile.email.split('@')[0] + Math.random().toString(36).substring(2, 8);
              existingUser = await prisma.user.create({
                data: {
                  name: profile.name,
                  username: username,
                  email: profile.email,
                  googleId: profile.sub,
                  provider: 'google',
                  avatar: profile.picture,
                }
              });
            }
          }

          user.id = existingUser.id;
          user.role = existingUser.role;
          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: JWT_SECRET,
};

export default NextAuth(authOptions);