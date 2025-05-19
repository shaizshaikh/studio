
export interface Article {
  id: string; // Added by database
  slug: string;
  title: string;
  date: string; // ISO string format e.g. "2023-10-26"
  tags: string[];
  excerpt: string;
  rawContent: string; // Raw Markdown content
  htmlContent: string; // Pre-rendered HTML content from Markdown
  image?: string; // Optional image URL for the article
  imageHint?: string; // Optional AI hint for placeholder image
  createdAt: Date; // Added by database
  updatedAt: Date; // Added by database
}

// For form handling, tags might be a string initially
// rawContent is what the user types in the textarea
export interface ArticleFormData {
  title: string;
  slug: string;
  date: string;
  tags: string; // Comma-separated string for form input
  excerpt: string;
  content: string; // Raw Markdown content from form (maps to rawContent in Article)
  image?: string;
  imageHint?: string;
}
