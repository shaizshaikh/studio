import type { Article } from './types';
import prisma from './db'; // Import Prisma client

// Helper to convert Markdown to simple HTML
export function markdownToHtml(markdown: string): string {
  let inCodeBlock = false;
  return markdown
    .split('\n')
    .map(line => {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return inCodeBlock ? '<pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4"><code>' : '</code></pre>';
      }
      if (inCodeBlock) {
        return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mb-4">${line.substring(2)}</h1>`;
      if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.substring(3)}</h2>`;
      if (line.startsWith('### ')) return `<h3 class="text-xl font-semibold mt-4 mb-2">${line.substring(4)}</h3>`;
      if (line.startsWith('#### ')) return `<h4 class="text-lg font-semibold mt-3 mb-1">${line.substring(5)}</h4>`;
      if (line.startsWith('##### ')) return `<h5 class="text-base font-semibold mt-2 mb-1">${line.substring(6)}</h5>`;
      if (line.startsWith('###### ')) return `<h6 class="text-sm font-semibold mt-1 mb-1">${line.substring(7)}</h6>`;
      
      const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
      line = line.replace(imgRegex, (match, alt, src) => {
        const aiHint = src.includes('placehold.co') ? 'placeholder image' : 'article image';
        return `<img src="${src}" alt="${alt}" class="my-6 rounded-lg shadow-md" data-ai-hint="${aiHint}" />`;
      });

      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      line = line.replace(linkRegex, (match, text, url) => {
        return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });
      
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/__(.*?)__/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      line = line.replace(/_(.*?)_/g, '<em>$1</em>');

      if (line.match(/^\s*-\s/) || line.match(/^\s*\*\s/)) { // Basic unordered list item
        return `<li class="ml-5 list-disc">${line.replace(/^\s*[-*]\s*/, '')}</li>`;
      }
      if (line.match(/^\s*\d+\.\s/)) { // Basic ordered list item
        return `<li class="ml-5 list-decimal">${line.replace(/^\s*\d+\.\s*/, '')}</li>`;
      }

      if (line.trim() === '') return ''; // Remove empty lines to avoid empty <p> tags unless explicitly <br/>
      return `<p class="mb-4">${line}</p>`;
    })
    .join('')
    // Wrap consecutive <li> items in <ul> or <ol>
    .replace(/(<li class="ml-5 list-disc">.*?<\/li>\s*)+/g, (match) => `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`)
    .replace(/(<li class="ml-5 list-decimal">.*?<\/li>\s*)+/g, (match) => `<ol class="list-decimal list-inside mb-4 space-y-1">${match}</ol>`);
}


// Fetch all articles from the database
export async function getArticles(): Promise<Article[]> {
  const articlesFromDb = await prisma.article.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  return articlesFromDb.map(article => ({
    ...article,
    // Ensure date is in YYYY-MM-DD string format as expected by Article type
    date: article.date.toISOString().split('T')[0], 
  }));
}

// Fetch a single article by slug from the database
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articleFromDb = await prisma.article.findUnique({
    where: { slug },
  });

  if (!articleFromDb) {
    return null;
  }

  return {
    ...articleFromDb,
    date: articleFromDb.date.toISOString().split('T')[0],
  };
}

// Fetch all unique tags from the database
export async function getAllTags(): Promise<string[]> {
  const articlesWithTags = await prisma.article.findMany({
    select: {
      tags: true,
    },
  });

  const allTagsSet = new Set<string>();
  articlesWithTags.forEach(article => {
    article.tags.forEach(tag => allTagsSet.add(tag));
  });

  return Array.from(allTagsSet).sort();
}
