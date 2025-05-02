import useTransactions from '@/hooks/useTransactions/useTransactions';
import { Box, Checkbox, Container, FormControlLabel, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardTransactionsChart from './components/dashboard-transactions-chart/DashboardTransactionsChart';
import { useDashboardStore } from './stores/DashboardStore';
import dayjs from 'dayjs';

const Dashboard = () => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const setFrom = useDashboardStore((state) => state.setFrom);
  const setTo = useDashboardStore((state) => state.setTo);
  const [whole, setWhole] = useState(true);

  const { t } = useTranslation();
  const { transactions, average } = useTransactions({
    from: dayjs(from).format('YYYY-MM-DD'),
    to: dayjs(to).format('YYYY-MM-DD'),
    sortModel: [{ field: 'timestamp', sort: 'desc' }],
  });

  const handleWholeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWhole(event.target.checked);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'end',
          gap: 2,
          p: 1,
          m: 1,
        }}
      >
        <FormControlLabel control={<Checkbox checked={whole} onChange={handleWholeChange} />} label={t('dashboard.filter.whole_period')} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label={t('dashboard.filter.from')} value={dayjs(from)} onChange={(newValue) => setFrom(newValue)} />
          <DatePicker label={t('dashboard.filter.to')} value={dayjs(to)} onChange={(newValue) => setTo(newValue)} />
        </LocalizationProvider>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid size={12}>
          <DashboardTransactionsChart transactions={transactions} average={average} whole={whole} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
