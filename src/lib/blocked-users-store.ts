
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from './types';

interface BlockedUsersState {
  blockedUsers: User[];
  blockUser: (user: User) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
}

export const useBlockedUsersStore = create<BlockedUsersState>()(
  persist(
    (set, get) => ({
      blockedUsers: [],
      
      blockUser: (user) => {
        if (get().blockedUsers.some(u => u.id === user.id)) return;
        set((state) => ({
          blockedUsers: [...state.blockedUsers, user],
        }));
      },
      
      unblockUser: (userId) => {
        set((state) => ({
          blockedUsers: state.blockedUsers.filter((user) => user.id !== userId),
        }));
      },

      isUserBlocked: (userId: string) => {
        return get().blockedUsers.some(u => u.id === userId);
      }
    }),
    {
      name: 'meetcloud-blocked-users-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
