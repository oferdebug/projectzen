import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get('code');
        const next = requestUrl.searchParams.get('next') || '/projects';


        if (!code) {
            console.error('No Code Provided In Callback');
            throw new Error('No Code Provided');
        }

        const supabase = createClient(cookies());
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        

        if (error) {
            console.error('Error Authenticating User', error);
            throw error;
        }

        // Redirect to the next page
        return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
        console.error('Callback Error', error);
        // Add Error To The URL So We Can Display It In The AuthError Page
        const errorUrl = new URL('/auth/auth-error', request.url);
        errorUrl.searchParams.set('error', 'Failed To Sign In');
        return NextResponse.redirect(errorUrl);
    }
}

