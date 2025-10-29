import Chart from '@/components/admin/Chart';
import MonthChart from '@/components/admin/MonthChart';
import MonthCart from '@/components/admin/MonthChart';

function AdminMatchingPage() {
  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
      <h2 className="text-[23px] font-bold text-gray-800 mb-2">매칭 및 모임 관리</h2>
      <p className="text-[13px] text-gray-500 mb-6">사용자 매칭 현황과 모임을 관리합니다.</p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col flex-1 gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
            <h3 className="font-bold">매칭 성공률</h3>
            <Chart />
          </div>
          <div className="flex flex-col flex-1 gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
            <h3 className="font-bold">월별 매칭 현황</h3>
            <MonthChart />
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
          <h3 className="font-bold">진행중인 모임</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchingPage;
