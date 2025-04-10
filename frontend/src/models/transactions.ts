export interface TransactionType {
  amount: number;
  category: number;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  sub_category: number;
  timestamp: Date;
}
