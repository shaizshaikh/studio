'use server';
/**
 * @fileOverview An AI agent that suggests related articles based on the content of the current article.
 *
 * - suggestRelatedArticles - A function that suggests related articles.
 * - SuggestRelatedArticlesInput - The input type for the suggestRelatedArticles function.
 * - SuggestRelatedArticlesOutput - The return type for the suggestRelatedArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedArticlesInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to find related articles for.'),
  articleTags: z.array(z.string()).optional().describe('The tags associated with the article, for filtering.'),
  numberOfSuggestions: z.number().default(3).describe('The number of related articles to suggest.'),
});
export type SuggestRelatedArticlesInput = z.infer<typeof SuggestRelatedArticlesInputSchema>;

const SuggestRelatedArticlesOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the related article.'),
    url: z.string().describe('The URL of the related article.'),
    summary: z.string().describe('A short summary of the related article.'),
  })
);
export type SuggestRelatedArticlesOutput = z.infer<typeof SuggestRelatedArticlesOutputSchema>;

export async function suggestRelatedArticles(
  input: SuggestRelatedArticlesInput
): Promise<SuggestRelatedArticlesOutput> {
  return suggestRelatedArticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedArticlesPrompt',
  input: {schema: SuggestRelatedArticlesInputSchema},
  output: {schema: SuggestRelatedArticlesOutputSchema},
  prompt: `You are an expert at suggesting related articles based on the content of a given article. Provide suggestions based on the content below, attempting to identify the most relevant topics. You will return an array of article suggestions. Each article must have a title, url, and summary.

Content: {{{articleContent}}}

Tags: {{#each articleTags}}{{{this}}} {{/each}}

Number of Suggestions: {{{numberOfSuggestions}}}`,
});

const suggestRelatedArticlesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedArticlesFlow',
    inputSchema: SuggestRelatedArticlesInputSchema,
    outputSchema: SuggestRelatedArticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
