// middleware.js - Middleware corrigé pour l'accès admin
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes qui nécessitent une authentification
const protectedRoutes = ["/profile/edit", "/create", "/drafts"];

// Routes d'authentification (rediriger si déjà connecté)
const authRoutes = ["/login", "/signup", "/forgot-password"];

// Routes publiques (toujours accessibles)
const publicRoutes = ["/", "/articles", "/categories", "/about", "/contact"];

// Routes d'administration (nécessitent un rôle admin) - SIMPLIFIÉES
const adminRoutes = ["/admin"];

// Routes de maintenance (toujours accessibles)
const maintenanceRoutes = ["/maintenance", "/api/settings"];

// Routes qui nécessitent seulement d'être connecté
const authOnlyRoutes = ["/secret-admin-access"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Vérifier l'authentification de base
  const isAuthenticated = !!token;
  let user = null;
  let isAdmin = false;

  // Si on a un token, le décoder pour obtenir les infos utilisateur
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        user = decoded;
        // Vérifier le rôle directement depuis le token JWT
        isAdmin = decoded.role === "admin";
      }
    } catch (error) {
      console.error("Token verification error:", error);
      // Token invalide, le supprimer
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Vérifier le mode maintenance (sauf pour les routes admin et maintenance)
  if (
    !adminRoutes.some((route) => pathname.startsWith(route)) &&
    !maintenanceRoutes.some((route) => pathname.startsWith(route))
  ) {
    try {
      // Vérifier le mode maintenance via l'API
      const settingsResponse = await fetch(
        `${request.nextUrl.origin}/api/settings`
      );
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();

        // Si le mode maintenance est activé, rediriger vers la page de maintenance
        if (settings.maintenanceMode && pathname !== "/maintenance") {
          return NextResponse.redirect(new URL("/maintenance", request.url));
        }

        // Si le mode maintenance est désactivé et qu'on est sur la page maintenance, rediriger vers l'accueil
        if (!settings.maintenanceMode && pathname === "/maintenance") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch (error) {
      console.error("Error checking maintenance mode:", error);
      // En cas d'erreur, continuer normalement
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
    // Si pas authentifié du tout, rediriger vers l'accès secret
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/secret-admin-access", request.url)
      );
    }

    // Si authentifié mais pas admin, rediriger avec message d'erreur
    if (!isAdmin) {
      return NextResponse.redirect(
        new URL("/?error=access-denied", request.url)
      );
    }

    // Si admin, permettre l'accès
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
    const loginUrl = new URL("/secret-admin-access", request.url);
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
