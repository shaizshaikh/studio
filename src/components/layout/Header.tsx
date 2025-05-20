import Link from 'next/link';
import { BookMarked, Cog, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { getSession } from '@/lib/session'; // For server-side session check
import { logoutAction } from '@/app/auth/actions'; // For the logout form

export async function Header() {
  const session = await getSession();

  return (
    <header className="py-4 md:py-6 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>
        <div className="flex items-center gap-2">
          {session.isLoggedIn && (
            <Button variant="ghost" size="icon" asChild aria-label="Admin Panel">
              <Link href="/admin">
                <Cog className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {session.isLoggedIn ? (
            <form action={logoutAction} className="flex items-center">
              <Button variant="ghost" type="submit" aria-label="Logout" className="flex items-center">
                <LogOut className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </form>
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
