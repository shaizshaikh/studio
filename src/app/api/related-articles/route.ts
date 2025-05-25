// src/app/api/related-articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize AI config here
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// Define input schema
const InputSchema = z.object({
  articleContent: z.string(),
  articleTags: z.array(z.string()).optional(),
  numberOfSuggestions: z.number().default(3),
});

// Define output schema
const OutputSchema = z.array(
  z.object({
    title: z.string(),
    url: z.string(),
    summary: z.string(),
  }),
);

// Define prompt
const prompt = ai.definePrompt({
  name: 'suggestRelatedArticlesPrompt',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `You are an expert at suggesting related articles based on the content of a given article. Provide suggestions based on the content below, attempting to identify the most relevant topics. You will return an array of article suggestions. Each article must have a title, url, and summary.

Content: {{{articleContent}}}

Tags: {{#each articleTags}}{{{this}}} {{/each}}

Number of Suggestions: {{{numberOfSuggestions}}}`,
});

const suggestRelatedArticlesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedArticlesFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = InputSchema.parse(json);

    const suggestions = await suggestRelatedArticlesFlow(input);

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
