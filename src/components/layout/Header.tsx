import Link from 'next/link';
import { BookMarked, Cog, LogIn } from 'lucide-react'; // Removed LogOut for now
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
// Session logic will be re-added with Firebase Auth

export async function Header() {
  // const session = await getSession(); // Temporarily remove session logic

  return (
    <header className="py-4 md:py-6 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>
        <div className="flex items-center gap-2">
          {/* Simplified Auth UI for now - will be replaced by Firebase Auth state */}
          {false && ( // Placeholder for isLoggedIn check
            <Button variant="ghost" size="icon" asChild aria-label="Admin Panel">
              <Link href="/admin">
                <Cog className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {true ? ( // Placeholder: always show Login for now
            <Button variant="ghost" asChild aria-label="Login">
              <Link href="/login" className="flex items-center">
                <LogIn className="h-5 w-5 md:mr-2" />
                 <span className="hidden md:inline">Login</span>
              </Link>
            </Button>
          ) : (
            {/* Logout button will be re-added here */}
            null
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
