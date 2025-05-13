import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DashboardAction, DashboardState } from './DashboardStore.type';
import { dashboardStoreDefault } from './DashboardStore.lib';

export const useDashboardStore = create<DashboardState & DashboardAction>()(
  persist(
    (set) => ({
      from: dashboardStoreDefault.from,
      to: dashboardStoreDefault.to,
      setFrom: (from) => set(() => ({ from })),
      setTo: (to) => set(() => ({ to })),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        from: state.from,
        to: state.to,
      }),
    }
  )
);
