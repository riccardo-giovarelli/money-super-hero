import { Box, Paper, Typography } from '@mui/material';
import { TransactionsValuesPropsType } from './TransactionsValues.type';
import { useMemo } from 'react';
import TransactionsTableColumnDirection from '../transactions-table-column-direction/TransactionsTableColumnDirection';

const TransactionsValues = ({ type, label, value }: TransactionsValuesPropsType) => {
  const renderData = useMemo(() => {
    if (!label || !value) {
      return null;
    }

    switch (type) {
      case 'text':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 2, height: '100%' }}>
            <Typography variant="body1" component="div" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {label}:
            </Typography>
            <Typography variant="body1" component="div" sx={{ fontSize: '1.2rem' }}>
              {value}
            </Typography>
          </Box>
        );
      case 'textArea':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center', rowGap: 1, height: '100%' }}>
            <Typography variant="body1" component="div" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {label}:
            </Typography>
            <Typography variant="body1" component="div" sx={{ fontSize: '1.2rem', fontStyle: 'italic' }}>
              {value}
            </Typography>
          </Box>
        );
      case 'direction':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 2, height: '100%' }}>
            <Typography variant="body1" component="div" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {label}:
            </Typography>
            <Box
              sx={{
                paddingX: 0.8,
                paddingY: 0.4,
              }}
            >
              <TransactionsTableColumnDirection direction={value} />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  }, [type, label, value]);

  return (
    <Paper elevation={2} style={{ padding: 15, height: '100%', minHeight: 60 }}>
      {renderData}
    </Paper>
  );
};

export default TransactionsValues;
