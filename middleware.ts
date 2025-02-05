import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';



export async function middleware(request: NextRequest) {
    return await UpdateSession(request);
}


export const config = {
    matcher: [
        /*
        * Match all paths except /api/auth
        * - API routes can be accessed without authentication
        * - /api/auth is where the authentication logic is located
        */
        '/((?!api/auth).*)',
        '/api/auth/:path*',
        '/api/auth/callback',
        '/api/auth/callback/:path*',
        '/api/auth/callback/:path*',
        '/api/auth/callback/:path*',
    ],
}
