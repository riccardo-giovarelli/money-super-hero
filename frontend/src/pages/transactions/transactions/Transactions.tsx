import { useParams } from 'react-router';

import { Box } from '@mui/material';

import TransactionsList from '../transactions-list/TransactionsList.tsx';
import TransactionsNew from '../transactions-new/TransactionsNew.tsx';
import TransactionsShow from '../transactions-show/TransactionsShow.tsx';

const Transactions = () => {
  const params = useParams();
  return (
    <Box sx={{ marginTop: 3 }}>
      {!params.trsId && <TransactionsList />}
      {params.trsId === 'new' && <TransactionsNew />}
      {params.trsId && /^\d+$/.test(params.trsId) && <TransactionsShow />}
    </Box>
  );
};

export default Transactions;
