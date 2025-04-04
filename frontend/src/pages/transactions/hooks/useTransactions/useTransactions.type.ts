export interface TransactionApiResultsType {
  amount: string;
  category: number;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  sub_category: number;
  timestamp: string;
}

export interface TransactionTableType {
  amount: number;
  category?: string;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  subCategory?: string;
  timestamp: Date;
}
