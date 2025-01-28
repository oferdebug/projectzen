'use client';
import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { auth } from '@/lib/auth';

interface Props {
    provider:string,
    onLoadingChange?: (loading:boolean)=>void;
    redirectUrl?: string;
}


//!SECTION Sperated component to handle OAuth sign-in
function OauthButtons ({isLoading, onLoadingChange, redirectUrl}:Props){
    const [internalLoading, setInternalLoading]=useState(false);
    const { toast }=useToast();
    const [searchParams, setSearchParams]=useSearchParams();

    //SECTION - handle redirectUrl
    const nextUrl=redirectUrl||searchParams.get('next')||'/projects';


    //SECTION - handle loading state
const loading = isLoading ?? internalLoading;
const setLoading =onLoadingChange ?? setInternalLoading;


    const handleOAuthSignIn = async (provider: 'github' | 'google') => {
        try {
            setLoading(true);
            await auth.signInWIthOAuth(provider, nextUrl);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid gird-cols-2 gap-4'>
            <Button
                variant='outline'
                type='button'
                disabled={loading}
                onClick={() => handleOAuthSignIn('github')}
            >
                <Icons.gitHub className='mr-2 h-4 w-4' />
                <span>Sign in with Github</span>
            </Button>
        </div>
    );


}
