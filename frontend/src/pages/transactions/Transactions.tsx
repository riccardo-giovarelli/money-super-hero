import { useParams } from 'react-router';

import { Box } from '@mui/material';
import TransactionsList from './components/transactions-list/TransactionsList';
import TransactionsNew from './components/transactions-new/TransactionsNew';
import TransactionsEdit from './components/transactions-edit/TransactionsEdit';
import { isValidNumber } from '@/utils/string';
import { useEffect, useState } from 'react';

const Transactions = () => {
  const params = useParams();
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    if (!params.trsId) {
      setComponent(<TransactionsList />);
    } else if (params.trsId === 'new') {
      setComponent(<TransactionsNew />);
    } else if (isValidNumber(params.trsId)) {
      setComponent(<TransactionsEdit />);
    } else {
      setComponent(<TransactionsList />);
    }
  }, [params.trsId]);

  return <Box sx={{ marginTop: 4 }}>{component}</Box>;
};

export default Transactions;
