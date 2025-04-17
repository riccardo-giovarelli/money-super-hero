import { MessageType } from '@/types/generic.type';

export interface TransactionsState {
  alertSnackbarMessage: MessageType | null;
  transactionToDelete: number | null;
}

export interface TransactionsAction {
  setAlertSnackbarMessage: (alertSnackbarMessage: { type: MessageType['type']; text: MessageType['text'] } | null) => void;
  setTransactionToDelete: (transactionToDelete: number | null) => void;
}
