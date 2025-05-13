import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../../stores/DashboardStore';
import { DashboardTransactionsChartPropsType } from './DashboardTransactionsChart.type';
import { Stack } from '@mui/material';

const DashboardTransactionsChart = ({ transactions, average, whole }: DashboardTransactionsChartPropsType) => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const { t } = useTranslation();

  // Line chart options
  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
          min: whole ? dayjs(from)?.format('YYYY-MM-DD') : undefined,
          max: whole ? dayjs(to)?.format('YYYY-MM-DD') : undefined,
        },
      },
      plugins: {
        title: {
          display: true,
          text: t('dashboard.transactions_chart.transactions'),
          font: {
            size: 20,
          },
        },
        legend: {
          display: false,
        },
        annotation: {
          annotations: {
            horizontalLine: {
              type: 'line',
              yMin: average,
              yMax: average,
              borderColor: 'rgba(255, 51, 0)',
              borderWidth: 2,
              label: {
                content: t('dashboard.transactions_chart.average'),
                position: 'start',
                display: true,
                backgroundColor: 'rgba(204, 0, 0)',
                color: 'white',
              },
            },
          },
        },
      },
    }),
    [from, to]
  );

  // Line chart data
  const data = useMemo(
    () =>
      transactions && transactions?.length > 0
        ? {
            datasets: [
              {
                label: t('dashboard.transactions_chart.title'),
                data: transactions.map((transaction) => {
                  return {
                    x: dayjs(transaction.timestamp).format('YYYY-MM-DD'),
                    y: transaction.amount,
                  };
                }),
              },
            ],
          }
        : null,
    [transactions]
  );

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Colors, annotationPlugin);

  return data ? (
    <Line options={options} data={data} />
  ) : (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
      }}
    >
      No data
    </Stack>
  );
};

export default DashboardTransactionsChart;
