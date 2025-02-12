import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { userDataInitialState } from './AuthenticationStore.lib';
import { AuthenticationAction, AuthenticationState } from './AuthenticationStore.type';


export const useAuthenticationStore = create<AuthenticationState & AuthenticationAction>()(
  persist(
    (set) => ({
      userData: userDataInitialState,
      setUserData: (newUserData) => set((state) => ({ userData: { ...state.userData, ...newUserData } })),
      setLogout: () => set({ userData: userDataInitialState }),
    }),
    {
      name: 'authentication-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
);
