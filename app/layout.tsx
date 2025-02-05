'use client';
import './globals.css';

import React from 'react';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AppProvider from './AppProvider';
import { ThemeProvider } from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "ProjectZen",
  description: "ProjectZen,  a Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cn = (...classes: (string | undefined)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
