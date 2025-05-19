
'use server';
/**
 * @fileOverview An AI agent that summarizes article content.
 *
 * - summarizeArticle - A function that generates a summary for an article.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SummarizeArticleInputSchema = z.object({
  articleContent: z.string().describe('The plain text content of the article to be summarized.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

export const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article content.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const summaryPrompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an expert at summarizing technical articles for a general but tech-savvy audience.
Please provide a concise summary of the following article content.
Focus on the main topics, key takeaways, and any actionable insights if present. The summary should be approximately 3-5 sentences long and easy to understand.

Article Content:
{{{articleContent}}}
  `,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async (input) => {
    const {output} = await summaryPrompt(input);
    if (!output) {
      throw new Error('No summary was generated.');
    }
    return output;
  }
);
