export interface TransactionApiResultsType {
  amount: string;
  category: number;
  direction: 'IN' | 'OUT';
  id: number;
  notes: string;
  sub_category: number;
  timestamp: string;
}
