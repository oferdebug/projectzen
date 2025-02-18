import { NextApiRequest, NextApiResponse, type GetServerSidePropsContext } from 'next';
// utils/auth.ts
import {
    getServerSession,
    type NextAuthOptions,
    type User,
    type Session,
} from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import {
    signIn,
    signOut,
} from 'next-auth/react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface CustomUser extends User {
    id: string;
    role: string;
}

interface CustomSession extends Session {
    user?: CustomUser;
}

// Define your authentication options
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) return null;
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          
          if (error) throw error;
          if (!data.user) return null;

          return {
            id: data.user.id,
            email: data.user.email,
            role: 'user', // Set default role or fetch from your users table
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customSession = session as CustomSession;
      if (customSession.user) {
        customSession.user.id = token.id as string;
        customSession.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Server-side session helper
export async function getServerAuthSession(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}

// Client-side auth helpers
export const clientSignIn = async (provider?: string, credentials?: { email: string; password: string }) => {
  if (credentials) {
    return signIn('credentials', {
      ...credentials,
      callbackUrl: '/dashboard'
    });
  }
  return signIn(provider, { callbackUrl: '/dashboard' });
};

export const clientSignOut = async () => {
  await supabase.auth.signOut(); // Sign out from Supabase
  return signOut({ callbackUrl: "/login" }); // Sign out from NextAuth
};

// API route protection helper
export async function protectApiRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    throw new ApiError("Unauthorized", 401);
  }

  return session;
}

// Custom error class for auth errors
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export { signIn, signOut };

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    throw new ApiError(error.message, 400);
  }

  return data;
}

export async function resetPasswordRequest(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new ApiError(error.message, 400);
  }

  return data;
}
