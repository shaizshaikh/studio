import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Tags, ChevronLeft } from 'lucide-react';

export default function ArticleLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 animate-pulse">
      <Skeleton className="h-9 w-40 mb-6" /> {/* Back to articles button */}
      
      <Skeleton className="h-10 md:h-12 lg:h-14 w-full mb-4" /> {/* Title */}
      <Skeleton className="h-8 w-3/4 mb-6" /> {/* Shorter part of title / subtitle line */}
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-6">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Tags className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-64 md:h-96 w-full mb-8 rounded-lg" /> {/* Image placeholder */}
      
      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Related Articles Skeleton */}
      <div className="mt-12 pt-8 border-t">
        <Skeleton className="h-8 w-1/2 mb-6" /> {/* Related articles title */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card p-4 rounded-lg shadow space-y-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
