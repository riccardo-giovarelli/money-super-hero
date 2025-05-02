import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { parseCategoriesApiResults, parseSubCategoriesApiResults, parseTransactionsApiResults } from './useTransactions.lib';

import tank from '@/utils/axios';
import { TransactionType } from 'src/models/transactions';
import { UseTransactionsPropsType } from './useTransactions.type';

const useTransactions = ({ page, pageSize, from, to, sortModel }: UseTransactionsPropsType) => {
  /**
   * Fetch transactions data
   */
  const { data: transactionsData, isFetching: transactionsIsFetching } = useQuery({
    queryKey: [page, pageSize, sortModel, from, to],
    queryFn: async () => {
      const parameters: string[] = [];

      // Date range
      if (from && to) {
        parameters.push(`from=${from}`);
        parameters.push(`to=${to}`);
      }
      // Pagination
      if (page && pageSize) {
        parameters.push(`page=${page}`);
        parameters.push(`limit=${pageSize}`);
      }
      // Sorting
      if (sortModel && sortModel.length > 0) {
        parameters.push(`sortColumn=${sortModel[0].field}`);
        parameters.push(`sortDirection=${sortModel[0].sort}`);
      }

      return tank.get(`/transactions?${parameters.join('&')}`).then((results) => {
        if (results?.data?.code === 'GET_TRANSACTIONS_SUCCESS' && results?.data?.details?.results) {
          return {
            transactions: parseTransactionsApiResults(results.data.details.results.transactions),
            average: results.data.details.results.average,
            count: results.data.details.count,
          };
        }
      });
    },
    placeholderData: { transactions: [], average: 0, count: 0 },
  });

  /**
   * Fetch categories data
   */
  const { data: categoriesData, isFetching: categoriesIsFetching } = useQuery({
    queryKey: ['categoriesData'],
    queryFn: async () =>
      tank.get(`/categories`).then((results) => {
        if (results?.data?.code === 'GET_CATEGORIES_SUCCESS' && results?.data?.details?.results) {
          return parseCategoriesApiResults(results.data.details.results);
        }
      }),
    enabled: (transactionsData?.transactions?.length ?? 0) > 0,
    placeholderData: [],
  });

  /**
   * Fetch subcategories data
   */
  const { data: subcategoriesData, isFetching: subcategoriesIsFetching } = useQuery({
    queryKey: ['subcategoriesData'],
    queryFn: async () =>
      tank.get(`/subcategories`).then((results) => {
        if (results?.data?.code === 'GET_SUB_CATEGORIES_SUCCESS' && results?.data?.details?.results) {
          return parseSubCategoriesApiResults(results.data.details.results);
        }
      }),
    enabled: (transactionsData?.transactions?.length ?? 0) > 0,
    placeholderData: [],
  });

  /**
   * Merge transactions with categories and subcategories
   */
  const transactions = useMemo(
    () =>
      transactionsData && categoriesData && subcategoriesData
        ? transactionsData.transactions.map((transaction: TransactionType) => ({
            ...transaction,
            category: categoriesData.find((category) => category.id === transaction.category)?.name,
            subcategory: subcategoriesData.find((subcategory) => subcategory.id === transaction.subcategory)?.name,
          }))
        : [],
    [transactionsData, categoriesData, subcategoriesData]
  );

  return {
    transactions,
    isFetching: transactionsIsFetching || categoriesIsFetching || subcategoriesIsFetching,
    rowCount: transactionsData?.count ?? 0,
    average: transactionsData?.average ?? 0,
  };
};

export default useTransactions;
