import { useParams } from 'react-router';

import { Box } from '@mui/material';
import TransactionsList from '../transactions-list/TransactionsList';
import TransactionsNew from '../transactions-new/TransactionsNew';
import TransactionsEdit from '../transactions-edit/TransactionsEdit';
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

  return <Box sx={{ marginTop: 3 }}>{component}</Box>;
};

export default Transactions;
