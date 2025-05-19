
"use client";

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteArticleAction } from '@/app/actions/articleActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading articles",
        description: "Could not fetch the list of articles.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [toast]); // Re-fetch on toast change is not ideal, but simple for now. Better: trigger manually or use router events.

  const handleDeleteArticle = async (slug: string, title: string) => {
    startTransition(async () => {
      const result = await deleteArticleAction(slug);
      if (result.success) {
        toast({ title: "Article Deleted", description: `"${title}" has been deleted.` });
        // Refresh the list of articles
        await fetchArticles();
      } else {
        toast({ variant: "destructive", title: "Deletion Failed", description: result.message });
      }
    });
  };

  if (loading && articles.length === 0) { // Show loading only on initial load or when empty
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Manage Articles</h1>
          <Button variant="outline" size="icon" disabled>
            <RefreshCw className="h-5 w-5 animate-spin" />
          </Button>
        </div>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Articles</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchArticles} title="Refresh Articles" disabled={loading || isPending}>
            <RefreshCw className={`h-5 w-5 ${loading || isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button asChild>
            <Link href="/admin/articles/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Article
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            View, edit, or delete your existing articles. ({articles.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 && !loading ? (
            <p className="text-muted-foreground">No articles found. Get started by creating one!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.slug}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                    <TableCell className="truncate max-w-xs">{article.tags.join(', ')}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" asChild title="View Article">
                        <Link href={`/articles/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild title="Edit Article">
                        <Link href={`/admin/articles/${article.slug}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" title="Delete Article" disabled={isPending}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the article titled &quot;{article.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteArticle(article.slug, article.title)}
                              disabled={isPending}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              {isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
