'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
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
import * as auth from '@/lib/auth';
import * as useToast from '@/components/ui/use-toast';
import { getAuthError } from '@/utils/auth-errors';
import { OauthSignIn } from '@/components/auth/OAuthSignIn';


export function CreateAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast.useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  if (password !== confirmPassword) {
    toast({
      variant: 'destructive', 
      title: 'Passwords Do Not Match',
      description: 'Please make sure your passwords match'
    });
    return;
  }

  try {
    setIsLoading(true);
    await auth.signUp(email, password);
    toast({
      title: 'Success',
      description: 'Your account has been created successfully',
    });
    router.push('/login');
  } catch (error) {
    const { message } = getAuthError(error);

    toast({
      variant: 'destructive',
      title: 'Account Creation Failed',
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
          <CardTitle className='text-2xl'>Create Your Account</CardTitle>
          <CardDescription className='text-xs'>
            Enter your email and password to create an account and get started Today
          </CardDescription>
        </CardHeader>
        <CardContent className='grid-grid-4'>
          <div>
            Already Have An Account?{' '}
            <Link href='/login' className='text-blue-600'>
              Login
            </Link>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input id='confirmPassword' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} required />
            </div>
            <Button className='w-full' type='submit' disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create Account
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <OauthSignIn isLoading={isLoading} onLoadingChange={setIsLoading} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateAccountForm;



