import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AuthenticationAction, AuthenticationState } from './AuthenticationStore.type';

export const useAuthenticationStore = create<AuthenticationState & AuthenticationAction>()(
  persist(
    (set) => ({
      firstName: '',
      lastName: '',
      email: '',
      setFirstName: (firstName) => set(() => ({ firstName: firstName })),
      setLastName: (lastName) => set(() => ({ lastName: lastName })),
      setEmail: (email) => set(() => ({ email: email })),
    }),
    {
      name: 'authentication-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
      }),
    }
  )
);
