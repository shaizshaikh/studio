
import { getArticles, getAllTags } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { ArticleFilterableList } from '@/components/articles/ArticleFilterableList';
import { Skeleton } from '@/components/ui/skeleton'; // Keep for potential top-level loading structure if needed

// HomePage is now a Server Component by default (no "use client")
export default async function HomePage() {
  // Fetch data directly on the server
  // In a real app, you might want to add error handling here
  const articles: Article[] = await getArticles();
  const allTags: string[] = await getAllTags();

  // Skeletons can be used if fetching is slow or for Suspense boundaries
  // For this initial load, data is fetched before rendering the client component.
  // So, a loading state here might not be strictly necessary unless using Suspense.

  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-card rounded-lg shadow">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Welcome to DevOps Digest</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on the latest in DevOps, cloud technologies, automation, and more.
          Filter by tags or search to find what interests you.
        </p>
      </section>

      {/* Pass server-fetched data to the Client Component */}
      <ArticleFilterableList initialArticles={articles} initialAllTags={allTags} />
    </div>
  );
}

// CardSkeleton can be kept here if we want to use it with Suspense in the future
// or remove if the client component handles its own loading/empty states entirely.
// For now, let's keep it as it might be useful.
export function CardSkeleton() { // Export if it needs to be used by ArticleFilterableList or Suspense fallback
  return (
    <div className="bg-card p-4 rounded-lg shadow space-y-3">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
       <Skeleton className="h-8 w-28 mt-2" />
    </div>
  );
}
