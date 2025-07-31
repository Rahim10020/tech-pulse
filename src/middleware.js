// middleware.js - Middleware simplifié pour l'authentification
import { NextResponse } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = ['/profile/edit', '/create'];

// Routes d'authentification (rediriger si déjà connecté)
const authRoutes = ['/login', '/signup', '/forgot-password'];

// Routes publiques (toujours accessibles)
const publicRoutes = ['/', '/articles', '/categories', '/about'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Vérifier si l'utilisateur a un token (authentification basique)
  const isAuthenticated = !!token;

  // Permettre l'accès aux routes publiques
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
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
