import { useParams } from 'react-router';

import { Box } from '@mui/material';
import TransactionsList from '../transactions-list/TransactionsList';
import TransactionsNew from '../transactions-new/TransactionsNew';
import TransactionsEdit from '../transactions-edit/TransactionsEdit';
import { isValidNumber } from '@/utils/string';

const Transactions = () => {
  const params = useParams();

  return (
    <Box sx={{ marginTop: 3 }}>
      {!params.trsId && <TransactionsList />}
      {params.trsId === 'new' && <TransactionsNew />}
      {params.trsId && !isValidNumber(params.trsId) && <TransactionsList />}
      {params.trsId && isValidNumber(params.trsId) && <TransactionsEdit />}
    </Box>
  );
};

export default Transactions;
