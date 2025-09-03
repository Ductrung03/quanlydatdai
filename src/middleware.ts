// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

const protectedRoutes = ['/admin', '/dashboard', '/profile'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/auth/login', '/auth/register', '/'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.vai_tro;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isLoggedIn && ['/auth/login', '/auth/register'].includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Check admin permissions
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};