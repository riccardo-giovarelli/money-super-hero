import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AppAction, AppState } from './AppStore.type';


export const useAppStore = create<AppState & AppAction>()(
  persist(
    (set) => ({
      appDrawerOpen: false,
      setAppDrawerOpen: (appDrawerOpen) => set(() => ({ appDrawerOpen: appDrawerOpen })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: () => ({}),
    }
  )
);
