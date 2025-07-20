'use server';

/**
 * @fileOverview This file contains a Genkit flow for translating messages from one language to another.
 *
 * - translateMessage - A function that translates the input message to the target language.
 * - TranslateMessageInput - The input type for the translateMessage function.
 * - TranslateMessageOutput - The return type for the translateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateMessageInputSchema = z.object({
  text: z.string().describe('The message to translate.'),
  sourceLanguage: z.string().describe('The language of the message to translate from.'),
  targetLanguage: z.string().describe('The language to translate the message to.'),
});

export type TranslateMessageInput = z.infer<typeof TranslateMessageInputSchema>;

const TranslateMessageOutputSchema = z.object({
  translatedText: z.string().describe('The translated message.'),
});

export type TranslateMessageOutput = z.infer<typeof TranslateMessageOutputSchema>;

export async function translateMessage(input: TranslateMessageInput): Promise<TranslateMessageOutput> {
  return translateMessageFlow(input);
}

const translateMessagePrompt = ai.definePrompt({
  name: 'translateMessagePrompt',
  input: {schema: TranslateMessageInputSchema},
  output: {schema: TranslateMessageOutputSchema},
  prompt: `Translate the following message from {{sourceLanguage}} to {{targetLanguage}}:\n\n{{text}}`,
});

const translateMessageFlow = ai.defineFlow(
  {
    name: 'translateMessageFlow',
    inputSchema: TranslateMessageInputSchema,
    outputSchema: TranslateMessageOutputSchema,
  },
  async input => {
    const {output} = await translateMessagePrompt(input);
    return output!;
  }
);

