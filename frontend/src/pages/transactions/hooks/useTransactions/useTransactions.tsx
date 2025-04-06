import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseCategoriesApiResults, parseSubCategoriesApiResults, parseTransactionsApiResults } from './useTransactions.lib';

import { TransactionType } from 'src/models/transactions';
import TransactionsDirectionTableCell from '../../components/transactions-direction-table-cell/TransactionsDirectionTableCell';
import { TransactionTableType } from './useTransactions.type';
import tank from '@/utils/axios';

const useTransactions = (enabled: boolean = false) => {
  const { t } = useTranslation();

  /**
   * Columns visibility
   */
  const columnsVisibility = {
    id: false,
  };

  /**
   * Columns definition
   */
  const columns: GridColDef<TransactionTableType>[] = [
    { field: 'id', headerName: 'ID', width: 90, type: 'number' },
    {
      field: 'amount',
      headerName: t('transactions.add_transaction.amount.label'),
      type: 'number',
      width: 150,
    },
    {
      field: 'direction',
      headerName: t('transactions.add_transaction.direction.label'),
      type: 'string',
      width: 110,
      renderCell: (params: GridRenderCellParams) => <TransactionsDirectionTableCell {...params} />,
    },
    {
      field: 'category',
      headerName: t('transactions.add_transaction.category.label'),
      type: 'string',
      width: 150,
    },
    {
      field: 'subCategory',
      headerName: t('transactions.add_transaction.subcategory.label'),
      type: 'string',
      width: 150,
    },
    {
      field: 'timestamp',
      headerName: t('transactions.add_transaction.date.label'),
      type: 'string',
      width: 150,
    },
    {
      field: 'notes',
      headerName: t('transactions.add_transaction.notes.label'),
      type: 'string',
      width: 150,
    },
  ];

  /**
   * Fetch transactions data
   */
  const { data: transactionsData, isFetching: transactionsIsFetching } = useQuery({
    queryKey: ['transactionsData'],
    queryFn: async () =>
      tank.get(`/transactions`).then((results) => {
        if (results?.data?.code === 'GET_TRANSACTIONS_SUCCESS' && results?.data?.details?.results) {
          return parseTransactionsApiResults(results.data.details.results);
        }
      }),
    enabled: enabled,
    placeholderData: [],
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
    enabled: enabled,
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
    enabled: enabled,
    placeholderData: [],
  });

  /**
   * Merge transactions with categories and subcategories
   */
  const transactions = useMemo(
    () =>
      transactionsData && categoriesData && subcategoriesData
        ? transactionsData.map((transaction: TransactionType) => ({
            ...transaction,
            category: categoriesData.find((category) => category.id === transaction.category)?.name,
            subCategory: subcategoriesData.find((subcategory) => subcategory.id === transaction.subCategory)?.name,
          }))
        : [],
    [transactionsData, categoriesData, subcategoriesData]
  );

  return {
    columns,
    columnsVisibility,
    transactions,
    isFetching: transactionsIsFetching || categoriesIsFetching || subcategoriesIsFetching,
  };
};

export default useTransactions;
