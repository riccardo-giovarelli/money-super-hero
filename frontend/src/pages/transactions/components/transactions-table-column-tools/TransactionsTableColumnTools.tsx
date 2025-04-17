import { GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTransactionsStore } from '../../stores/TransactionsStore';

const TransactionsTableColumnTools = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setTransactionToDelete = useTransactionsStore((state) => state.setTransactionToDelete);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Tooltip title={t('transactions.list_transactions.edit_button.label')}>
        <IconButton
          onClick={() => {
            navigate(`/transactions/${params.id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('transactions.list_transactions.delete_button.label')}>
        <IconButton
          onClick={() => {
            setTransactionToDelete(Number(params.id));
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TransactionsTableColumnTools;
