import tank from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { parseTransactionsApiResults } from './useTransactions.lib';

const useTransactions = (enabled: boolean = false) => {
  const { isPending, error, data, isFetching } = useQuery({
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

  return [isPending, error, data, isFetching];
};

export default useTransactions;
