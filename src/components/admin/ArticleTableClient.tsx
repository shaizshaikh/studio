'use client';

import { useEffect, useState, useTransition } from 'react';
import type { Article } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteArticleAction } from '@/app/actions/articleActions';
import { format } from 'date-fns';
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

// Accept plain articles (without formattedDate)
interface Props {
  initialArticles: Article[];
}

export function ArticleTableClient({ initialArticles }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      const data: Article[] = await res.json();
      setArticles(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error loading articles",
        description: "Check console for more details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (slug: string, title: string) => {
    startTransition(async () => {
      const result = await deleteArticleAction(slug);
      if (result.success) {
        toast({ title: "Article Deleted", description: `"${title}" has been deleted.` });
        await fetchArticles();
      } else {
        toast({ variant: "destructive", title: "Failed", description: result.message });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Articles</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchArticles} title="Refresh" disabled={loading || isPending}>
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
          <CardDescription>{articles.length} total</CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No articles found.</p>
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
                {articles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>{format(new Date(article.createdAt), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{article.tags.join(', ')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/articles/${article.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/articles/${article.slug}/edit`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{article.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteArticle(article.slug, article.title)} disabled={isPending}>
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
