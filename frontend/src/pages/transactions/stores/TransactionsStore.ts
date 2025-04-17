import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TransactionsAction, TransactionsState } from './TransactionsStore.type';

export const useTransactionsStore = create<TransactionsState & TransactionsAction>()(
  persist(
    (set) => ({
      alertSnackbarMessage: null,
      setAlertSnackbarMessage: (alertSnackbarMessage) => set(() => ({ alertSnackbarMessage })),
      transactionToDelete: null,
      setTransactionToDelete: (transactionToDelete) => set(() => ({ transactionToDelete })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: () => ({}),
    }
  )
);
