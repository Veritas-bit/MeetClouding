import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export type Gender = 'male' | 'female' | 'other';

interface ProfileState {
  isRegistered: boolean | null;
  isPremium: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
  checkRegistration: () => void;
}

// In a real app, this would check a token, call an API, etc.
// For now, we'll just simulate it with localStorage.
const checkUserRegistration = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('user_registered') === 'true';
}


export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      isRegistered: null,
      isPremium: false, // Default to false
      setIsRegistered: (isRegistered) => set({ isRegistered }),
      checkRegistration: () => {
        const registered = checkUserRegistration();
        // In a real app, premium status would likely come from an API call
        const premium = localStorage.getItem('user_premium') === 'true';
        set({ isRegistered: registered, isPremium: premium });
      },
    }),
    {
      name: 'profile-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // Only persist isRegistered and isPremium states
      partialize: (state) => ({ isRegistered: state.isRegistered, isPremium: state.isPremium }),
      // Set initial state from storage on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.checkRegistration();
        }
      }
    }
  )
);
