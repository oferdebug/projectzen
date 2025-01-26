'use client'
import React from 'react';

import { Header } from '@/components/Header';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient(); // Create a client



export const AppProvider = ({children}:{children:React.ReactNode}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <div>
                <Header />
                </div>

                {children}
                </ThemeProvider>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
  )
}

export default AppProvider
