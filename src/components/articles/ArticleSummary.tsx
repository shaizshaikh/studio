
"use client";

import { useState, useEffect } from 'react';
import { summarizeArticle, type SummarizeArticleInput, type SummarizeArticleOutput } from '@/ai/flows/summarize-article-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface ArticleSummaryProps {
  articleContent: string; // Full HTML content
}

export function ArticleSummary({ articleContent }: ArticleSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plainTextContent, setPlainTextContent] = useState<string>("");

  useEffect(() => {
    // Function to strip HTML tags for a cleaner input to the LLM
    // This runs on the client after hydration
    const stripHtml = (html: string): string => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };
    setPlainTextContent(stripHtml(articleContent));
  }, [articleContent]);


  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      if (!plainTextContent.trim()) {
        setError("Article content is empty after processing.");
        setIsLoading(false);
        return;
      }

      const input: SummarizeArticleInput = { articleContent: plainTextContent.substring(0, 15000) }; // Limit input size
      const result = await summarizeArticle(input);
      setSummary(result.summary);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating the summary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t">
      <Button onClick={handleGenerateSummary} disabled={isLoading || !plainTextContent.trim()} variant="outline" size="lg" className="shadow hover:shadow-md transition-shadow">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
        )}
        Generate AI Summary
      </Button>

      {isLoading && (
        <div className="mt-6 flex items-center justify-center p-6 bg-card rounded-lg shadow-sm border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Generating summary, please wait...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Summary</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {summary && !isLoading && (
        <Card className="mt-6 shadow-lg border">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Sparkles className="h-6 w-6 mr-2 text-primary" />
              AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
