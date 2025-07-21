
"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore, type Language } from '@/lib/language-store';
import { getTranslation } from '@/lib/actions';

// A simple in-memory cache to avoid re-translating the same strings.
const translationCache = new Map<string, string>();

// A function to batch translations
async function batchTranslate(
  texts: string[],
  sourceLanguage: Language,
  targetLanguage: Language
): Promise<string[]> {
  const uniqueTextsToTranslate = [...new Set(texts.filter(text => !translationCache.has(`${text}:${targetLanguage}`)))];

  if (uniqueTextsToTranslate.length === 0) {
    return texts.map(text => translationCache.get(`${text}:${targetLanguage}`)!);
  }
  
  // In a real app, we might use a dedicated batch translation endpoint.
  // For now, we'll use Promise.all which sends requests in parallel.
  try {
    const translations = await Promise.all(
        uniqueTextsToTranslate.map(text => getTranslation(text, sourceLanguage, targetLanguage))
    );

    translations.forEach((translatedText, index) => {
        const originalText = uniqueTextsToTranslate[index];
        translationCache.set(`${originalText}:${targetLanguage}`, translatedText);
    });

  } catch(e) {
    console.error("Batch translation failed", e);
    // On error, we can return originals to prevent UI breakage
     uniqueTextsToTranslate.forEach((originalText) => {
        translationCache.set(`${originalText}:${targetLanguage}`, originalText);
    });
  }

  return texts.map(text => translationCache.get(`${text}:${targetLanguage}`)!);
}


export function useTranslation<T extends Record<string, string>>(
  stringObject: T
): T {
  const { language: targetLanguage } = useLanguageStore();
  const [translatedStrings, setTranslatedStrings] = useState<T>(stringObject);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (targetLanguage === 'Russian') {
      setTranslatedStrings(stringObject);
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      const originalTexts = Object.values(stringObject);
      const translatedTexts = await batchTranslate(originalTexts, 'Russian', targetLanguage);
      
      const newTranslatedObject = { ...stringObject };
      Object.keys(stringObject).forEach((key, index) => {
        (newTranslatedObject as any)[key] = translatedTexts[index];
      });

      setTranslatedStrings(newTranslatedObject);
      setIsTranslating(false);
    };

    translate();
  }, [targetLanguage, stringObject]);

  // While translating, it's better to show original text than a loader
  return translatedStrings;
}
