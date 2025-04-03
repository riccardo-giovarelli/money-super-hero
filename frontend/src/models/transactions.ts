export interface TransactionType {
  amount: number;
  category: number;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  subCategory: number;
  timestamp: Date;
}
