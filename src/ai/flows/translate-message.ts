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
  prompt: `You are an expert translator specializing in informal, conversational text between multiple languages, including closely related Slavic languages like Russian, Ukrainian, and Belarusian.

Your task is to translate the following message from {{sourceLanguage}} to {{targetLanguage}}.

It is critical to preserve the original tone, style, and any nuances like slang or informalities. For translations between Russian, Ukrainian, and Belarusian, be extra careful to provide a natural and accurate translation, not just a literal one.

Original message ({{sourceLanguage}}):
"{{text}}"

Translate this message to {{targetLanguage}}.`,
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
