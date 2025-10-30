import { fetchMatchingStatus } from '@/lib/matchingchart';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusDataProps {
  cancel: number;
  waiting: number;
  completed: number;
}

function Chart() {
  const [status, setStatus] = useState<StatusDataProps>({ cancel: 0, completed: 0, waiting: 0 });

  useEffect(() => {
    const loadChartData = async () => {
      const { counts } = await fetchMatchingStatus();
      // console.log('매칭 상태 통계:', counts);
      setStatus(counts);
    };
    loadChartData();
  }, []);

  const data = {
    labels: ['취소된 매칭', '완료된 매칭', '진행 중 매칭'],
    datasets: [
      {
        label: '매칭 상태 비율',
        data: [status.cancel, status.completed, status.waiting],
        backgroundColor: ['#F87171', '#60A5FA', '#FACC15'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '45%',
  };

  return (
    <div className="relative flex w-full h-full justify-center items-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default Chart;
