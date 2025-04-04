import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import useTransactions from '../hooks/useTransactions/useTransactions';
import SkeletonMaker from '@/components/skeleton-maker/SkeletonMaker';

const TransactionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { columns, columnsVisibility, transactions, isFetching } = useTransactions(true);

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
      <Box sx={{ height: 400, width: '100%' }}>
        {isFetching && <SkeletonMaker type="table" />}
        {!isFetching && (
          <DataGrid
            rows={transactions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            columnVisibilityModel={columnsVisibility}
          />
        )}
      </Box>
    </Box>
  );
};

export default TransactionsList;
