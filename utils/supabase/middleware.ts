/**
 * Middleware utilities for handling Supabase authentication and session management
 * in Next.js Edge Runtime environment.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * List of public paths that don't require authentication
 * These paths will bypass the authentication check in middleware
 * @todo Implement path matching logic in middleware
 */
const publicPaths = [
  '/', // Landing page
  '/login', // Auth pages
  '/create-account',
  '/forgot-password',
  '/auth/callback',
  '/auth/reset-password',
  '/auth/auth-error',
  '/profile/:id', // Public profile pages - using path pattern
] as const;

/**
 * Checks if the given path matches any of the public paths patterns
 * Handles both exact matches and path patterns with parameters
 */
function isPublicPath(path: string): boolean {
  return publicPaths.some(pattern => {
    // Handle path patterns with parameters (e.g., '/profile/:id')
    if (pattern.includes(':')) {
      const regexPattern = pattern.replace(/:[\w-]+/g, '[\\w-]+');
      return new RegExp(`^${regexPattern}$`).test(path);
    }
    // Exact match for regular paths
    return pattern === path;
  });
}

/**
 * Updates the user session in middleware
 * This function is called for every request to update the session state
 * and handle authentication
 * 
 * @param request - Incoming Next.js request object
 * @returns NextResponse with updated cookies and headers
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths without authentication
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Create a response object that we can modify with new headers
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured for the Edge Runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Get all cookies from the request
         */
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        /**
         * Set multiple cookies in the response
         */
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options);
        },
        /**
         * Remove a cookie by setting its value to empty and maxAge to 0
         */
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh the session and get the user
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if no session and path requires authentication
  if (!session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  return { response, session };
}