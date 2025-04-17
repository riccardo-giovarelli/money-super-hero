import ForwardIcon from '@mui/icons-material/Forward';
import { Box } from '@mui/material';
import { TransactionsTableColumnDirectionPropsType } from './TransactionsTableColumnDirection.type';

const TransactionsTableColumnDirection = ({ direction }: TransactionsTableColumnDirectionPropsType) =>
  direction && (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {direction === 'IN' ? (
        <ForwardIcon color="success" fontSize="large" sx={{ transform: 'rotate(-90deg)' }} />
      ) : (
        <ForwardIcon color="error" fontSize="large" sx={{ transform: 'rotate(90deg)' }} />
      )}
    </Box>
  );

export default TransactionsTableColumnDirection;
