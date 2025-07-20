
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export type Gender = 'male' | 'female' | 'unselected' | null;

type ProfileData = {
  isPremium?: boolean;
  nickname?: string | null;
  about?: string | null;
  gender?: Gender | null;
  avatar?: string | null;
}

interface ProfileState {
  isRegistered: boolean | null;
  isPremium: boolean;
  nickname: string | null;
  about: string | null;
  gender: Gender | null;
  avatar: string | null;
  setIsRegistered: (isRegistered: boolean) => void;
  checkRegistration: () => void;
  logout: () => void;
  setProfile: (data: ProfileData) => void;
}

// In a real app, this would check a token, call an API, etc.
// For now, we'll just simulate it with localStorage.
const checkUserRegistration = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('user_registered') === 'true';
}


export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      isRegistered: null,
      isPremium: false,
      nickname: null,
      about: null,
      gender: null,
      avatar: null,
      setIsRegistered: (isRegistered) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_registered', String(isRegistered));
        }
        set({ isRegistered })
      },
      checkRegistration: () => {
        const registered = checkUserRegistration();
        const premium = typeof window !== 'undefined' && localStorage.getItem('user_premium') === 'true';
        set({ isRegistered: registered, isPremium: premium });
      },
      logout: () => {
         if (typeof window !== 'undefined') {
          localStorage.removeItem('user_registered');
          localStorage.removeItem('user_premium');
          // Also clear the persisted state in zustand
          localStorage.removeItem('profile-storage');
        }
        set({ isRegistered: false, isPremium: false, nickname: null, about: null, gender: null, avatar: null });
      },
      setProfile: (data) => {
        const currentState = get();
        const newState = { ...currentState, ...data };
        
        if (typeof window !== 'undefined' && data.isPremium !== undefined) {
          localStorage.setItem('user_premium', String(data.isPremium));
        }
        set(newState);
      }
    }),
    {
      name: 'profile-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ 
        isPremium: state.isPremium,
        nickname: state.nickname,
        about: state.about,
        gender: state.gender,
        avatar: state.avatar,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            // isRegistered is handled separately to avoid hydration issues on first load
            const registered = checkUserRegistration();
            state.isRegistered = registered;
            state.checkRegistration();
        }
      }
    }
  )
);
