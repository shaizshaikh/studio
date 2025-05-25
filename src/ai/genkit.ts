import { defineConfig } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { suggestRelatedArticles } from './flows/suggest-related-articles';

export const ai = defineConfig({
  plugins: [googleAI()],
  flows: [suggestRelatedArticles],
});
