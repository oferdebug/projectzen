'use client';
import { useState } from 'react';
import {useRouter} from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { auth } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { getAuthError } from '@/utils/auth-errors';
import Icons from '@/components/Icons';


export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await auth.forgotPassword(email);
            toast({
                title: 'Success, check your email!',
                description: 'If an account exists with this email, you will receive a password reset link',
            });
            router.push('/login');
        } catch (error) {
            const { message } = getAuthError(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='w-96'>
            <form onSubmit={handleSubmit}>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>Reset Password</CardTitle>
                    <CardDescription className='text-sm'>
                        Enter your email to reset your password, We will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='Email'
                            type='Email'
                            placeholder='Enter Your Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <Button className='w-full' type='submit' disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Send Me A Reset Link
                    </Button>
                </CardContent>
                <CardFooter>
                    <div className='text-sm'>
                        Remember Your Password? {''}
                        <Link href='/login' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
};


export default ForgotPasswordForm;