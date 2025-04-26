import { TransactionType } from '@/models/transactions';
import { TransactionsApiResultsType } from './useTransactionsTableData.type';
import { SubategoryType } from '@/models/sub-categories';
import { CategoryType } from '@/models/categories';

/**
 * @function parseTransactionsApiResults
 *
 * @description Parses the API results for transactions and converts them into a format suitable for the transaction context.
 *
 * @param {TransactionsApiResultsType[]} results - The array of transaction objects returned by the API.
 *
 * @returns {TransactionType[]} - An array of transactions formatted for use in the frontend.
 */
export const parseTransactionsApiResults = (results: TransactionsApiResultsType[]): TransactionType[] =>
  results.map((result: TransactionsApiResultsType) => ({
    amount: result.amount,
    category: result.category_id,
    direction: result.direction,
    id: result.id,
    notes: result.notes,
    subcategory: result.sub_category_id,
    timestamp: new Date(result.timestamp),
  }));

/**
 * @function parseCategoriesApiResults
 *
 * @description Parses the API results for categories and converts them into a format suitable for the transaction context.
 *
 * @param {CategoryType[]} results - The array of category objects returned by the API.
 *
 * @returns {CategoryType[]} - An array of categories formatted for use in the frontend.
 */
export const parseCategoriesApiResults = (results: CategoryType[]): CategoryType[] =>
  results.map((result: CategoryType) => ({
    id: result.id,
    name: result.name,
  }));

/**
 * @function parseSubCategoriesApiResults
 *
 * @description Parses the API results for subcategories and converts them into a format suitable for the transaction context.
 *
 * @param {SubategoryType[]} results - The array of subcategory objects returned by the API.
 *
 * @returns {SubategoryType[]} - An array of subcategories formatted for use in the frontend.
 */
export const parseSubCategoriesApiResults = (results: SubategoryType[]): SubategoryType[] =>
  results.map((result: SubategoryType) => ({
    id: result.id,
    name: result.name,
  }));
