export interface TransactionsGetPayload {
  page?: number;
  limit?: number;
  sortColumn?: string;
  sortDirection?: string;
  from?: string;
  to?: string;
}

export interface GetTransactionsResults {
  [key: string]: string | number | Date;
}
