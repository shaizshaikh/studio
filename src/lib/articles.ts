
import type { Article } from './types';
import prisma from './db'; // Import Prisma client

// Helper function to process inline markdown elements (bold, italic, links, images, code, strikethrough)
function processInlineMarkdown(text: string): string {
  let processedText = text;

  // Images: ![alt](src) - Process images first to avoid conflict with link syntax
  processedText = processedText.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    // Ensure alt and src are trimmed to avoid issues with leading/trailing spaces
    const trimmedAlt = alt ? alt.trim() : '';
    const trimmedSrc = src ? src.trim() : '';
    const aiHint = trimmedSrc.includes('placehold.co') ? 'placeholder image' : 'article image';
    return `<img src="${trimmedSrc}" alt="${trimmedAlt}" class="my-6 rounded-lg shadow-md" data-ai-hint="${aiHint}" />`;
  });

  // Links: [text](url)
  processedText = processedText.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    // Ensure linkText and url are trimmed
    const trimmedLinkText = linkText ? linkText.trim() : '';
    const trimmedUrl = url ? url.trim() : '';
    return `<a href="${trimmedUrl}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${trimmedLinkText}</a>`;
  });

  // Bold: **text** or __text__
  processedText = processedText.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, g1, g2) => `<strong>${g1 || g2}</strong>`);

  // Italic: *text* or _text_
  // Ensure this doesn't conflict with ** by matching only single * or _ not surrounded by another * or _
  processedText = processedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, (match, g1, g2) => `<em>${g1 || g2}</em>`);
  
  // Strikethrough: ~~text~~
  processedText = processedText.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // Inline code: `code`
  processedText = processedText.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  return processedText;
}


// Helper to convert Markdown to HTML with basic list and code block support
export function markdownToHtml(markdown: string): string {
  let html = '';
  let inCodeBlock = false;
  let codeBlockLang = ''; // To store the language for syntax highlighting if we add it later
  let inUnorderedList = false;
  let inOrderedList = false;

  const lines = markdown.split('\n');

  function closeLists() {
    if (inUnorderedList) {
      html += '</ul>\n';
      inUnorderedList = false;
    }
    if (inOrderedList) {
      html += '</ol>\n';
      inOrderedList = false;
    }
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      closeLists();
      if (inCodeBlock) {
        html += '</code></pre>\n';
        inCodeBlock = false;
      } else {
        codeBlockLang = line.substring(3).trim(); // Extract language
        // Add class for syntax highlighting if language is specified, e.g., language-javascript
        const langClass = codeBlockLang ? `language-${codeBlockLang}` : '';
        html += `<pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4 ${langClass}"><code>`;
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      html += line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
      continue;
    }

    const ulMatch = line.match(/^(\s*[-*+]\s+)(.*)/);
    const olMatch = line.match(/^(\s*\d+\.\s+)(.*)/);

    if (ulMatch) {
      if (inOrderedList) closeLists();
      if (!inUnorderedList) {
        // prose-ul and prose-li will handle specific styling. mb-4 and space-y-1 are good defaults.
        html += '<ul class="mb-4 space-y-1">\n'; 
        inUnorderedList = true;
      }
      html += `<li>${processInlineMarkdown(ulMatch[2])}</li>\n`;
      continue;
    } else if (olMatch) {
      if (inUnorderedList) closeLists();
      if (!inOrderedList) {
         // prose-ol and prose-li will handle specific styling.
        html += '<ol class="mb-4 space-y-1">\n';
        inOrderedList = true;
      }
      html += `<li>${processInlineMarkdown(olMatch[2])}</li>\n`;
      continue;
    } else {
      closeLists();
    }

    if (line.startsWith('# ')) { html += `<h1 class="text-3xl font-bold mb-4">${processInlineMarkdown(line.substring(2))}</h1>\n`; continue; }
    if (line.startsWith('## ')) { html += `<h2 class="text-2xl font-semibold mt-6 mb-3">${processInlineMarkdown(line.substring(3))}</h2>\n`; continue; }
    if (line.startsWith('### ')) { html += `<h3 class="text-xl font-semibold mt-4 mb-2">${processInlineMarkdown(line.substring(4))}</h3>\n`; continue; }
    if (line.startsWith('#### ')) { html += `<h4 class="text-lg font-semibold mt-3 mb-1">${processInlineMarkdown(line.substring(5))}</h4>\n`; continue; }
    if (line.startsWith('##### ')) { html += `<h5 class="text-base font-semibold mt-2 mb-1">${processInlineMarkdown(line.substring(6))}</h5>\n`; continue; }
    if (line.startsWith('###### ')) { html += `<h6 class="text-sm font-semibold mt-1 mb-1">${processInlineMarkdown(line.substring(7))}</h6>\n`; continue; }
    
    if (line.trim() === '') {
      // html += '<br />\n'; // Or just let paragraph spacing handle it.
      // For cleaner HTML, avoid empty paragraphs from blank lines unless it's intentional for spacing.
      // The current logic wraps non-empty non-list/heading lines in <p>.
      continue; 
    }
    
    html += `<p class="mb-4">${processInlineMarkdown(line)}</p>\n`;
  }

  closeLists();
  // Ensure final code block is closed if the markdown ends with it
  if (inCodeBlock) {
    html += '</code></pre>\n';
  }
  return html.trim(); // Trim trailing newline
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
    if (Array.isArray(article.tags)) { // Ensure tags is an array
        article.tags.forEach(tag => allTagsSet.add(tag));
    }
  });

  return Array.from(allTagsSet).sort();
}
