// stores/useAuthStore.ts
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  // Add more fields as needed
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
