"use client";

import { useState, useEffect, useMemo } from 'react';
import { getArticles, getAllTags } from '@/lib/articles';
import type { Article } from '@/lib/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { TagBadge } from '@/components/articles/TagBadge';
import { Input } from '@/components/ui/input';
import { Search, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedArticles, fetchedTags] = await Promise.all([
        getArticles(),
        getAllTags()
      ]);
      setArticles(fetchedArticles);
      setAllTags(fetchedTags);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => (prevTag === tag ? null : tag));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const tagMatch = selectedTag ? article.tags.includes(selectedTag) : true;
      const searchMatch = searchTerm
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return tagMatch && searchMatch;
    });
  }, [articles, selectedTag, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Skeleton className="h-10 w-full md:w-1/2" />
          <Skeleton className="h-10 w-full md:w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-12">
      <section className="text-center py-8 bg-card rounded-lg shadow">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Welcome to DevOps Digest</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on the latest in DevOps, cloud technologies, automation, and more.
          Filter by tags or search to find what interests you.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-6 items-center mb-8 p-4 bg-card rounded-lg shadow">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title, excerpt, or tag..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search articles"
          />
        </div>
        {allTags.length > 0 && (
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center"><Tag className="h-4 w-4 mr-1.5" />Filter by Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  interactive
                  onClick={handleTagClick}
                  isActive={selectedTag === tag}
                  aria-pressed={selectedTag === tag}
                />
              ))}
              {selectedTag && (
                 <TagBadge
                  tag="Clear Filter"
                  interactive
                  onClick={() => setSelectedTag(null)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  aria-label="Clear tag filter"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredArticles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          No articles found matching your criteria. Try a different search or tag.
        </p>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card p-4 rounded-lg shadow space-y-3">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
       <Skeleton className="h-8 w-28 mt-2" />
    </div>
  );
}

