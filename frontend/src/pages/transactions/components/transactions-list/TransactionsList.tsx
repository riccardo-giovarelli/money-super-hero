import { Box, Button } from '@mui/material';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import useTransactions from '../../hooks/useTransactions/useTransactions.tsx';
import { useState } from 'react';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants.ts';
import { PaginationModelType } from '@/types/pagination.type.ts';

const TransactionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const { columns, transactions, isFetching, rowCount } = useTransactions(paginationModel.page + 1, paginationModel.pageSize, sortModel);

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
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50]}
          loading={isFetching}
          disableRowSelectionOnClick
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          sortModel={sortModel}
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={setSortModel}
          rowCount={Number(rowCount)}
        />
      </Box>
    </Box>
  );
};

export default TransactionsList;
