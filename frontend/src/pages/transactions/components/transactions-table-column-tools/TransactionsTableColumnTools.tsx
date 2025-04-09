import { GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const TransactionsTableColumnTools = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Tooltip title={`${t('transactions.list_transactions.edit_button.label')} id ${params.id}`}>
        <IconButton>
          <EditIcon
            onClick={() => {
              navigate(`/transactions/${params.id}`);
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TransactionsTableColumnTools;
