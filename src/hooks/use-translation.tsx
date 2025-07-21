
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLanguageStore } from '@/lib/language-store';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import uk from '@/locales/uk.json';
import be from '@/locales/be.json';
import es from '@/locales/es.json';

const translations = {
  Russian: ru,
  English: en,
  Ukrainian: uk,
  Belarusian: be,
  Spanish: es,
};

type TranslationKey = keyof typeof ru;

// This is a simplified translation hook that loads the appropriate JSON file.
export function useTranslation() {
  const { language } = useLanguageStore();
  const [t, setT] = useState<(key: TranslationKey) => string>(() => (key: TranslationKey) => ru[key] || key);

  useEffect(() => {
    const translateFunction = (key: TranslationKey): string => {
      const translationSet = translations[language] || ru;
      return (translationSet as any)[key] || ru[key] || key;
    };
    setT(() => translateFunction);
  }, [language]);

  return t;
}

    