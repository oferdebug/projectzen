'use client';
import { useState } from 'react';

import { useRouter } from 'next/router';

import { Card } from '@/components/ui/card';
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
        <Card className='grid-gap-2'>

        </Card>
    )
}
