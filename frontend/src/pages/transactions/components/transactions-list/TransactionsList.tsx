import { Box, Button } from '@mui/material';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import useTransactions from '../../hooks/useTransactions/useTransactions.tsx';
import { useState } from 'react';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants.ts';
import { PaginationModelType } from '@/types/pagination.type.ts';
import ConfirmDialog from '@/components/confirm-dialog/ConfirmDialog.tsx';
import { useTransactionsStore } from '../../stores/TransactionsStore.ts';
import { deleteTransactionById } from './TransactionsList.lib.ts';
import AlertSnackbar from '@/components/alert-snackbar/AlertSnackbar.tsx';

const TransactionsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const transactionToDelete = useTransactionsStore((state) => state.transactionToDelete);
  const setTransactionToDelete = useTransactionsStore((state) => state.setTransactionToDelete);
  const setAlertSnackbarMessage = useTransactionsStore((state) => state.setAlertSnackbarMessage);
  const alertSnackbarMessage = useTransactionsStore((state) => state.alertSnackbarMessage);
  const [refreshKey, setRefreshKey] = useState(false);

  const { columns, transactions, isFetching, rowCount } = useTransactions(paginationModel.page + 1, paginationModel.pageSize, sortModel, refreshKey);

  const handleConfirmDialogClose = async (choice: boolean) => {
    if (choice && transactionToDelete) {
      deleteTransactionById(transactionToDelete).then((response) => {
        if (response) {
          setAlertSnackbarMessage({ type: 'success', text: t('transactions.delete_transactions.result.success') });
          setRefreshKey((prev) => !prev);
        } else {
          setAlertSnackbarMessage({ type: 'error', text: t('transactions.delete_transactions.result.error') });
        }
      });
    }
    setTransactionToDelete(null);
  };

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
      <ConfirmDialog
        open={transactionToDelete !== null}
        onClose={handleConfirmDialogClose}
        title={t('app.message.warning')}
        text={t('app.message.deleting_item_warning')}
      />
      <AlertSnackbar
        message={alertSnackbarMessage?.text ? alertSnackbarMessage.text : ''}
        autoHideDuration={5000}
        severity={alertSnackbarMessage?.type}
        open={alertSnackbarMessage !== null}
        onClose={() => setAlertSnackbarMessage(null)}
      />
    </Box>
  );
};

export default TransactionsList;
