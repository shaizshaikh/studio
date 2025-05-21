
"use client";

import type { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // This component simply wraps its children with NextAuth's SessionProvider
  // to make session data available via the useSession hook in client components.
  return <SessionProvider>{children}</SessionProvider>;
}
