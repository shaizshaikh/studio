
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
  isAdmin: boolean;
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
      if (firebaseUser) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "shaizshaikh00@gmail.com"; // Fallback for safety
        if (firebaseUser.email === adminEmail) {
          setIsAdmin(true);
          // Only redirect if not already in an admin path to avoid loops
          // and if not already on the dashboard itself
          if (!window.location.pathname.startsWith('/admin')) {
             router.push('/admin/dashboard');
          }
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    // You can show a global loading spinner or a skeleton layout here
    // For simplicity, just rendering children might be okay, or a minimal loader
    return <div className="flex items-center justify-center min-h-screen"><Skeleton className="h-12 w-12 rounded-full" /> <p className="ml-4">Loading authentication...</p></div>;
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
