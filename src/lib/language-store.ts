
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'Russian' | 'English' | 'Spanish' | 'Ukrainian' | 'Belarusian';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'Russian', // Default language
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'meetcloud-language-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
