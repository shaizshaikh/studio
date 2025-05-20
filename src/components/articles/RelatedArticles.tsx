
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { suggestRelatedArticles, type SuggestRelatedArticlesOutput, type SuggestRelatedArticlesInput } from '@/ai/flows/suggest-related-articles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedArticlesProps {
  currentArticleSlug: string; // Added to avoid suggesting the current article
  currentArticleContent: string;
  currentArticleTags: string[];
}

export function RelatedArticles({ currentArticleSlug, currentArticleContent, currentArticleTags }: RelatedArticlesProps) {
  const [related, setRelated] = useState<SuggestRelatedArticlesOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true);
        setError(null);
        const input: SuggestRelatedArticlesInput = {
          articleContent: currentArticleContent.substring(0, 5000), // Truncate for performance/API limits
          articleTags: currentArticleTags,
          numberOfSuggestions: 3,
        };
        const suggestions = await suggestRelatedArticles(input);
        // Filter out the current article if it happens to be suggested
        const filteredSuggestions = suggestions.filter(article => {
            // Assuming article.url might be a slug or a full URL
            // This check is basic and might need refinement based on URL structure
            if (article.url.startsWith('http')) {
                const slugFromUrl = article.url.substring(article.url.lastIndexOf('/') + 1);
                return slugFromUrl !== currentArticleSlug;
            }
            return article.url !== currentArticleSlug;
        });
        setRelated(filteredSuggestions);
      } catch (err) {
        console.error("Failed to fetch related articles:", err);
        setError("Could not load related articles at this time.");
      } finally {
        setLoading(false);
      }
    }
    if (process.env.GEMINI_API_KEY) { // Only fetch if Gemini API key is likely configured
        fetchRelated();
    } else {
        setLoading(false);
        console.warn("GEMINI_API_KEY not found, skipping related articles AI suggestions.");
    }
  }, [currentArticleContent, currentArticleTags, currentArticleSlug]);

  if (!process.env.GEMINI_API_KEY) {
    return null; // Don't render the component if the API key isn't set
  }

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

  if (!related || related.length === 0) {
    return null; // Don't show the section if no related articles are found or error
  }

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
                {/* Check if URL is internal or external. For now, assume external or use slug-like internal. */}
                <a 
                  href={article.url.startsWith('http') ? article.url : `/articles/${article.url}`} 
                  target={article.url.startsWith('http') ? '_blank' : '_self'} 
                  rel="noopener noreferrer"
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
