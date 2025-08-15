// middleware.js - Middleware corrigé pour Edge Runtime
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

// Routes qui nécessitent une authentification
const protectedRoutes = ["/profile/edit", "/create", "/drafts"];

// Routes d'authentification (rediriger si déjà connecté)
const authRoutes = ["/login", "/signup", "/forgot-password"];

// Routes publiques (toujours accessibles)
const publicRoutes = ["/", "/articles", "/categories", "/about", "/contact"];

// Routes d'administration (nécessitent un rôle admin)
const adminRoutes = ["/admin"];

// Routes de maintenance (toujours accessibles)
const maintenanceRoutes = ["/maintenance", "/api/settings"];

// Routes qui nécessitent seulement d'être connecté
const authOnlyRoutes = ["/secret-admin-access"];

// Fonction de vérification JWT compatible Edge Runtime
async function verifyTokenEdge(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET manquant');
      return null;
    }

    // Utiliser jose pour l'Edge Runtime
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'techpulse-app',
      audience: 'techpulse-users'
    });

    // Vérifier que le token n'est pas trop ancien
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 7 * 24 * 60 * 60; // 7 jours en secondes
    
    if (payload.iat && (now - payload.iat) > maxAge) {
      console.warn('Token trop ancien, considéré comme invalide');
      return null;
    }

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

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("Middleware Debug:", {
    pathname,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "none",
  });

  // Permettre l'accès à toutes les routes API sans restrictions
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Permettre l'accès aux fichiers statiques et uploads
  if (pathname.startsWith("/_next/") || pathname.startsWith("/uploads/")) {
    return NextResponse.next();
  }

  // Vérifier l'authentification de base
  const isAuthenticated = !!token;
  let user = null;
  let isAdmin = false;

  // Si on a un token, le décoder pour obtenir les infos utilisateur
  if (token) {
    try {
      const decoded = await verifyTokenEdge(token);
      if (decoded) {
        user = decoded;
        // Vérifier le rôle directement depuis le token JWT
        isAdmin = decoded.role === "admin";

        console.log("User Debug:", {
          userId: decoded.userId,
          role: decoded.role,
          isAdmin,
          email: decoded.email,
        });
      } else {
        // Token invalide, le supprimer
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      // Token invalide, le supprimer
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Permettre l'accès aux routes publiques
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  // Vérifier l'accès aux routes d'administration
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    console.log("Admin route access check:", {
      pathname,
      isAuthenticated,
      isAdmin,
      userRole: user?.role,
    });

    // Si pas authentifié du tout, rediriger vers la page de login
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login page");
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    // Si authentifié mais pas admin, rediriger avec message d'erreur
    if (!isAdmin) {
      console.log("Not admin, access denied:", { userRole: user?.role });
      return NextResponse.redirect(
        new URL("/?error=access-denied", request.url)
      );
    }

    // Si admin, permettre l'accès
    console.log("Admin access granted");
    return NextResponse.next();
  }

  // Permettre l'accès aux routes qui nécessitent seulement d'être connecté
  if (authOnlyRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Rediriger vers login si route protégée et non authentifié
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rediriger vers dashboard si route d'auth et déjà authentifié
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - uploads (uploaded files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|uploads).*)",
  ],
};