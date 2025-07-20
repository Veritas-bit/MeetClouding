import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface ProfileState {
  isRegistered: boolean | null;
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
      setIsRegistered: (isRegistered) => set({ isRegistered }),
      checkRegistration: () => {
        const registered = checkUserRegistration();
        set({ isRegistered: registered });
      },
    }),
    {
      name: 'profile-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // Only persist the isRegistered state
      partialize: (state) => ({ isRegistered: state.isRegistered }),
      // Set initial state from storage on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.checkRegistration();
        }
      }
    }
  )
);
