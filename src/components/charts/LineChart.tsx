import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Series {
  name: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  labels: string[];
  series: Series[];
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ labels, series, title }) => {
  const chartData = {
    labels,
    datasets: series.map((s) => ({
      label: s.name,
      data: s.data,
      borderColor: s.color,
      backgroundColor: s.color,
      fill: false,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
