
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Gender = "male" | "female" | "unselected";

interface ProfileData {
  nickname: string;
  about: string;
  gender: Gender;
  avatar: string;
  isPremium: boolean;
}

interface ProfileState extends ProfileData {
  isRegistered: boolean | null; 
  setProfile: (data: Partial<ProfileData>) => void;
  setIsRegistered: (isRegistered: boolean) => void;
  checkRegistration: () => void;
  logout: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      isRegistered: null, 
      nickname: '',
      about: '',
      gender: 'unselected',
      avatar: '',
      isPremium: false,

      // Actions
      setProfile: (data) => set((state) => ({ ...state, ...data })),
      setIsRegistered: (isRegistered) => set({ isRegistered }),
      
      // Check registration status from storage
      checkRegistration: () => {
        // The `persist` middleware automatically rehydrates the state from localStorage.
        // This function's job is to check the rehydrated state and update our
        // `isRegistered` flag accordingly. We don't need a timeout, as the store
        // is already rehydrated by the time this is called from a component.
        const hasRehydrated = useProfileStore.persist.hasHydrated();

        // We only proceed if rehydration has happened and `isRegistered` is still null.
        if (hasRehydrated && get().isRegistered === null) {
          const registered = !!get().nickname;
          set({ isRegistered: registered });
        }
      },

      logout: () => {
        // Reset state to initial values and clear registration status
        set({
          isRegistered: false,
          nickname: '',
          about: '',
          gender: 'unselected',
          avatar: '',
          isPremium: false,
        });
      },
    }),
    {
      name: 'meetcloud-profile-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.isRegistered = null;
        }
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['isRegistered'].includes(key))
      ),
    }
  )
);
