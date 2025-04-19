import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DashboardAction, DashboardState } from './DashboardStore.type';
import dayjs from 'dayjs';

export const useDashboardStore = create<DashboardState & DashboardAction>()(
  persist(
    (set) => ({
      from: dayjs().startOf('month'),
      to: dayjs().endOf('month'),
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
