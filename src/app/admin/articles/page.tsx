// src/app/admin/articles/page.tsx
import { getArticles } from '@/lib/articles';
import { ArticleTableClient } from '@/components/admin/ArticleTableClient';

export default async function ManageArticlesPage() {
  const articles = await getArticles();
  return <ArticleTableClient initialArticles={articles} />;
}
