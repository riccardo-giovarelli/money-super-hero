import { Box, Container, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDashboardStore } from './stores/DashboardStore';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const setFrom = useDashboardStore((state) => state.setFrom);
  const setTo = useDashboardStore((state) => state.setTo);

  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 2,
          p: 1,
          m: 1,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label={t('dashboard.filter.from')} value={from} onChange={(newValue) => setFrom(newValue)} />
          <DatePicker label={t('dashboard.filter.to')} value={to} onChange={(newValue) => setTo(newValue)} />
        </LocalizationProvider>
      </Box>
      <Grid container spacing={2}>
        <Grid size={12}></Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
