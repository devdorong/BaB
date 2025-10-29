import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { fetchMonthlyMatchings } from '@/lib/matchingchart';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

export default function MonthChart() {
  const [chartData, setChartData] = useState<{ labels: string[]; counts: number[] }>({
    labels: [],
    counts: [],
  });
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const loadMonthly = async () => {
      const data = await fetchMonthlyMatchings();
      setChartData(data);
    };
    loadMonthly();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: '월별 매칭 수',
        data: chartData.counts,
        fill: true,
        borderColor: '#ff9100',
        backgroundColor: () => {
          const chart = chartRef.current;
          if (!chart) return 'rgba(250, 183, 96, 0.3)';
          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(255, 87, 34, 300);
          gradient.addColorStop(0, 'rgba(250, 183, 96, 0.3)');
          gradient.addColorStop(1, 'rgba(96,165,250,0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
      y: { beginAtZero: true, ticks: { color: '#a9af9c' }, grid: { color: '#E5E7EB' } },
    },
  };

  return (
    <div className="relative h-full w-full mx-auto bg-white rounded-2xl shadow p-6">
      <Line ref={chartRef} data={data} options={options} className="w-full" />
    </div>
  );
}
