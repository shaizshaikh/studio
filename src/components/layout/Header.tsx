
"use client";

import Link from 'next/link';
import { BookMarked, LogIn, LogOut as LogOutIcon, UserCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { useAuth } from '@/components/auth/FirebaseAuthProvider';
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
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, loading, isAdmin, signInWithGoogle, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // logout function from useAuth should handle redirect to '/'
  };

  return (
    <header className="py-4 md:py-6 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <Skeleton className="h-9 w-24 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
                    <AvatarFallback>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                   <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={signInWithGoogle} aria-label="Sign in with Google">
              <LogIn className="mr-0 md:mr-2 h-4 w-4" /> 
              <span className="hidden md:inline">Sign in</span>
            </Button>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
