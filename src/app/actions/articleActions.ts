
'use server';

import * as z from 'zod';
import prisma from '@/lib/db'; // Import Prisma client
import { markdownToHtml } from '@/lib/articles';
import type { ArticleFormData } from '@/lib/types'; // Ensure Article type can be imported if needed
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  tags: z.string().min(1, { message: "Please add at least one tag." }), // Comma-separated
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(300, { message: "Excerpt must be at most 300 characters."}),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }), // This is rawContent
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
    // Check for duplicate slugs in the database
    const existingArticle = await prisma.article.findUnique({
      where: { slug: data.slug },
    });

    if (existingArticle) {
      return {
        message: `Article with slug "${data.slug}" already exists.`,
        success: false,
        errors: { slug: [`Slug "${data.slug}" already exists.`]}
      };
    }

    const htmlContent = markdownToHtml(data.content);
    const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        date: new Date(data.date), // Convert string date to Date object for Prisma
        tags: tagsArray,
        excerpt: data.excerpt,
        rawContent: data.content,
        htmlContent: htmlContent,
        image: data.image || null, // Use null if empty string for optional fields
        imageHint: data.imageHint || null,
      },
    });

    // Revalidate paths that show articles
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${newArticle.slug}`);
    revalidatePath('/admin/articles');
    
    return {
      message: `Article "${newArticle.title}" created successfully!`,
      success: true,
      newArticleSlug: newArticle.slug,
    };

  } catch (error) {
    console.error("Create article error:", error);
    let errorMessage = "An unexpected error occurred while creating the article. Check server logs.";
    if (error instanceof Error) {
      // Check for Prisma specific unique constraint error for slug
      if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
         errorMessage = `Article with slug "${data.slug}" already exists. Please choose a unique slug.`;
         return { message: errorMessage, success: false, errors: { slug: [errorMessage]}};
      }
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      success: false,
    };
  }
}

// Placeholder for updateArticleAction
export async function updateArticleAction(slug: string, formData: FormData): Promise<any> {
  // TODO: Implement database logic for updating using Prisma
  // 1. Validate formData similar to createArticleAction
  // 2. Find article by current slug: await prisma.article.findUnique({ where: { slug } });
  // 3. If new slug is provided and different, check for uniqueness of new slug.
  // 4. Construct update data object.
  // 5. await prisma.article.update({ where: { id: article.id }, data: updateData });
  // 6. Revalidate relevant paths.
  console.log("Update action called for slug:", slug, Object.fromEntries(formData.entries()));
  // Example revalidation (adjust as needed)
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/articles/${slug}`); // Old slug
  // const newSlug = formData.get('slug') as string; // if slug can change
  // if (newSlug && newSlug !== slug) revalidatePath(`/articles/${newSlug}`); // New slug
  revalidatePath('/admin/articles');
  return { message: "Article update placeholder - DB logic not implemented", success: true };
}

// Placeholder for deleteArticleAction
export async function deleteArticleAction(slug: string): Promise<any> {
  // TODO: Implement database logic for deleting using Prisma
  // 1. await prisma.article.delete({ where: { slug } });
  // 2. Revalidate relevant paths.
  console.log("Delete action called for slug:", slug);
  try {
    await prisma.article.delete({
        where: { slug },
    });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin/articles');
    return { message: `Article "${slug}" deleted successfully (Placeholder - DB connected).`, success: true };
  } catch (error) {
    console.error("Delete article error:", error);
    let errorMessage = "An unexpected error occurred while deleting the article.";
     if (error instanceof Error) {
        errorMessage = error.message;
        if ((error as any).code === 'P2025') { // Prisma error for record not found
            errorMessage = `Article with slug "${slug}" not found.`;
        }
    }
    return { message: errorMessage, success: false };
  }
}
