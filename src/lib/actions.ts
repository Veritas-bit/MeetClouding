'use server';

import { translateMessage } from '@/ai/flows/translate-message';

export async function getTranslation(text: string, sourceLanguage: string, targetLanguage: string) {
  try {
    const result = await translateMessage({
      text,
      sourceLanguage,
      targetLanguage,
    });
    return result.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    // Return a user-friendly error message.
    return 'Sorry, translation is currently unavailable.';
  }
}
