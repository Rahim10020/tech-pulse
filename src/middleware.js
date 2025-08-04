// middleware.js - Middleware simplifié pour l'authentification et maintenance
import { NextResponse } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = ['/profile/edit', '/create'];

// Routes d'authentification (rediriger si déjà connecté)
const authRoutes = ['/login', '/signup', '/forgot-password'];

// Routes publiques (toujours accessibles)
const publicRoutes = ['/', '/articles', '/categories', '/about'];

// Routes d'administration (toujours accessibles en mode maintenance)
const adminRoutes = ['/admin', '/secret-admin-access'];

// Routes de maintenance (toujours accessibles)
const maintenanceRoutes = ['/maintenance', '/api/settings'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Vérifier si l'utilisateur a un token (authentification basique)
  const isAuthenticated = !!token;

  // Vérifier le mode maintenance (sauf pour les routes admin et maintenance)
  if (!adminRoutes.some(route => pathname.startsWith(route)) && 
      !maintenanceRoutes.some(route => pathname.startsWith(route))) {
    
    try {
      // Vérifier le mode maintenance via l'API
      const settingsResponse = await fetch(`${request.nextUrl.origin}/api/settings`);
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        
        // Si le mode maintenance est activé, rediriger vers la page de maintenance
        if (settings.maintenanceMode && pathname !== '/maintenance') {
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
        
        // Si le mode maintenance est désactivé et qu'on est sur la page maintenance, rediriger vers l'accueil
        if (!settings.maintenanceMode && pathname === '/maintenance') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      // En cas d'erreur, continuer normalement
    }
  }

  // Permettre l'accès aux routes publiques
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Permettre l'accès aux routes d'administration
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Rediriger vers login si route protégée et non authentifié
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rediriger vers dashboard si route d'auth et déjà authentifié
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
