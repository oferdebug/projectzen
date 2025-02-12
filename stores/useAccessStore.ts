import { create } from 'zustand';

interface AccessStore {
    reset(): unknown;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
}

export const useAccessStore = create<AccessStore>((set) => ({
    accessToken: '',
    setAccessToken: (accessToken: string) => set({ accessToken }),
    reset: () => set({ accessToken: '' })
}));
