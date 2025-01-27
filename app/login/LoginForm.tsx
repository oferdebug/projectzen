'use client';
import { useState } from 'react';

import { useRouter } from 'next/router';
import { Input } from 'postcss';

import {
    Card,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/utils/auth';
import { getAuthError } from '@/utils/auth-errors';

export function LoginForm {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
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
    }
    return (
        <Card className='w-96'>
            <form>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>Log In</CardTitle>
                    <CardDescription className='text-sm'>Welcome Back</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div>
                        Don't have an account?{' '}
                        <Link href='/projectzen/create-account' className='text-blue-500'>
                            Create New Account
                        </Link>
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='youremailhere@exmaple.com'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <Label htmlFor='password'>Password</Label>
                            <Link href='/forgot-password' className='text-xs text-blue-500'>
                                Forgot Password?
                            </Link>
                        </div>
                        <Input id='password' required />
                    </div>
                </CardContent>


            </form>
        </Card>





























    )
}
