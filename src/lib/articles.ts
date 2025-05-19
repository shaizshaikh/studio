import type { Article } from './types';

// Mock data - in a real app, this would come from Markdown files
const articles: Article[] = [
  {
    slug: 'getting-started-with-kubernetes',
    title: 'Getting Started with Kubernetes: A Beginner\'s Guide',
    date: '2024-05-15',
    tags: ['kubernetes', 'devops', 'orchestration', 'containers'],
    excerpt: 'Learn the basics of Kubernetes and how to deploy your first application. Understand pods, services, and deployments.',
    htmlContent: `
      <p class="mb-4">Kubernetes, often abbreviated as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery.</p>
      <h2 class="text-2xl font-semibold mt-6 mb-3">Core Concepts</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Pods:</strong> The smallest deployable units of computing that you can create and manage in Kubernetes.</li>
        <li><strong>Services:</strong> An abstract way to expose an application running on a set of Pods as a network service.</li>
        <li><strong>Deployments:</strong> Provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate.</li>
        <li><strong>Namespaces:</strong> Virtual clusters backed by the same physical cluster. They are a way to divide cluster resources between multiple users.</li>
      </ul>
      <h2 class="text-2xl font-semibold mt-6 mb-3">Why Use Kubernetes?</h2>
      <p class="mb-4">Kubernetes offers several advantages for managing containerized applications:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Scalability:</strong> Easily scale your applications up or down based on demand.</li>
        <li><strong>High Availability:</strong> Ensures your applications are always running and available by handling failures automatically.</li>
        <li><strong>Portability:</strong> Run your applications consistently across different environments (dev, staging, prod, cloud, on-prem).</li>
        <li><strong>Service Discovery and Load Balancing:</strong> Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.</li>
      </ul>
      <img src="https://placehold.co/800x400.png" alt="Kubernetes Architecture Diagram" class="my-6 rounded-lg shadow-md" data-ai-hint="kubernetes architecture" />
      <p>This guide provides a starting point. The world of Kubernetes is vast, with many more features and best practices to explore.</p>
    `,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'kubernetes abstract'
  },
  {
    slug: 'ci-cd-pipelines-with-github-actions',
    title: 'Building Robust CI/CD Pipelines with GitHub Actions',
    date: '2024-04-22',
    tags: ['ci/cd', 'github actions', 'devops', 'automation'],
    excerpt: 'Discover how to automate your software delivery process using GitHub Actions. From testing to deployment, streamline your workflow.',
    htmlContent: `
      <p class="mb-4">Continuous Integration (CI) and Continuous Delivery/Deployment (CD) are cornerstone practices in modern DevOps. GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub.</p>
      <h2 class="text-2xl font-semibold mt-6 mb-3">Key Features of GitHub Actions</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Workflow Automation:</strong> Define custom workflows that trigger on GitHub events like push, pull request, or issue creation.</li>
        <li><strong>Matrix Builds:</strong> Test your code across multiple operating systems, language versions, and platforms simultaneously.</li>
        <li><strong>Reusable Actions:</strong> Leverage thousands of actions from the GitHub Marketplace or create your own.</li>
        <li><strong>Secrets Management:</strong> Securely store and use sensitive information like API keys and tokens in your workflows.</li>
      </ul>
      <img src="https://placehold.co/800x400.png" alt="GitHub Actions Workflow" class="my-6 rounded-lg shadow-md" data-ai-hint="workflow diagram" />
      <h2 class="text-2xl font-semibold mt-6 mb-3">Example Workflow</h2>
      <pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
<code>
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
</code>
      </pre>
      <p>This simple workflow checks out code, sets up Node.js, installs dependencies, builds the project, and runs tests on every push to the repository.</p>
    `,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'github automation'
  },
  {
    slug: 'infrastructure-as-code-terraform-basics',
    title: 'Infrastructure as Code: Terraform Basics',
    date: '2024-03-10',
    tags: ['iac', 'terraform', 'devops', 'cloud'],
    excerpt: 'An introduction to Infrastructure as Code (IaC) using Terraform. Manage your cloud resources declaratively and version control your infrastructure.',
    htmlContent: `
      <p class="mb-4">Infrastructure as Code (IaC) is the management of infrastructure (networks, virtual machines, load balancers, and connection topology) in a descriptive model, using the same versioning as DevOps team uses for source code. Terraform is a popular open-source IaC tool created by HashiCorp.</p>
      <h2 class="text-2xl font-semibold mt-6 mb-3">Core Terraform Concepts</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Providers:</strong> Plugins that allow Terraform to interact with cloud providers, SaaS providers, and other APIs.</li>
        <li><strong>Resources:</strong> The most important element in the Terraform language. Each resource block describes one or more infrastructure objects, such as virtual networks, compute instances, or higher-level components such as DNS records.</li>
        <li><strong>Modules:</strong> Reusable units of Terraform configuration that can be called multiple times, either within the same configuration or in separate configurations.</li>
        <li><strong>State:</strong> Terraform records information about what infrastructure it created in a state file. This state is used to map real-world resources to your configuration, keep track of metadata, and improve performance for large infrastructures.</li>
      </ul>
      <img src="https://placehold.co/800x400.png" alt="Terraform Plan and Apply" class="my-6 rounded-lg shadow-md" data-ai-hint="terraform logo" />
      <h2 class="text-2xl font-semibold mt-6 mb-3">Benefits of IaC with Terraform</h2>
      <p class="mb-4">Using Terraform for IaC provides numerous benefits:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Automation:</strong> Reduces manual effort and errors in provisioning and managing infrastructure.</li>
        <li><strong>Version Control:</strong> Track changes to your infrastructure over time, roll back to previous states, and collaborate effectively.</li>
        <li><strong>Reusability:</strong> Define infrastructure once and deploy it multiple times across different environments.</li>
        <li><strong>Consistency:</strong> Ensures that your infrastructure is provisioned and configured consistently every time.</li>
      </ul>
    `,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'cloud infrastructure'
  },
  {
    slug: 'monitoring-and-observability-in-devops',
    title: 'The Pillars of Monitoring and Observability in DevOps',
    date: '2024-02-28',
    tags: ['monitoring', 'observability', 'devops', 'logging', 'metrics', 'tracing'],
    excerpt: 'Understand the key differences and synergies between monitoring and observability. Learn about logs, metrics, and traces.',
    htmlContent: `
      <p class="mb-4">In the world of DevOps, ensuring system reliability and performance is paramount. Monitoring and observability are two closely related concepts that help teams achieve this. While often used interchangeably, they have distinct meanings and purposes.</p>
      <h2 class="text-2xl font-semibold mt-6 mb-3">What is Monitoring?</h2>
      <p class="mb-4">Monitoring is about collecting, processing, aggregating, and displaying real-time quantitative data about a system, such as query counts and types, error counts and types, processing times, and server lifetimes. It helps you understand the state of your systems by tracking predefined metrics and logs. When something goes wrong, monitoring tools can alert you to the issue.</p>
      <h2 class="text-2xl font-semibold mt-6 mb-3">What is Observability?</h2>
      <p class="mb-4">Observability, on the other hand, is about being able to ask arbitrary questions about your system without having to know in advance what you want to ask. It's a property of a system that allows you to understand its internal state by examining its outputs (logs, metrics, traces). Observability helps you debug and understand novel problems – the "unknown unknowns."</p>
      <img src="https://placehold.co/800x400.png" alt="Observability Pillars" class="my-6 rounded-lg shadow-md" data-ai-hint="data charts" />
      <h2 class="text-2xl font-semibold mt-6 mb-3">The Three Pillars of Observability</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Logs:</strong> Timestamped records of discrete events that happened over time.</li>
        <li><strong>Metrics:</strong> Numerical representations of data measured over intervals of time.</li>
        <li><strong>Traces:</strong> Representations of a series of causally related distributed events that encode the end-to-end request flow through a distributed system.</li>
      </ul>
      <p>Effective DevOps practices leverage both monitoring (for known issues and trends) and observability (for deep diagnostics and understanding complex system behaviors).</p>
    `,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'dashboard analytics'
  }
];

export async function getArticles(): Promise<Article[]> {
  // Sort articles by date in descending order (newest first)
  return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articles.find(article => article.slug === slug);
}

export async function getAllTags(): Promise<string[]> {
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
