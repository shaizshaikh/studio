"use client"; // CRITICAL: This makes AuthProvider a Client Component

import type { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // This component simply wraps its children with NextAuth's SessionProvider
  return <SessionProvider>{children}</SessionProvider>;
}
