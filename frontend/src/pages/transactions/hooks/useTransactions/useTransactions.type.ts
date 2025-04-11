export interface TransactionsApiResultsType {
  amount: number;
  category: string;
  category_id: number;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  sub_category: string;
  sub_category_id: number;
  timestamp: string;
}

export interface TransactionTableType {
  amount: number;
  category?: string;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  sub_category?: string;
  timestamp: Date;
}
