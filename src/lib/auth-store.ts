import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole } from '@shared/types';
interface AuthState {
  currentUser: User | null;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      role: null,
      login: (user) => set({ currentUser: user, role: user.role }),
      logout: () => set({ currentUser: null, role: null }),
    }),
    {
      name: 'plumbit-auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);