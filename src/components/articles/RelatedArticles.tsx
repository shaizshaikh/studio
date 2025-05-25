'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  currentArticleContent: string;
  currentArticleTags: string[];
}

interface SuggestedArticle {
  title: string;
  url: string;
  summary: string;
}

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export function RelatedArticles({
  currentArticleSlug,
  currentArticleContent,
  currentArticleTags,
}: RelatedArticlesProps) {
  const [related, setRelated] = useState<SuggestedArticle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/related-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleContent: currentArticleContent.slice(0, 5000),
            articleTags: currentArticleTags,
            numberOfSuggestions: 3,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch related articles');
        }

        const filtered = data.filter((article: SuggestedArticle) => {
          try {
            const url = new URL(article.url, 'https://dummy-base.com');
            const slug = url.pathname.split('/').pop();
            return slug !== currentArticleSlug;
          } catch {
            return true;
          }
        });

        setRelated(filtered);
      } catch (err: any) {
        console.error('[RelatedArticles Error]', err);
        setError(err.message || 'Could not load related articles at this time.');
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [currentArticleContent, currentArticleTags, currentArticleSlug]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-2 text-primary" /> Related Reads (AI Suggestions)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
        <Zap className="h-7 w-7 mr-2 text-primary" /> Related Reads (AI Suggestions)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((article, index) => (
          <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">
                <a
                  href={article.url}
                  target={isExternal(article.url) ? '_blank' : '_self'}
                  rel={isExternal(article.url) ? 'noopener noreferrer' : undefined}
                  className="hover:text-primary transition-colors"
                >
                  {article.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{article.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
