"use client"

import { Icons } from './Icons';
import { Button } from './ui/button';
import { Suspense } from 'react';

function OAuthSignIn() {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <Button variant='outline' type='button'>
                <Icons.gitHub className='mr-2 h-4 w-4' />
                Sign In With Github
            </Button>
            <Button variant='outline' type='button'>
                <Icons.google className='mr-2 h-4 w-4' />
                Sign In With Google
            </Button>
        </div>
    );
}

export function OauthSignIn() {
    return (
        <div className='w-full'>
            <div className='relative mb-4'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                        Or continue with
                    </span>
                </div>
            </div>

            <Suspense
                fallback={
                    <div className='grid grid-cols-2 gap-4'>
                        <Button variant='outline' disabled>
                            <Icons.gitHub className='mr-2 h-4 w-4' />
                            Sign In With Github
                        </Button>
                        <Button variant='outline' disabled>
                            <Icons.google className='mr-2 h-4 w-4' />
                            Sign In With Google
                        </Button>
                    </div>
                }
            >
                <OAuthSignIn />
            </Suspense>
        </div>
    );
};

export default OauthSignIn;