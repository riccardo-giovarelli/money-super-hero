import { Box, Container, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDashboardStore } from './stores/DashboardStore';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const setFrom = useDashboardStore((state) => state.setFrom);
  const setTo = useDashboardStore((state) => state.setTo);

  const { t } = useTranslation();

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [400, 450, 300, 500, 600, 700, 800],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [200, 300, 400, 500, 600, 700, 800],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

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
        <Grid size={12}>
          <Line options={options} data={data} />;
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
