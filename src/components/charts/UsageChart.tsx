import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Series {
  label: string;
  data: number[];
  color: string;
}

interface UsageChartProps {
  labels: string[];
  series: Series[];
  title: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ labels, series, title }) => {
  const data = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.data,
      backgroundColor: s.color,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title, font: { size: 16 } },
    },
  };

  return <Bar data={data} options={options} />;
};

export default UsageChart;
