'use client';

import * as React from 'react';

import {
    ThemeProvider as NextThemesProvider,
    ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const [mounted, setMounted] = React.useState(false);

{/* Ensure initial render matches server */}
  React.useEffect(() => {
    setMounted(true);
  }, []);

   {/* Avoid hydration mismatch by only rendering content when mounted */}
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div suppressHydrationWarning>
        {children}
      </div>
    </NextThemesProvider>
  );
}

export default ThemeProvider;
