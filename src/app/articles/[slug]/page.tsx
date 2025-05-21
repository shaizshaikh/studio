
import { getArticleBySlug, getArticles, markdownToHtml } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { TagBadge } from '@/components/articles/TagBadge';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, Tags, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await getArticles(); // Fetches from DB via Prisma
  return articles.map(article => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const articleUrl = siteBaseUrl ? `${siteBaseUrl}/articles/${article.slug}` : `/articles/${article.slug}`;
  
  // Use a more generic placeholder if the actual logo URL isn't available or base URL isn't set
  const publisherLogoUrl = siteBaseUrl 
    ? `${siteBaseUrl}/images/logo.png` // Assuming you'll place a logo.png in public/images
    : 'https://placehold.co/600x60.png/000000/FFFFFF?text=DevOps+Digest';


  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image ? [article.image] : undefined, // Ensure it's an array
    datePublished: new Date(article.date).toISOString(),
    dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date(article.date).toISOString(),
    author: { 
      '@type': 'Organization', // Or 'Person' if you add specific author details to articles
      name: 'DevOps Digest', // Replace with actual author name or site name if it varies
    },
    publisher: {
        '@type': 'Organization',
        name: 'DevOps Digest',
        logo: {
            '@type': 'ImageObject',
            url: publisherLogoUrl,
        }
    },
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleBody: article.rawContent,
  };

  return {
    title: `${article.title} | DevOps Digest`,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      images: article.image ? [
        {
          url: article.image,
          width: 1200, // Standard OG image width
          height: 630, // Standard OG image height
          alt: article.title,
        },
      ] : undefined,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date(article.date).toISOString(),
      authors: ['DevOps Digest'], // Or specific author if available
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
      // site: '@yourTwitterHandle', // Optional: Your Twitter handle
      // creator: '@authorTwitterHandle', // Optional: Author's Twitter handle
    },
    alternates: {
      canonical: articleUrl,
    },
    other: {
      structuredData: JSON.stringify(structuredData),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Ensure htmlContent is available, generate if necessary
  const finalHtmlContent = article.htmlContent || markdownToHtml(article.rawContent);

  // Fetch metadata again to get structured data for the script tag
  // Note: In Next.js 13+ App Router, metadata is handled by `generateMetadata`
  // but for ld+json script, we might need to pass it or re-fetch/re-construct.
  // For simplicity here, re-constructing a minimal part or assuming generateMetadata has run.
  // A more optimized way might involve a shared utility if performance becomes a concern.
  const metadataResult = await generateMetadata({ params }); // Re-call to get the stringified data
  const structuredDataString = (metadataResult.other as { structuredData: string })?.structuredData;


  return (
    <article className="max-w-3xl mx-auto py-8">
      {structuredDataString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataString }}
        />
      )}
      <div className="mb-8">
        <Button variant="outline" asChild size="sm" className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Articles
          </Link>
        </Button>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-primary">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Published on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {article.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
               <Tags className="h-4 w-4 mr-1.5" />
              {article.tags.map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>

      {article.image && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={450} 
            className="w-full object-cover"
            priority 
            data-ai-hint={article.imageHint || 'technology blog'}
          />
        </div>
      )}
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none 
                   prose-headings:font-semibold prose-headings:text-foreground 
                   prose-p:text-foreground/90 prose-a:text-primary hover:prose-a:text-primary/80
                   prose-strong:text-foreground prose-ul:list-disc prose-ol:list-decimal
                   prose-li:my-1 prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: finalHtmlContent }} 
      />

      <RelatedArticles 
        currentArticleSlug={article.slug}
        currentArticleContent={finalHtmlContent} 
        currentArticleTags={article.tags} 
      />
    </article>
  );
}
