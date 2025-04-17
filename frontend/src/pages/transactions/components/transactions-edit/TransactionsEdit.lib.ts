import { TransactionType } from '@/models/transactions';
import { TransactionApiResultsType } from './TransactionsEdit.type';

export const parseTransactionsApiResults = (result: TransactionApiResultsType): TransactionType => ({
  amount: Number(result.amount),
  category: result.category,
  direction: result.direction,
  id: result.id,
  notes: result.notes,
  subcategory: result.sub_category,
  timestamp: new Date(result.timestamp),
});
