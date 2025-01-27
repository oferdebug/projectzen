'use client';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { getAuthError } from '@/lib/getAuthError';
import { auth } from '@/lib/utils'; // Make sure to create this auth utility

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
            await auth.signIn(email, password);
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
                    <CardTitle className='text-2xl'>Log In</CardTitle>
                    <CardDescription className='text-sm'>Welcome Back</CardDescription>
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
                        <Input
                            id='password'
                            type='password'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        Don&apos;t have an account?{' '}
                        <Link href='/projectzen/create-account' className='text-blue-500'>
                            Create New Account
                        </Link>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
