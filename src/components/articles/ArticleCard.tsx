import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from './TagBadge';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {article.image && (
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-video overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              width={600}
              height={338} // 16:9 aspect ratio for 600px width
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={article.imageHint || 'technology abstract'}
            />
          </div>
        </Link>
      )}
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl">
          <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground flex items-center mt-1">
          <CalendarDays className="h-4 w-4 mr-1.5" />
          {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground leading-relaxed">{article.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
        <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
          <Link href={`/articles/${article.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
