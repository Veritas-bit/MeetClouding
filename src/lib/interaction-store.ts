
'use client';

import { create } from 'zustand';

interface InteractionState {
  hasInteractedWithMap: boolean;
  setHasInteractedWithMap: (hasInteracted: boolean) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  hasInteractedWithMap: false,
  setHasInteractedWithMap: (hasInteracted) => set({ hasInteractedWithMap: hasInteracted }),
}));
