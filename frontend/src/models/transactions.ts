export interface TransactionType {
  amount: number;
  category: number;
  direction: InteractionType;
  id: number;
  notes: string;
  subcategory: number;
  timestamp: Date;
}

export type InteractionType = 'IN' | 'OUT';
