
"use client"; // Essential for using client-side hooks like useSession

import Link from 'next/link';
import { BookMarked, Cog, LogIn, LogOut as LogOutIcon } from 'lucide-react'; // Renamed LogOut to LogOutIcon to avoid conflict
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut

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
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div> // Skeleton for loading state
          ) : session ? (
            <>
              <Button variant="ghost" size="icon" asChild aria-label="Admin Panel">
                <Link href="/admin">
                  <Cog className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })} // Sign out and redirect to homepage
                aria-label="Logout"
                className="flex items-center"
              >
                <LogOutIcon className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
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
