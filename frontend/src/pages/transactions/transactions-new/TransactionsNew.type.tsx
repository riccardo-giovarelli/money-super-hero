export type TransactionsFordFieldType =
  | 'amount'
  | 'direction'
  | 'category'
  | 'subcategory'
  | 'notes';

export interface TransactionsFormDataType {
  amount: string;
  direction: string;
  category: string;
  subcategory: string;
  notes: string;
}

export const transactionsFormDefaultData = {
  amount: '',
  direction: '',
  category: '',
  subcategory: '',
  notes: '',
};
