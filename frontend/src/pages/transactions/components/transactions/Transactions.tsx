import { useParams } from 'react-router';

import { Box } from '@mui/material';
import TransactionsList from '../transactions-list/TransactionsList';
import TransactionsNew from '../transactions-new/TransactionsNew';
import TransactionsShow from '../transactions-show/TransactionsShow';

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
