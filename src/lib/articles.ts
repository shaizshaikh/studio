
import type { Article, ArticleFormData } from './types';

// Helper to convert Markdown to simple HTML (very basic for now)
// In a real app, you'd use a robust Markdown parser like 'marked' or 'react-markdown' for rendering
export function markdownToHtml(markdown: string): string {
  // Ensure basic paragraph wrapping for single lines or consecutive non-block lines
  let inCodeBlock = false;
  return markdown
    .split('\n')
    .map(line => {
      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return inCodeBlock ? '<pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4"><code>' : '</code></pre>';
      }
      if (inCodeBlock) {
        return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Basic escaping
      }

      if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mb-4">${line.substring(2)}</h1>`;
      if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.substring(3)}</h2>`;
      if (line.startsWith('### ')) return `<h3 class="text-xl font-semibold mt-4 mb-2">${line.substring(4)}</h3>`;
      if (line.startsWith('#### ')) return `<h4 class="text-lg font-semibold mt-3 mb-1">${line.substring(5)}</h4>`;
      if (line.startsWith('##### ')) return `<h5 class="text-base font-semibold mt-2 mb-1">${line.substring(6)}</h5>`;
      if (line.startsWith('###### ')) return `<h6 class="text-sm font-semibold mt-1 mb-1">${line.substring(7)}</h6>`;
      
      // Basic list handling
      if (line.startsWith('- ') || line.startsWith('* ')) return `<li class="ml-5 list-disc">${line.substring(2)}</li>`;
      // Basic numbered list handling
      if (line.match(/^\d+\.\s/)) return `<li class="ml-5 list-decimal">${line.replace(/^\d+\.\s/, '')}</li>`;

      // Image handling: ![alt](src)
      const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
      line = line.replace(imgRegex, (match, alt, src) => {
        const aiHint = src.includes('placehold.co') ? 'placeholder image' : 'article image';
        return `<img src="${src}" alt="${alt}" class="my-6 rounded-lg shadow-md" data-ai-hint="${aiHint}" />`;
      });

      // Link handling: [text](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      line = line.replace(linkRegex, (match, text, url) => {
        return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });
      
      // Bold and Italic
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
      line = line.replace(/__(.*?)__/g, '<strong>$1</strong>'); // Bold (underscore)
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');       // Italic
      line = line.replace(/_(.*?)_/g, '<em>$1</em>');         // Italic (underscore)


      if (line.trim() === '') return '<br />'; // Keep empty lines for spacing if desired, or remove for tighter text
      return `<p class="mb-4">${line}</p>`;
    })
    .join('')
    // Wrap consecutive <li> items in <ul> or <ol>
    // This is a simplified approach; robust parsing would be more complex
    .replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
      if (match.includes('list-disc')) return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
      if (match.includes('list-decimal')) return `<ol class="list-decimal list-inside mb-4 space-y-1">${match}</ol>`;
      return match; // Should not happen if classes are set right
    });
}

// Mock data - in a real app, this would come from a database or Markdown files
// TODO: This will be replaced by database calls.
export let articles: Article[] = [
  {
    slug: 'getting-started-with-kubernetes',
    title: 'Getting Started with Kubernetes: A Beginner\'s Guide',
    date: '2024-05-15',
    tags: ['kubernetes', 'devops', 'orchestration', 'containers'],
    excerpt: 'Learn the basics of Kubernetes and how to deploy your first application. Understand pods, services, and deployments.',
    rawContent: `Kubernetes, often abbreviated as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery.

## Core Concepts
- **Pods:** The smallest deployable units of computing that you can create and manage in Kubernetes.
- **Services:** An abstract way to expose an application running on a set of Pods as a network service.
- **Deployments:** Provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate.
- **Namespaces:** Virtual clusters backed by the same physical cluster. They are a way to divide cluster resources between multiple users.

## Why Use Kubernetes?
Kubernetes offers several advantages for managing containerized applications:
- **Scalability:** Easily scale your applications up or down based on demand.
- **High Availability:** Ensures your applications are always running and available by handling failures automatically.
- **Portability:** Run your applications consistently across different environments (dev, staging, prod, cloud, on-prem).
- **Service Discovery and Load Balancing:** Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.

![Kubernetes Architecture Diagram](https://placehold.co/800x400.png)

This guide provides a starting point. The world of Kubernetes is vast, with many more features and best practices to explore.
    `,
    htmlContent: '', // Will be generated
    image: 'https://placehold.co/600x400.png',
    imageHint: 'kubernetes abstract'
  },
  {
    slug: 'ci-cd-pipelines-with-github-actions',
    title: 'Building Robust CI/CD Pipelines with GitHub Actions',
    date: '2024-04-22',
    tags: ['ci/cd', 'github actions', 'devops', 'automation'],
    excerpt: 'Discover how to automate your software delivery process using GitHub Actions. From testing to deployment, streamline your workflow.',
    rawContent: `Continuous Integration (CI) and Continuous Delivery/Deployment (CD) are cornerstone practices in modern DevOps. GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub.

## Key Features of GitHub Actions
- **Workflow Automation:** Define custom workflows that trigger on GitHub events like push, pull request, or issue creation.
- **Matrix Builds:** Test your code across multiple operating systems, language versions, and platforms simultaneously.
- **Reusable Actions:** Leverage thousands of actions from the GitHub Marketplace or create your own.
- **Secrets Management:** Securely store and use sensitive information like API keys and tokens in your workflows.

![GitHub Actions Workflow](https://placehold.co/800x400.png)

## Example Workflow
\`\`\`yaml
name: Node.js CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
\`\`\`
This simple workflow checks out code, sets up Node.js, installs dependencies, builds the project, and runs tests on every push to the repository.
    `,
    htmlContent: '', // Will be generated
    image: 'https://placehold.co/600x400.png',
    imageHint: 'github automation'
  },
  // ... other articles ...
];

// Initialize htmlContent for all articles
articles = articles.map(article => ({
  ...article,
  htmlContent: markdownToHtml(article.rawContent || ''), // Ensure rawContent exists
}));


// TODO: Replace with actual database calls
export async function getArticles(): Promise<Article[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB latency
  // Ensure htmlContent is generated if not already present
  const processedArticles = articles.map(article => ({
    ...article,
    htmlContent: article.htmlContent || markdownToHtml(article.rawContent || ''),
  }));
  return [...processedArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// TODO: Replace with actual database calls
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB latency
  const article = articles.find(article => article.slug === slug);
  if (article) {
    return {
      ...article,
      htmlContent: article.htmlContent || markdownToHtml(article.rawContent || ''),
    };
  }
  return undefined;
}

// TODO: Replace with actual database calls
export async function getAllTags(): Promise<string[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB latency
  const allTags = articles.reduce((acc, article) => {
    article.tags.forEach(tag => {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    });
    return acc;
  }, [] as string[]);
  return allTags.sort();
}

// The createArticle, updateArticle, deleteArticle functions are now handled by Server Actions.
// They are kept here (commented out or modified) for reference or if direct lib use is needed elsewhere.

/*
// This function's logic will be primarily in the server action.
// It's kept here to show how the in-memory array is updated.
// TODO: This function should be removed or adapted once DB is in place.
export function _addArticleToMemory(newArticle: Article): Article {
  // Check for duplicate slugs (simple check for in-memory)
  if (articles.some(a => a.slug === newArticle.slug)) {
    throw new Error(`Article with slug "${newArticle.slug}" already exists.`);
  }
  articles.unshift(newArticle); // Add to the beginning of the array
  return newArticle;
}

// TODO: Implement update logic, likely within a server action that interacts with the DB.
export async function updateArticle(slug: string, articleData: Partial<ArticleFormData>): Promise<Article | undefined> {
  const articleIndex = articles.findIndex(a => a.slug === slug);
  if (articleIndex === -1) {
    return undefined;
  }

  const existingArticle = articles[articleIndex];
  const updatedArticleDetails: Partial<Article> = {};

  if (articleData.title) updatedArticleDetails.title = articleData.title;
  if (articleData.date) updatedArticleDetails.date = articleData.date;
  if (articleData.excerpt) updatedArticleDetails.excerpt = articleData.excerpt;
  if (articleData.image) updatedArticleDetails.image = articleData.image;
  if (articleData.imageHint) updatedArticleDetails.imageHint = articleData.imageHint;
  
  if (articleData.tags) {
    updatedArticleDetails.tags = articleData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  }
  if (articleData.content) {
    updatedArticleDetails.rawContent = articleData.content;
    updatedArticleDetails.htmlContent = markdownToHtml(articleData.content);
  }
  // Slug change is more complex, usually not allowed or handled with redirects.
  if (articleData.slug && articleData.slug !== existingArticle.slug) {
     if (articles.some(a => a.slug === articleData.slug && a.slug !== existingArticle.slug)) {
        throw new Error(`Article with slug "${articleData.slug}" already exists.`);
    }
    updatedArticleDetails.slug = articleData.slug;
  }

  const updatedArticle = { ...existingArticle, ...updatedArticleDetails };
  articles[articleIndex] = updatedArticle;
  return updatedArticle;
}

// TODO: Implement delete logic, likely within a server action that interacts with the DB.
export async function deleteArticle(slug: string): Promise<boolean> {
  const initialLength = articles.length;
  articles = articles.filter(a => a.slug !== slug);
  return articles.length < initialLength;
}
*/

// Example articles (add more if needed for initial data)
const otherArticles: Partial<Article>[] = [
 {
    slug: 'infrastructure-as-code-terraform-basics',
    title: 'Infrastructure as Code: Terraform Basics',
    date: '2024-03-10',
    tags: ['iac', 'terraform', 'devops', 'cloud'],
    excerpt: 'An introduction to Infrastructure as Code (IaC) using Terraform. Manage your cloud resources declaratively and version control your infrastructure.',
    rawContent: `Infrastructure as Code (IaC) is the management of infrastructure (networks, virtual machines, load balancers, and connection topology) in a descriptive model, using the same versioning as DevOps team uses for source code. Terraform is a popular open-source IaC tool created by HashiCorp.

## Core Terraform Concepts
- **Providers:** Plugins that allow Terraform to interact with cloud providers, SaaS providers, and other APIs.
- **Resources:** The most important element in the Terraform language. Each resource block describes one or more infrastructure objects, such as virtual networks, compute instances, or higher-level components such as DNS records.
- **Modules:** Reusable units of Terraform configuration that can be called multiple times, either within the same configuration or in separate configurations.
- **State:** Terraform records information about what infrastructure it created in a state file. This state is used to map real-world resources to your configuration, keep track of metadata, and improve performance for large infrastructures.

![Terraform Plan and Apply](https://placehold.co/800x400.png)

## Benefits of IaC with Terraform
Using Terraform for IaC provides numerous benefits:
- **Automation:** Reduces manual effort and errors in provisioning and managing infrastructure.
- **Version Control:** Track changes to your infrastructure over time, roll back to previous states, and collaborate effectively.
- **Reusability:** Define infrastructure once and deploy it multiple times across different environments.
- **Consistency:** Ensures that your infrastructure is provisioned and configured consistently every time.`,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'cloud infrastructure'
  },
  {
    slug: 'monitoring-and-observability-in-devops',
    title: 'The Pillars of Monitoring and Observability in DevOps',
    date: '2024-02-28',
    tags: ['monitoring', 'observability', 'devops', 'logging', 'metrics', 'tracing'],
    excerpt: 'Understand the key differences and synergies between monitoring and observability. Learn about logs, metrics, and traces.',
    rawContent: `In the world of DevOps, ensuring system reliability and performance is paramount. Monitoring and observability are two closely related concepts that help teams achieve this. While often used interchangeably, they have distinct meanings and purposes.

## What is Monitoring?
Monitoring is about collecting, processing, aggregating, and displaying real-time quantitative data about a system, such as query counts and types, error counts and types, processing times, and server lifetimes. It helps you understand the state of your systems by tracking predefined metrics and logs. When something goes wrong, monitoring tools can alert you to the issue.

## What is Observability?
Observability, on the other hand, is about being able to ask arbitrary questions about your system without having to know in advance what you want to ask. It's a property of a system that allows you to understand its internal state by examining its outputs (logs, metrics, traces). Observability helps you debug and understand novel problems – the "unknown unknowns."

![Observability Pillars](https://placehold.co/800x400.png)

## The Three Pillars of Observability
- **Logs:** Timestamped records of discrete events that happened over time.
- **Metrics:** Numerical representations of data measured over intervals of time.
- **Traces:** Representations of a series of causally related distributed events that encode the end-to-end request flow through a distributed system.

Effective DevOps practices leverage both monitoring (for known issues and trends) and observability (for deep diagnostics and understanding complex system behaviors).`,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'dashboard analytics'
  }
];

otherArticles.forEach(articleData => {
  if (!articles.find(a => a.slug === articleData.slug)) {
    const fullArticle: Article = {
      slug: articleData.slug!,
      title: articleData.title!,
      date: articleData.date!,
      tags: articleData.tags!,
      excerpt: articleData.excerpt!,
      rawContent: articleData.rawContent!,
      htmlContent: markdownToHtml(articleData.rawContent!),
      image: articleData.image,
      imageHint: articleData.imageHint,
    };
    articles.push(fullArticle);
  }
});
// Sort articles by date after adding any new ones
articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    