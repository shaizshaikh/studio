
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { deleteArticle } from '@/lib/articles'; // We'll use this later

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadArticles() {
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
    }
    loadArticles();
  }, [toast]);

  // const handleDelete = async (slug: string, title: string) => {
  //   if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
  //     try {
  //       // const success = await deleteArticle(slug); // Implement deleteArticle in lib/articles.ts
  //       // if (success) {
  //       //   setArticles(prev => prev.filter(article => article.slug !== slug));
  //       //   toast({ title: "Article Deleted", description: `"${title}" has been deleted.` });
  //       // } else {
  //       //   toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the article." });
  //       // }
  //       toast({ title: "Deletion (Placeholder)", description: `Delete functionality for "${title}" is not yet implemented.` });
  //     } catch (error) {
  //       toast({ variant: "destructive", title: "Deletion Error", description: "An error occurred while deleting." });
  //     }
  //   }
  // };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Manage Articles</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Manage Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Article
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            View, edit, or delete your existing articles. ({articles.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
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
                      <Button variant="outline" size="sm" asChild title="Edit Article (Placeholder)">
                        {/* <Link href={`/admin/articles/${article.slug}/edit`}> */}
                        <span onClick={() => toast({title: "Edit (Placeholder)", description:"Edit functionality coming soon."})}>
                          <Edit className="h-4 w-4" />
                        </span>
                        {/* </Link> */}
                      </Button>
                      <Button variant="destructive" size="sm" title="Delete Article (Placeholder)" 
                        // onClick={() => handleDelete(article.slug, article.title)}
                        onClick={() => toast({title: "Delete (Placeholder)", description:"Delete functionality coming soon."})}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
