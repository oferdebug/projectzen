/**
 * Server-side Supabase client utilities for handling authentication and data access
 * within Server Components and API routes.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client instance for server-side operations
 * with cookie-based session management.
 * 
 * @param cookieStore - Next.js cookie store from headers
 * @returns Supabase client instance with cookie middleware
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Retrieves a cookie value by name from the cookie store
         */
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },

        /**
         * Sets a cookie with the specified name, value, and options
         * Note: This may fail silently in Server Components, which is handled by
         * the middleware refresh mechanism
         */
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set(name, value, options);
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },

        /**
         * Removes a cookie by setting its value to empty and maxAge to 0
         * Note: This may fail silently in Server Components, which is handled by
         * the middleware refresh mechanism
         */
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set(name, "", { ...options, maxAge: 0 });
          } catch {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      },
    }
  );
};
