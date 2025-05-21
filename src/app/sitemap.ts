
import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/articles';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...articleEntries,
  ];
}
