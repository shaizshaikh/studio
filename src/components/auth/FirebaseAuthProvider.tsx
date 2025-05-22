
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean; // True if the logged-in user is the admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL; // Check both, NEXT_PUBLIC for client, ADMIN_EMAIL for server if ever needed elsewhere

      if (firebaseUser) {
        if (firebaseUser.email === adminEmail) {
          setIsAdmin(true);
          // Only redirect if not already in an admin path or dashboard
          // This prevents redirect loops if already on an admin page.
          if (!window.location.pathname.startsWith('/admin/dashboard') && !window.location.pathname.startsWith('/admin/articles')) {
             // router.push('/admin/dashboard'); // Redirecting admin to dashboard
          }
        } else {
          setIsAdmin(false);
          // If a non-admin is somehow on an admin page, redirect them away.
          // This check will primarily be enforced by AdminLayout, but this adds a layer.
          if (window.location.pathname.startsWith('/admin')) {
            // router.push('/'); 
          }
        }
      } else {
        setIsAdmin(false);
        // If no user and they are on an admin page, redirect them away.
        // Primarily handled by AdminLayout.
        if (window.location.pathname.startsWith('/admin')) {
          // router.push('/');
        }
      }
    });

    return () => unsubscribe();
  }, [router]); // router dependency is important for navigation

  useEffect(() => {
    // This effect handles the redirect specifically after user state and isAdmin state are set.
    // It ensures that redirects happen based on the latest auth status.
    if (!loading) { // Only act once initial auth check is complete
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      if (user && user.email === adminEmail) {
        if (!window.location.pathname.startsWith('/admin')) {
            // If admin logs in and is not in admin area, take them to dashboard.
            // router.push('/admin/dashboard'); 
        }
      }
      // Other redirect logic (like non-admin on admin page) is better handled by AdminLayout itself.
    }
  }, [user, loading, isAdmin, router]);


  if (loading) {
    // A simple loading indicator.
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Skeleton className="h-12 w-12 rounded-full bg-muted" />
            <p className="ml-4 text-muted-foreground">Authenticating...</p>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
