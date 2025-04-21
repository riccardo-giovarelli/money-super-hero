import useTransactions from '@/hooks/useTransactions/useTransactions';
import { Box, Container, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from './stores/DashboardStore';
import { DashboardTransactionLineChartType } from './Dashboard.type';

const Dashboard = () => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const setFrom = useDashboardStore((state) => state.setFrom);
  const setTo = useDashboardStore((state) => state.setTo);
  const [dataset, setDataset] = useState<DashboardTransactionLineChartType[]>();

  const { t } = useTranslation();
  const { transactions } = useTransactions({ from: from?.format('YYYY-MM-DD'), to: to?.format('YYYY-MM-DD') });

  useEffect(() => {
    if (transactions && transactions?.length > 0) {
      setDataset(
        transactions.map((transaction) => {
          return {
            x: dayjs(transaction.timestamp).format('YYYY-MM-DD'),
            y: transaction.amount,
          };
        })
      );
    }
  }, [transactions]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: 'Dataset 1',
        data: dataset,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
          <Line options={options} data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
