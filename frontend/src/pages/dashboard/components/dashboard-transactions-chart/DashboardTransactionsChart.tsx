import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Colors,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { DashboardTransactionLineChartType, DashboardTransactionsChartPropsType } from './DashboardTransactionsChart.type';
import { useDashboardStore } from '../../stores/DashboardStore';
import { useTranslation } from 'react-i18next';
import annotationPlugin from 'chartjs-plugin-annotation';

const DashboardTransactionsChart = ({ transactions, average, whole }: DashboardTransactionsChartPropsType) => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const [transactionsDataset, setTransactionsDataset] = useState<DashboardTransactionLineChartType[]>();

  const { t } = useTranslation();

  // Line chart options
  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        min: whole ? from?.format('YYYY-MM-DD') : undefined,
        max: whole ? to?.format('YYYY-MM-DD') : undefined,
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
  };

  // Chart data
  const data = {
    datasets: [
      {
        label: t('dashboard.transactions_chart.title'),
        data: transactionsDataset,
      },
    ],
  };

  // Transactions data
  useEffect(() => {
    if (transactions && transactions?.length > 0) {
      setTransactionsDataset(
        transactions.map((transaction) => {
          return {
            x: dayjs(transaction.timestamp).format('YYYY-MM-DD'),
            y: transaction.amount,
          };
        })
      );
    }
  }, [transactions]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Colors, annotationPlugin);

  return <Line options={options} data={data} />;
};

export default DashboardTransactionsChart;
