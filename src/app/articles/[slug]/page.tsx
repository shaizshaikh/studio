
import { getArticleBySlug, getArticles } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { TagBadge } from '@/components/articles/TagBadge';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
// Removed ArticleSummary import
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
  const articles = await getArticles();
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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image ? [article.image] : undefined,
    datePublished: article.date,
    author: { // Assuming a generic author for now
      '@type': 'Organization',
      name: 'DevOps Digest',
    },
    publisher: {
        '@type': 'Organization',
        name: 'DevOps Digest',
        logo: {
            '@type': 'ImageObject',
            url: 'https://placehold.co/600x60.png/FFFFFF/000000?text=DevOps+Digest+Logo' // Replace with actual logo URL
        }
    },
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? `${window.location.origin}/articles/${article.slug}` : `/articles/${article.slug}`, // Use a placeholder or ensure base URL is available
    },
  };

  return {
    title: `${article.title} | DevOps Digest`,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    openGraph: article.image ? {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.date,
      authors: ['DevOps Digest'], // Generic author
      tags: article.tags,
    } : undefined,
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
    alternates: {
      canonical: `/articles/${article.slug}`,
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

  // Access structured data if needed for <script> tag, though metadata API handles it
  const metadataResult = await generateMetadata({ params });
  const structuredDataString = (metadataResult.other as { structuredData: string })?.structuredData;


  return (
    <article className="max-w-3xl mx-auto py-8">
      {/* Include JSON-LD structured data */}
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
            height={450} // 16:9 aspect ratio for 800px width
            className="w-full object-cover"
            priority // Prioritize loading of the main article image
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
        dangerouslySetInnerHTML={{ __html: article.htmlContent }} 
      />

      {/* Removed ArticleSummary component */}

      <RelatedArticles 
        currentArticleContent={article.htmlContent} 
        currentArticleTags={article.tags} 
      />
    </article>
  );
}
