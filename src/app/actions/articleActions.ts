
'use server';

import * as z from 'zod';
import { articles, markdownToHtml } from '@/lib/articles'; // Accessing the in-memory array
import type { Article, ArticleFormData } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  tags: z.string().min(1, { message: "Please add at least one tag." }), // Comma-separated
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(300, { message: "Excerpt must be at most 300 characters."}),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

export type CreateArticleState = {
  message: string;
  errors?: {
    [key in keyof ArticleFormData]?: string[];
  };
  success: boolean;
  newArticleSlug?: string;
};

export async function createArticleAction(
  prevState: CreateArticleState,
  formData: FormData
): Promise<CreateArticleState> {
  // TODO: Implement actual PostgreSQL database logic here.
  // This currently uses the in-memory 'articles' array from '@/lib/articles.ts'.

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors as CreateArticleState['errors'],
      success: false,
    };
  }

  const data = validatedFields.data;

  try {
    // Check for duplicate slugs (in-memory check)
    if (articles.some(a => a.slug === data.slug)) {
      return {
        message: `Article with slug "${data.slug}" already exists.`,
        success: false,
        errors: { slug: [`Slug "${data.slug}" already exists.`]}
      };
    }

    const newArticle: Article = {
      title: data.title,
      slug: data.slug,
      date: data.date,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      excerpt: data.excerpt,
      rawContent: data.content,
      htmlContent: markdownToHtml(data.content),
      image: data.image || undefined,
      imageHint: data.imageHint || undefined,
    };

    // Simulating database insertion by adding to the in-memory array
    articles.unshift(newArticle); // Add to the beginning of the array

    // Revalidate paths that show articles
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${newArticle.slug}`);
    revalidatePath('/admin/articles');
    
    // Cannot call redirect within a try/catch block when also returning a value
    // So, we return a success state and the calling component can redirect.
    return {
      message: `Article "${newArticle.title}" created successfully!`,
      success: true,
      newArticleSlug: newArticle.slug,
    };

  } catch (error) {
    let errorMessage = "An unexpected error occurred while creating the article.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Create article error:", error);
    return {
      message: errorMessage,
      success: false,
    };
  }
}

// TODO: Implement updateArticleAction and deleteArticleAction similarly
// They will also need to interact with the database and call revalidatePath.
// For now, placeholders:

export async function updateArticleAction(slug: string, formData: FormData): Promise<any> {
  // TODO: Database logic for updating
  console.log("Update action called for slug:", slug, Object.fromEntries(formData.entries()));
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/articles/${slug}`);
  // Potentially revalidatePath for the new slug if it changed
  revalidatePath('/admin/articles');
  return { message: "Article update placeholder", success: true };
}

export async function deleteArticleAction(slug: string): Promise<any> {
  // TODO: Database logic for deleting
  console.log("Delete action called for slug:", slug);
  const initialLength = articles.length;
  const newArticlesArray = articles.filter(a => a.slug !== slug);
  // This direct mutation won't work across requests without a proper DB.
  // Reflecting the change in the shared 'articles' array:
  articles.length = 0; // Clear the array
  Array.prototype.push.apply(articles, newArticlesArray); // Repopulate with filtered items

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/admin/articles');
  return { message: "Article delete placeholder", success: true };
}

    