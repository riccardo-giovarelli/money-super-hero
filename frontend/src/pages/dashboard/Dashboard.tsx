import useTransactions from '@/hooks/useTransactions/useTransactions';
import { Button, Checkbox, Container, FormControl, FormControlLabel, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardTransactionsChart from './components/dashboard-transactions-chart/DashboardTransactionsChart';
import { useDashboardStore } from './stores/DashboardStore';
import dayjs from 'dayjs';
import { dashboardStoreDefault } from './stores/DashboardStore.lib';

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

  /**
   * @function handleWholeChange
   *
   * @description Handles the change event for the "Whole Period" checkbox. Updates the `whole` state
   * to reflect whether the user wants to view data for the entire period or a specific date range.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by the checkbox.
   * @returns {void}
   */
  const handleWholeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWhole(event.target.checked);
  };

  /**
   * @function handleResetButtonClick
   *
   * @description Resets the date range filters to their default values. Updates the `from` and `to` states
   * in the dashboard store to reflect the default date range.
   *
   * @returns {void}
   */
  const handleResetButtonClick = (): void => {
    setFrom(dashboardStoreDefault.from);
    setTo(dashboardStoreDefault.to);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={1}>
          <Grid
            size={12}
            container
            direction="column"
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <Grid
              container
              direction="row"
              spacing={2}
              size={{ xs: 12, sm: 8, md: 6 }}
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <DatePicker label={t('dashboard.filter.from')} value={dayjs(from)} onChange={(newValue) => setFrom(newValue)} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <DatePicker label={t('dashboard.filter.to')} value={dayjs(to)} onChange={(newValue) => setTo(newValue)} />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            <Grid
              container
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <FormControlLabel control={<Checkbox checked={whole} onChange={handleWholeChange} />} label={t('dashboard.filter.whole_period')} />
              <Button variant="text" onClick={handleResetButtonClick}>
                {t('dashboard.filter.reset')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <DashboardTransactionsChart transactions={transactions} average={average} whole={whole} />
      </LocalizationProvider>
    </Container>
  );
};

export default Dashboard;
