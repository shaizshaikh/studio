import Link from 'next/link';
import { DarkModeToggle } from '@/components/theme/DarkModeToggle';
import { BookMarked, Cog } from 'lucide-react'; // Added Cog for admin link
import { Button } from '@/components/ui/button'; // For admin button styling

export function Header() {
  return (
    <header className="py-4 md:py-6 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <BookMarked className="h-7 w-7" />
          DevOps Digest
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Admin Panel">
            <Link href="/admin">
              <Cog className="h-5 w-5" />
            </Link>
          </Button>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
