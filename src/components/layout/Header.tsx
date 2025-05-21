"use client";

import Link from 'next/link';
import { BookMarked, Cog, LogIn, LogOut as LogOutIcon, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to homepage after logout
  };

  return (
    <header className="py-4 md:py-6 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>

        <div className="flex items-center gap-3">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* Placeholder for user image if available */}
                      {/* <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} /> */}
                      <AvatarFallback>
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name || "Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild aria-label="Login" title="Login">
              <Link href="/login" className="flex items-center">
                <LogIn className="h-5 w-5 mr-0 md:mr-2" />
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