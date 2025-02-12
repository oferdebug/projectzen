import { useAccessStore } from "@/stores/useAccessStore";
import { createClient } from "@supabase/supabase-js";
import { users } from './users';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export type AuthError = {
  message: string;
  status: number;
};

export const auth = {
  // Email And Password SignUp
  async signUp(email: string, password: string, phone?: string) {
    // Step 1: Check If Email Already Exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('This Email Is Already Registered, Try SignIn In Instead');
    }
    if (checkError && checkError.code !== 'PGRST106') {
      throw checkError;
    }

    // Step 2: Create User
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    // Step 3: Create User In Supabase DB
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user?.identities?.length === 0) {
      try {
        await users.captureUserDetails(userData.user);
      } catch (profileError) {
        await supabase.auth.admin.deleteUser(userData.user.id);
        throw profileError;
      }
    }
  },

  // OAuth SignIn (Google, GitHub)
  async signInWithOAuth(provider: 'google' | 'github', nextUrl?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl || '/'}`,
      },
    });
    if (error) throw error;
    return data;
  },

  // SignOut
  async signOut() {
    const { error } = await supabase.auth.signOut();
    useAccessStore.getState().reset();
    if (error) throw { message: error.message, status: error.status };
  },

  // Password Reset Request
  async resetPasswordRequest(email: string) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id,provider')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST106') {
      throw userError;
    }

    if (!user || user.provider !== 'email') {
      return {
        success: true,
        message: 'If The Account Exists, A Password Link Will Be Sent To Your Email',
      };
    }

    const resetLink = `${location.origin}/auth/reset-password?email=${email}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetLink,
    });
    if (error) throw error;
    return {
      success: true,
      message: 'If The Account Exists, A Password Link Will Be Sent To Your Email',
    };
  },

  // Password Reset
  async resetPassword(_password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: _password,
    });
    if (error) throw { message: error.message, status: error.status };
    return data;
  },
};


