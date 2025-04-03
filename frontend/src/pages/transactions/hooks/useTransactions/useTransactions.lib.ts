import { TransactionType } from '@/models/transactions';
import { TransactionApiResultsType } from './useTransactions.type';

/**
 * @function parseTransactionsApiResults
 *
 * @description Parses the API results for transactions and converts them into a format suitable for the frontend.
 *
 * @param {TransactionApiResultsType[]} results - The array of transaction objects returned by the API.
 *
 * @returns {TransactionType[]} - An array of transactions formatted for use in the frontend.
 */
export const parseTransactionsApiResults = (
  results: TransactionApiResultsType[]
): TransactionType[] =>
  results.map((result: TransactionApiResultsType) => ({
    amount: Number(result.amount),
    category: result.category,
    direction: result.direction,
    id: result.id,
    notes: result.notes,
    subCategory: result.sub_category,
    timestamp: new Date(result.timestamp),
  }));
