'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/lib/context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized) {
      const isAuthRoute = pathname.startsWith('/auth');
      if (!isAuthenticated && !isAuthRoute) {
        router.push('/auth/login');
      } else if (isAuthenticated && isAuthRoute) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router, mounted]);

  // Prevent flash of content during initial mount & initialization
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        {/* Beautiful glassmorphism logo & loading spinner */}
        <div className="text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
          Quantum
        </div>
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthRoute = pathname.startsWith('/auth');
  if (!isAuthenticated && !isAuthRoute) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
