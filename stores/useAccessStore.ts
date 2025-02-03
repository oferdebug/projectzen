import { create } from 'zustand';

interface AccessStore {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
}

export const useAccessStore = create<AccessStore>((set: (arg0: { accessToken: string; }) => unknown) => ({
    accessToken: '',
    setAccessToken: (accessToken: string) => set({ accessToken }),
}));
