
'use server';

import * as z from 'zod';
import prisma from '@/lib/db';
import { markdownToHtml } from '@/lib/articles';
import type { ArticleFormData } from '@/lib/types';
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

export type UpdateArticleState = {
  message: string;
  errors?: {
    [key in keyof ArticleFormData]?: string[];
  };
  success: boolean;
  updatedArticleSlug?: string;
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
        date: new Date(data.date),
        tags: tagsArray,
        excerpt: data.excerpt,
        rawContent: data.content,
        htmlContent: htmlContent,
        image: data.image || null,
        imageHint: data.imageHint || null,
      },
    });

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

export async function updateArticleAction(
  currentSlug: string,
  prevState: UpdateArticleState,
  formData: FormData
): Promise<UpdateArticleState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors as UpdateArticleState['errors'],
      success: false,
    };
  }

  const data = validatedFields.data;

  try {
    const articleToUpdate = await prisma.article.findUnique({
      where: { slug: currentSlug },
    });

    if (!articleToUpdate) {
      return { message: `Article with slug "${currentSlug}" not found.`, success: false };
    }

    // If slug is being changed, check if the new slug already exists for another article
    if (data.slug !== currentSlug) {
      const existingArticleWithNewSlug = await prisma.article.findUnique({
        where: { slug: data.slug },
      });
      if (existingArticleWithNewSlug) {
        return {
          message: `Another article with slug "${data.slug}" already exists.`,
          success: false,
          errors: { slug: [`Slug "${data.slug}" already exists for another article.`] },
        };
      }
    }

    const htmlContent = markdownToHtml(data.content);
    const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const updatedArticle = await prisma.article.update({
      where: { id: articleToUpdate.id },
      data: {
        title: data.title,
        slug: data.slug,
        date: new Date(data.date),
        tags: tagsArray,
        excerpt: data.excerpt,
        rawContent: data.content,
        htmlContent: htmlContent,
        image: data.image || null,
        imageHint: data.imageHint || null,
      },
    });

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${currentSlug}`); // Old slug path
    if (currentSlug !== updatedArticle.slug) {
      revalidatePath(`/articles/${updatedArticle.slug}`); // New slug path
    }
    revalidatePath('/admin/articles');
    
    return {
      message: `Article "${updatedArticle.title}" updated successfully!`,
      success: true,
      updatedArticleSlug: updatedArticle.slug,
    };

  } catch (error) {
    console.error("Update article error:", error);
    let errorMessage = "An unexpected error occurred while updating the article. Check server logs.";
     if (error instanceof Error) {
        // Check for Prisma specific unique constraint error for slug
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
            errorMessage = `Article with slug "${data.slug}" already exists. Please choose a unique slug.`;
            return { message: errorMessage, success: false, errors: { slug: [errorMessage]}};
        }
        errorMessage = error.message;
    }
    return { message: errorMessage, success: false };
  }
}

export async function deleteArticleAction(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.article.delete({
        where: { slug },
    });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin/articles'); // Revalidate the list of articles in admin
    return { message: `Article "${slug}" deleted successfully.`, success: true };
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
