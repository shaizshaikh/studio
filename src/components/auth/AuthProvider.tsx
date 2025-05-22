
"use client";

import type { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react"; // This was from next-auth

// This file is no longer needed with Firebase Auth.
// FirebaseAuthProvider.tsx will handle Firebase-specific auth context.
// We can delete this file. For now, providing empty content.
// If you were using NextAuth.js, this would be:
//
// interface AuthProviderProps {
//   children: ReactNode;
// }
//
// export default function AuthProvider({ children }: AuthProviderProps) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

// Intentionally empty as FirebaseAuthProvider.tsx takes over.
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
