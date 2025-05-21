
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { TagBadge } from '@/components/articles/TagBadge';
import { Input } from '@/components/ui/input';
import { Search, Tag } from 'lucide-react';
import { CardSkeleton } from '@/app/page'; // Assuming CardSkeleton is exported from page.tsx

interface ArticleFilterableListProps {
  initialArticles: Article[];
  initialAllTags: string[];
}

export function ArticleFilterableList({ initialArticles, initialAllTags }: ArticleFilterableListProps) {
  // Component-level state for client-side filtering
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [allTags, setAllTags] = useState<string[]>(initialAllTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // This loading state is for client-side indications if needed,
  // but initial data is already loaded by the server.
  // It could be used if we were re-fetching or doing heavy client-side processing.
  const [loading, setLoading] = useState<boolean>(false); 

  // Update state if initial props change (e.g., due to revalidation and new server data)
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  useEffect(() => {
    setAllTags(initialAllTags);
  }, [initialAllTags]);


  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => (prevTag === tag ? null : tag));
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const tagMatch = selectedTag ? article.tags.includes(selectedTag) : true;
      const searchMatch = searchTerm
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return tagMatch && searchMatch;
    });
  }, [articles, selectedTag, searchTerm]);

  // Example of client-side loading skeleton if articles are empty from props initially
  // but this is less likely if server always provides data.
  if (initialArticles.length === 0 && initialAllTags.length === 0 && !searchTerm && !selectedTag) {
     // Or show a "No articles yet" message if that's more appropriate
     // This might happen if the DB is empty.
  }


  return (
    <>
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
                  onClick={() => handleTagClick(tag)} // ensure onClick is correctly passed
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

      {loading ? ( // This client-side loading state might be for subsequent operations, not initial load.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filteredArticles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          No articles found matching your criteria. Try a different search or tag.
          {(initialArticles.length === 0 && !searchTerm && !selectedTag) && " Or, create your first article!"}
        </p>
      )}
    </>
  );
}
