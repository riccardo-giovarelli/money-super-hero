import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseCategoriesApiResults, parseSubCategoriesApiResults, parseTransactionsApiResults } from './useTransactionsTableData.lib';

import tank from '@/utils/axios';
import TransactionsTableColumnDirection from '@pages/transactions/components/transactions-table-column-direction/TransactionsTableColumnDirection.tsx';
import TransactionsTableColumnTools from '@pages/transactions/components/transactions-table-column-tools/TransactionsTableColumnTools.tsx';
import { TransactionType } from 'src/models/transactions';
import { TransactionTableType } from './useTransactionsTableData.type';

const useTransactionsTableData = (page: number, pageSize: number, sortModel: GridSortModel = [], refreshKey: boolean) => {
  const { t } = useTranslation();

  /**
   * Columns definition
   */
  const columns: GridColDef<TransactionTableType>[] = [
    {
      field: 'tools',
      headerName: 'Tools',
      width: 90,
      renderCell: (params: GridRenderCellParams) => <TransactionsTableColumnTools {...params} />,
      sortable: false,
      filterable: false,
    },
    {
      field: 'amount',
      headerName: t('transactions.add_transaction.amount.label'),
      type: 'number',
      width: 150,
      filterable: false,
      valueGetter: (value) => Number(value),
    },
    {
      field: 'direction',
      headerName: t('transactions.add_transaction.direction.label'),
      width: 110,
      renderCell: (params: GridRenderCellParams) => <TransactionsTableColumnDirection direction={params?.row?.direction} />,
      filterable: false,
    },
    {
      field: 'category',
      headerName: t('transactions.add_transaction.category.label'),
      type: 'string',
      width: 150,
      filterable: false,
    },
    {
      field: 'subcategory',
      headerName: t('transactions.add_transaction.subcategory.label'),
      type: 'string',
      width: 150,
      filterable: false,
    },
    {
      field: 'timestamp',
      headerName: t('transactions.add_transaction.date.label'),
      type: 'string',
      width: 150,
      filterable: false,
      valueGetter: (value) => (value ? dayjs(value).format('DD/MM/YYYY - HH:mm') : '-'),
    },
    {
      field: 'notes',
      headerName: t('transactions.add_transaction.notes.label'),
      type: 'string',
      width: 150,
      filterable: false,
    },
  ];

  /**
   * Fetch transactions data
   */
  const { data: transactionsData, isFetching: transactionsIsFetching } = useQuery({
    queryKey: [page, pageSize, sortModel, refreshKey],
    queryFn: async () => {
      const parameters: string[] = [];
      parameters.push(`page=${page}`);
      parameters.push(`limit=${pageSize}`);
      if (sortModel.length > 0) {
        parameters.push(`sortColumn=${sortModel[0].field}`);
        parameters.push(`sortDirection=${sortModel[0].sort}`);
      }
      return tank.get(`/transactions?${parameters.join('&')}`).then((results) => {
        if (results?.data?.code === 'GET_TRANSACTIONS_SUCCESS' && results?.data?.details?.results) {
          return {
            transactions: parseTransactionsApiResults(results.data.details.results.transactions),
            count: results.data.details.count,
          };
        }
      });
    },
    placeholderData: { transactions: [], count: 0 },
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
    columns,
    transactions,
    isFetching: transactionsIsFetching || categoriesIsFetching || subcategoriesIsFetching,
    rowCount: transactionsData?.count ?? 0,
  };
};

export default useTransactionsTableData;
