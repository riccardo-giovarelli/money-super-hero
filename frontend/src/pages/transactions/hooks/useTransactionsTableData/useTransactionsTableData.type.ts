import { InteractionType } from '@/models/transactions';

export interface TransactionsApiResultsType {
  amount: number;
  category: string;
  category_id: number;
  direction: InteractionType;
  id: number;
  notes: string;
  sub_category: string;
  sub_category_id: number;
  timestamp: string;
}

export interface TransactionTableType {
  amount: number;
  category?: string;
  direction: InteractionType;
  id: number;
  notes: string;
  subcategory?: string;
  timestamp: Date;
}
