
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Corrected path
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase AuthProvider: onAuthStateChanged triggered. User:", firebaseUser?.email);
      setUser(firebaseUser);
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email === adminEmail;
        setIsAdmin(isAdminUser);
        console.log("Firebase AuthProvider: Admin email check. User email:", firebaseUser.email, "Admin email from env:", adminEmail, "Is admin?", isAdminUser);
        
        // Handle redirect for admin user
        // Only redirect if they just logged in (pathname is not already /admin/*)
        // and are not already on an admin page.
        if (isAdminUser && !pathname.startsWith('/admin') && pathname !== '/admin/dashboard') {
          console.log("Firebase AuthProvider: Admin user detected, redirecting to /admin/dashboard. Current pathname:", pathname);
          router.push('/admin/dashboard');
        } else if (isAdminUser && pathname.startsWith('/admin')) {
          console.log("Firebase AuthProvider: Admin user already on an admin page, no redirect needed.");
        } else if (!isAdminUser && pathname.startsWith('/admin')) {
          // Non-admin trying to access admin pages after initial load, redirect them.
          // This is a secondary check; AdminLayout should be the primary guard.
          console.log("Firebase AuthProvider: Non-admin on admin page, redirecting to /");
          router.push('/');
        }

      } else {
        setIsAdmin(false);
        // If user logs out and they are on an admin page, redirect to home
        if (pathname.startsWith('/admin')) {
          console.log("Firebase AuthProvider: User logged out from admin page, redirecting to /");
          router.push('/');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, adminEmail, pathname]); // Added pathname to dependency array

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true); // Set loading before sign-in attempt
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle user state update and admin redirect
      console.log("Firebase AuthProvider: signInWithGoogle successful.");
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      // Potentially show a toast to the user
      setLoading(false); // Ensure loading is false on error
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null and isAdmin to false.
      // It will also handle redirecting from admin pages if user was on one.
      console.log("Firebase AuthProvider: Logout successful, redirecting to /");
      router.push('/'); // Explicitly redirect to home after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // This initial loading state is important to prevent premature rendering or redirects
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Skeleton className="h-12 w-12 rounded-full bg-muted" />
            <p className="ml-4 text-muted-foreground">Authenticating...</p>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout }}>
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

    