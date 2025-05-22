
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
      setUser(firebaseUser);
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email === adminEmail;
        setIsAdmin(isAdminUser);
        if (isAdminUser && !pathname.startsWith('/admin')) {
          // Only redirect to admin dashboard if they just logged in and are not already in admin
          // This check might need refinement based on specific login flows
          router.push('/admin/dashboard');
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, adminEmail, pathname]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // setUser and setIsAdmin will be handled by onAuthStateChanged
      // The redirect for admin users is also handled in the useEffect above
      if (result.user.email !== adminEmail && pathname.startsWith('/admin')) {
        // If a non-admin somehow triggered sign-in while on an admin page (unlikely), redirect them.
        router.push('/');
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      // Potentially show a toast to the user
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // setUser and setIsAdmin will be handled by onAuthStateChanged
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
