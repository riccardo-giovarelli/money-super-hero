import { CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { DashboardTransactionLineChartType, DashboardTransactionsChartPropsType } from './DashboardTransactionsChart.type';
import { useDashboardStore } from '../../stores/DashboardStore';
import { useTranslation } from 'react-i18next';

const DashboardTransactionsChart = ({ transactions, whole }: DashboardTransactionsChartPropsType) => {
  const from = useDashboardStore((state) => state.from);
  const to = useDashboardStore((state) => state.to);
  const [dataset, setDataset] = useState<DashboardTransactionLineChartType[]>();

  const { t } = useTranslation();

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
  };

  const data = {
    datasets: [
      {
        label: t('dashboard.transactions_chart.title'),
        data: dataset,
        borderColor: 'rgb(255, 16, 68)',
        backgroundColor: 'rgba(255, 47, 92, 0.5)',
      },
    ],
  };

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

  return <Line options={options} data={data} />;
};

export default DashboardTransactionsChart;
