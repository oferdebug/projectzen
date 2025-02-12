import { createClient } from "./supabase/client";
import type { User } from "@supabase/supabase-js";
import { Metadata } from 'next';

const supabase = createClient();


export interface IuserLink {
    id: string;
    label: string;
    url: string;
}

export interface Iuser {
    id: string;
    email: string;
    name: string;
    description: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;
    links: IuserLink[];
    provider: 'google' | 'github' | 'email';
}

export const users = {
    async getUser(id: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as Iuser | null;
    },

    async createUser(user: Partial<User>) {
        const { data, error } = await supabase.from('users').insert(user).select().single();
        if (error) throw error;
        return data as Iuser;
    },


    async captureUserDetails(authUser: User) {
        // Check If User Already Exist
        const existingUser = await this.getUser(authUser.id).catch(() => null);
        if (existingUser) return existingUser;

        // Extract Provider
        const provider = authUser.app_metadata.provider as Iuser['provider'];

        //Create New User
        const newUser: Partial<Iuser> = {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata.full_name || authUser.email!.split('@')[0],
            avatar: authUser.user_metadata.avatar_url || '',
            description: '',
            provider,
            links: [],
            created_at: new Date(),
            updated_at: new Date()
        };

        // Convert Date objects to ISO strings for database compatibility
        const userForDb = {
            ...newUser,
            created_at: newUser.created_at?.toISOString(),
            updated_at: newUser.updated_at?.toISOString()
        };

        return await this.createUser(userForDb);
    },


    async updateUser(id: string, updates: Partial<User>) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as Iuser;
    },

    async updateProfile(
        userId: string,
        updates: Partial<Omit<Iuser, 'id' | 'email' | 'provider'>>
    ) {
        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
        
        if (error) throw error;

        //update auth user metadata if avatar or name changed
        const metadata: { avatar_url?: string; full_name?: string } = {};

        if (updates.avatar !== undefined) {
            metadata.avatar_url = updates.avatar;
        }
        
        if (updates.name !== undefined) {
            metadata.full_name = updates.name;
        }

        if (Object.keys(metadata).length > 0) {
            const { error: authError } = await supabase.auth.updateUser({
                data: metadata,
            });
            if (authError) {
                console.error('Error updating auth user metadata', authError);
            }
        }
    },
};
