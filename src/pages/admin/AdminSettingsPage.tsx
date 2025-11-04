import { supabase } from '@/lib/supabase';
import type { Help } from '@/types/bobType';
import AdminSupportDetailModal from '@/ui/sdj/AdminSupportDetailModal';
import { useEffect, useState } from 'react';
import { RiCheckboxCircleLine } from 'react-icons/ri';

export type AdminReportsPageProps = Help & {
  profiles?: { id: string; nickname: string } | null;
};

function AdminReportsPage() {
  const [helpList, setHelpList] = useState<AdminReportsPageProps[]>([]);
  const [helpDetail, setHelpDetail] = useState<AdminReportsPageProps | null>(null);
  const [helpModal, setHelpModal] = useState(false);

  const handleHelpModal = (help: AdminReportsPageProps) => {
    setHelpDetail(help);
    setHelpModal(true);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('helps')
      .select(`*,profiles(id,nickname)`)
      .order('created_at', { ascending: false });

    if (error) return console.log(`문의내역 불러오기 실패 : ${error.message}`);
    if (data) {
      return setHelpList(data || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, [helpList, helpDetail]);

  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
      <h2 className="text-[23px] font-bold text-gray-800 mb-2">문의 내역</h2>
      <p className="text-[13px] text-babgray-500 mb-6">1:1 문의 내역을 관리합니다.</p>

      {/* 검색 및 필터 */}
      <div className="flex flex-col w-full gap-6 items-start justify-start mb-6 bg-white p-[25px] rounded-[16px] shadow">
        <h3 className="font-bold">1:1 문의 리스트</h3>
        {/* 리스트 */}
        {helpList.map((help, idx) => (
          <div
            key={idx}
            onClick={() => handleHelpModal(help)}
            className="flex flex-col gap-1 p-6 border cursor-pointer w-full rounded-2xl"
          >
            <div className="flex items-center gap-1">
              <p>문의 유형 : {help.help_type}</p>
              {help.status === false ? (
                <RiCheckboxCircleLine className="text-babgray-300" />
              ) : (
                <RiCheckboxCircleLine className="text-babbutton-green" />
              )}
            </div>
            <p className="text-babgray-800 truncate">{help.title}</p>
            <p className="text-babgray-600 truncate">{help.contents}</p>
            <div className="flex gap-1">
              문의 회원 : <p className="font-bold"> {help.profiles?.nickname ?? '탈퇴회원'}</p>
            </div>
          </div>
        ))}
      </div>
      {helpModal && helpDetail && (
        <AdminSupportDetailModal helpDetail={helpDetail} onClose={() => setHelpModal(false)} />
      )}

      {/* 하단 페이지네이션 */}
      <div className="flex justify-between items-center mt-4 text-sm text-babgray-600">
        <p>총 {helpList.length}개의 문의내역</p>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`w-7 h-7 rounded-full ${
                num === 1 ? 'bg-bab text-white' : 'hover:bg-babgray-100 text-babgray-600'
              }`}
            >
              {num}
            </button>
          ))}
          <span className="text-babgray-400">›</span>
        </div>
      </div>
    </div>
  );
}

export default AdminReportsPage;
