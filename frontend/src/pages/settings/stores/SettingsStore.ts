import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SettingsAction, SettingsState } from './SettingsStore.type';


export const useSettingsStore = create<SettingsState & SettingsAction>()(
  persist(
    (set) => ({
      alertSnackbarMessage: null,
      setAlertSnackbarMessage: (alertSnackbarMessage) => set(() => ({ alertSnackbarMessage })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: () => ({}),
    }
  )
);
