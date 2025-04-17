import { InteractionType } from '@/models/transactions';

export type TransactionsValuesPropsType =
  | {
      type: 'text' | 'textArea';
      label?: string;
      value?: string | number;
    }
  | {
      type: 'direction';
      label?: string;
      value?: InteractionType;
    };
