
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishCategoryKey } from './categories';

interface WishLocation {
    latitude: number;
    longitude: number;
}

interface PublishedWish {
    message: string;
    categoryKey: WishCategoryKey;
    location: WishLocation;
    color: string;
    categoryName: string;
}

interface WishState {
  publishedWish: PublishedWish | null;
  setPublishedWish: (wish: PublishedWish | null) => void;
}

export const useWishStore = create<WishState>()(
  persist(
    (set) => ({
      publishedWish: null,
      setPublishedWish: (wish) => set({ publishedWish: wish }),
    }),
    {
      name: 'meetcloud-wish-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
