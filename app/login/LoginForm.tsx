'use client';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { OauthSignIn } from '@/components/auth/OAuthSignIn';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { clientSignIn } from '@/lib/auth';
import { getAuthError } from '@/lib/getAuthError';
import { PasswordInput } from '@/components/ui/password-input';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await clientSignIn(undefined, { email, password });
            if (result?.error) {
                throw new Error(result.error);
            }
            router.push('/dashboard');
        } catch (error) {
            toast({
                title: 'Error',
                description: getAuthError(error),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='w-96'>
            <form onSubmit={handleSubmit}>
                <CardHeader className='space-y-1'>
                    <CardDescription className='text-sm'>Welcome Back</CardDescription>
                    <CardTitle className='text-2xl'>Log In</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='youremailhere@example.com'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <Label htmlFor='password'>Password</Label>
                            <Link href='/forgot-password' className='text-sm text-blue-500'>
                                Forgot Password?
                            </Link>
                        </div>
                        <PasswordInput
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>

                    <div className="-mt-1">
                        <OauthSignIn isLoading={isLoading} onLoadingChange={setIsLoading} />
                        
                        <div className="mt-4 text-center">
                            Don&apos;t have an account?{' '}
                            <Link href='/create-account' className='text-blue-500'>
                                Create New Account
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}

export default LoginForm;