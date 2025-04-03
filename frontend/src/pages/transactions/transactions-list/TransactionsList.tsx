import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import useTransactions from '../hooks/useTransactions/useTransactions';

const TransactionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const transactions = useTransactions();

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  return (
    <Box component={'div'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          p: 1,
          m: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            navigate('/transactions/new');
          }}
        >
          {t('transactions.add_transaction.new_button.label')}
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionsList;
