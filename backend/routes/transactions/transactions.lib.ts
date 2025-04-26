import type { GetTransactionsResults } from "./transactions.type.ts";

/**
 * @function getAverageValue
 *
 * @description Calculates the average value of the `amount` field from an array of transaction results.
 *
 * @param {GetTransactionsResults[]} results - An array of transaction objects, each containing an `amount` field.
 * @returns {number} - The average value of the `amount` field across all transactions in the array.
 */
export const getAverageValue = (results: GetTransactionsResults[]) =>
  results.reduce(
    (avg: number, value: GetTransactionsResults, _, { length }) =>
      avg + (value.amount as number) / length,
    0
  );
