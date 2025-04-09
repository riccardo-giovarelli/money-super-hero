import { GridRenderCellParams } from '@mui/x-data-grid';
import ForwardIcon from '@mui/icons-material/Forward';
import { Box } from '@mui/material';

const TransactionsTableColumnDirection = (params: GridRenderCellParams) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {params?.row?.direction === 'IN' ? (
        <ForwardIcon color="success" fontSize="large" sx={{ transform: 'rotate(-90deg)' }} />
      ) : (
        <ForwardIcon color="error" fontSize="large" sx={{ transform: 'rotate(90deg)' }} />
      )}
    </Box>
  );
};

export default TransactionsTableColumnDirection;
