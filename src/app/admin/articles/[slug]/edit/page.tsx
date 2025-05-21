
"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react"; // Changed from react-dom
import { useFormStatus } from "react-dom"; // useFormStatus remains in react-dom
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateArticleAction, UpdateArticleState } from "@/app/actions/articleActions";
import { getArticleBySlug, markdownToHtml } from "@/lib/articles";
import type { Article, ArticleFormData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  tags: z.string().min(1, { message: "Please add at least one tag." }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(300, { message: "Excerpt must be at most 300 characters."}),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

type EditArticleFormValues = z.infer<typeof formSchema>;

const initialState: UpdateArticleState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? "Updating..." : "Update Article"}
    </Button>
  );
}

interface EditArticlePageProps {
  params: {
    slug: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const [formState, formAction] = useActionState( // Changed to useActionState
    updateArticleAction.bind(null, params.slug), 
    initialState
  );
  
  const [markdownContent, setMarkdownContent] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");

  const form = useForm<EditArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      title: "",
      slug: "",
      date: "",
      tags: "",
      excerpt: "",
      content: "",
      image: "",
      imageHint: "",
    },
  });

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setNotFound(false);
      try {
        const fetchedArticle = await getArticleBySlug(params.slug);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
          form.reset({
            title: fetchedArticle.title,
            slug: fetchedArticle.slug,
            date: new Date(fetchedArticle.date).toISOString().split('T')[0],
            tags: fetchedArticle.tags.join(', '),
            excerpt: fetchedArticle.excerpt,
            content: fetchedArticle.rawContent,
            image: fetchedArticle.image || '',
            imageHint: fetchedArticle.imageHint || '',
          });
          setMarkdownContent(fetchedArticle.rawContent);
          setHtmlPreview(markdownToHtml(fetchedArticle.rawContent));
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load article data." });
        setNotFound(true); 
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params.slug, form, toast]);

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        toast({
          title: "Article Updated!",
          description: formState.message,
        });
        if (formState.updatedArticleSlug) {
          router.push(`/articles/${formState.updatedArticleSlug}`);
        } else {
          router.push('/admin/articles');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error Updating Article",
          description: formState.message,
        });
        if (formState.errors) {
          for (const [fieldName, errors] of Object.entries(formState.errors)) {
            if (errors && errors.length > 0) {
              form.setError(fieldName as keyof EditArticleFormValues, { type: "server", message: errors.join(', ') });
            }
          }
        }
      }
    }
  }, [formState, toast, router, form]);
  
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const mdContent = event.target.value;
    form.setValue("content", mdContent, { shouldValidate: true });
    setMarkdownContent(mdContent);
    setHtmlPreview(markdownToHtml(mdContent));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Loading Article Editor...</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (notFound) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article Not Found</CardTitle>
          <CardDescription>The article you are trying to edit does not exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/articles">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Manage Articles
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Article: {article?.title}</CardTitle>
        <CardDescription>Update the details for your blog post. Use Markdown for content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., my-awesome-article" {...field} />
                  </FormControl>
                  <FormDescription>URL-friendly version of the title. If changed, ensure it's unique.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="kubernetes, devops, cloud" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list of tags.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short summary of the article..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief summary shown on article listings (max 300 characters).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your article content here using Markdown..."
                        className="resize-y min-h-[300px] lg:min-h-[400px] font-mono"
                        {...field}
                        onChange={handleContentChange}
                        value={form.watch('content')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Markdown Preview</FormLabel>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md min-h-[300px] lg:min-h-[400px] bg-muted/50 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: htmlPreview || "<p class='text-muted-foreground'>Preview will appear here...</p>" }}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Main Image URL (Optional)</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>URL for the article's main image. Use https://placehold.co for placeholders.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., technology abstract" {...field} />
                    </FormControl>
                    <FormDescription>One or two keywords for AI placeholder image generation (if applicable).</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="flex items-center gap-4">
                <SubmitButton />
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
            {formState?.message && !formState.success && (
              <p className="text-sm font-medium text-destructive">{formState.message}</p>
            )}
             {formState?.message && formState.success && (
              <p className="text-sm font-medium text-green-600">{formState.message}</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
