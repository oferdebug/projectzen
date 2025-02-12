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
import { auth } from '@/lib/auth';
import { toast, useToast } from '@/components/ui/use-toast';
import { getAuthError } from '@/utils/auth-errors';
import { OauthSignIn } from '@/components/auth/OAuthSignIn';


export function createAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

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
  }
}
