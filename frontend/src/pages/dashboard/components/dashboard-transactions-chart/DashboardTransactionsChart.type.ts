import { InteractionType } from '@/models/transactions';

export interface DashboardTransactionsChartPropsType {
  transactions: DashboardTransactionType[];
  whole: boolean;
}

export interface DashboardTransactionLineChartType {
  x: string;
  y: number;
}

export interface DashboardTransactionType {
  category: string | undefined;
  subcategory: string | undefined;
  amount: number;
  direction: InteractionType;
  id: number;
  notes: string;
  timestamp: Date;
}
