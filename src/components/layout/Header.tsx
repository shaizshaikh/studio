"use client"; // CRITICAL: Header uses useSession, so it must be a Client Component

import Link from 'next/link';
import { BookMarked, Cog, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { useSession, signOut } from "next-auth/react"; // Correct import for client-side hooks

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="py-4 md:py-6 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>

        <div className="flex items-center gap-2"> {/* Reduced gap for tighter layout */}
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" aria-label="Loading user state"></div>
          ) : session?.user ? (
            <>
              <Button variant="ghost" size="icon" asChild aria-label="Admin Panel">
                <Link href="/admin">
                  <Cog className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon" // Changed to icon for consistency, text shown via tooltip or larger screens
                onClick={() => signOut({ callbackUrl: '/' })} // Redirect to home after logout
                aria-label="Logout"
                title="Logout" // Tooltip for icon button
              >
                <LogOutIcon className="h-5 w-5" />
                 {/* <span className="hidden md:inline">Logout</span> */}
              </Button>
            </>
          ) : (
            <Button variant="ghost" asChild aria-label="Login">
              <Link href="/login" className="flex items-center">
                <LogIn className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Login</span>
              </Link>
            </Button>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
