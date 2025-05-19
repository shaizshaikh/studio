
"use client";

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
import { createArticle, ArticleFormData } from "@/lib/articles"; // Assuming createArticle is in lib/articles
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  tags: z.string().min(1, { message: "Please add at least one tag." }), // Comma-separated
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(300, { message: "Excerpt must be at most 300 characters."}),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }), // Markdown content
  image: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

type NewArticleFormValues = z.infer<typeof formSchema>;

export default function NewArticlePage() {
  const { toast } = useToast();
  const router = useRouter();

  const defaultDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const form = useForm<NewArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      date: defaultDate,
      tags: "",
      excerpt: "",
      content: "",
      image: "",
      imageHint: "",
    },
  });

  async function onSubmit(values: NewArticleFormValues) {
    try {
      // Convert form values to ArticleFormData structure
      const articleData: ArticleFormData = {
        title: values.title,
        slug: values.slug,
        date: values.date,
        tags: values.tags, // Will be split in createArticle
        excerpt: values.excerpt,
        content: values.content, // This is Markdown content
        image: values.image || undefined, // Ensure undefined if empty
        imageHint: values.imageHint || undefined,
      };

      const newArticle = await createArticle(articleData); // This now saves in memory
      
      toast({
        title: "Article Created!",
        description: `"${newArticle.title}" has been successfully created.`,
      });
      router.push(`/articles/${newArticle.slug}`); // Navigate to the new article
      // Optionally, navigate to admin articles list: router.push('/admin/articles');
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Failed to create article:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Article",
        description: errorMessage,
      });
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue("title", title);
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove non-alphanumeric characters except hyphens
    form.setValue("slug", slug);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Article</CardTitle>
        <CardDescription>Fill in the details for your new blog post.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} onChange={handleTitleChange} />
                  </FormControl>
                  <FormDescription>The main title of your article.</FormDescription>
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
                  <FormDescription>URL-friendly version of the title (auto-generated, can be customized).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your article content here using Markdown..."
                      className="resize-y min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The main body of your article. Use Markdown for formatting.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Article"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
