
export interface Article {
  slug: string;
  title: string;
  date: string; // ISO string format e.g. "2023-10-26"
  tags: string[]; // Stored as an array
  excerpt: string;
  htmlContent: string; // Pre-rendered HTML content from Markdown
  image?: string; // Optional image URL for the article
  imageHint?: string; // Optional AI hint for placeholder image
}

// For form handling, tags might be a string initially
export interface ArticleFormData extends Omit<Article, 'tags' | 'htmlContent'> {
  tags: string; // Comma-separated string for form input
  content: string; // Raw Markdown content from form
}
