import { InteractionType } from '@/models/transactions';

export interface TransactionApiResultsType {
  amount: string;
  category: number;
  direction: InteractionType;
  id: number;
  notes: string;
  sub_category: number;
  timestamp: string;
}
