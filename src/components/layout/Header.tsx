
"use client";

import Link from 'next/link';
import { BookMarked, Cog, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from '@/components/ui/skeleton';

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
            <Skeleton className="h-9 w-24 rounded-md" />
          ) : session?.user ? (
            <>
              <Button variant="ghost" size="sm" asChild aria-label="Admin Panel" title="Admin Panel">
                <Link href="/admin" className="flex items-center">
                  <Cog className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                aria-label="Logout"
                title="Logout"
                className="flex items-center"
              >
                <LogOutIcon className="h-5 w-5 md:mr-2" />
                 <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild aria-label="Login" title="Login">
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
