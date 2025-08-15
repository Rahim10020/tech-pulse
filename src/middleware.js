// middleware.js - Middleware
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

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

export async function middleware(request) {
  const { pathname } = request.nextUrl; // contient l'url de la requete. Le chemin de l'url est dans pathname
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
  const isAuthenticated = !!token; //conversion en boolean pur sans changer la valeur initiale
  let user = null;
  let isAdmin = false;             // par defaut l'utilisateur n'est pas un admin

  // Si on a un token, le décoder pour obtenir les infos utilisateur
  if (token) {
    try {
      const decoded = verifyToken(token);
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

    // Si pas authentifié du tout, rediriger vers l'accès secret
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to secret-admin-access");
      return NextResponse.redirect(
        new URL("/secret-admin-access", request.url)
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - uploads (uploaded files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|uploads).*)",
  ],
};
