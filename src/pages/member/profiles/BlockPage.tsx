import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiErrorWarningLine,
  RiUserForbidLine,
  RiUserUnfollowLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import OkCancelModal from '../../../components/member/OkCancelModal';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Profile_Blocks } from '../../../types/bobType';
import CommunityCardSkeleton from '../../../ui/sdj/CommunityCardSkeleton';
import Modal from '../../../ui/sdj/Modal';
import { useModal } from '../../../ui/sdj/ModalState';

type BlockProfile = Profile_Blocks & {
  blocked_profile: {
    id: string;
    nickname: string;
  } | null;
};

function BlockPage() {
  const { closeModal, modal, openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blockedList, setBlockedList] = useState<BlockProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [thisMonthCount, setThisMonthCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile_blocks')
        .select(`*, blocked_profile:blocked_profile_id ( id, nickname )`)
        .eq('profile_id', user?.id);

      if (error) {
        console.error(`유저정보를 불러오는데 실패했습니다: ${error.message}`);
        setLoading(false);
        return;
      }

      setBlockedList(data || []);

      const currentMonth = dayjs().month() + 1;
      const currentYear = dayjs().year();

      const filtered = data?.filter(item => {
        const d = dayjs(item.block_date);
        return d.year() === currentYear && d.month() + 1 === currentMonth;
      });

      setThisMonthCount(filtered?.length ?? 0);
      setLoading(false);
    };

    if (user?.id) fetchData();
  }, [user?.id, modal]);

  // 차단 해제
  const handleUnblock = async (blockId: number, nickname: string) => {
    openModal('차단 해제', `${nickname}님의 차단을 해제하시겠습니까?`, '취소', '해제', async () => {
      const { error } = await supabase.from('profile_blocks').delete().eq('id', blockId);

      if (error) console.error('차단 해제 실패:', error.message);
      else setBlockedList(prev => prev.filter(b => b.id !== blockId));
      closeModal();
    });
  };

  return (
    <div id="root" className="min-h-screen bg-bg-bg">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className="text-babgray-600 text-[17px] cursor-pointer hover:text-babgray-900"
          >
            프로필
          </div>
          <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
            <RiArrowRightSLine />
          </div>
          <div className="text-bab-500 text-[17px]">차단</div>
        </div>

        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 카드 영역 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              {/* 총 차단 사용자 */}
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-red-100 rounded-[12px] justify-center items-center">
                    <RiUserForbidLine className="w-[20px] h-[20px] text-babbutton-red" />
                  </div>
                  <p className="text-[24px] font-bold">{blockedList.length}</p>
                  <p className="text-[16px] text-babgray-800">총 차단 사용자</p>
                </div>
              </div>

              {/* 이번 달 차단 */}
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-[#FFEEE8] rounded-[12px] justify-center items-center">
                    <RiCalendarLine className="w-[20px] h-[20px] text-[#EA580C]" />
                  </div>
                  <p className="text-[24px] font-bold">{thisMonthCount}</p>
                  <p className="text-[16px] text-babgray-800">이번 달 차단</p>
                </div>
              </div>
            </div>

            {/* 오른쪽 카드 영역 */}
            <div className="flex flex-col w-full gap-[30px] justify-center">
              {/* 안내 카드 */}
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[20px]">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-red-100 rounded-[12px] justify-center items-center">
                    <RiErrorWarningLine className="w-[20px] h-[20px] text-babbutton-red" />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[24px] font-bold">차단 기능 안내</p>
                    <div className="flex flex-col gap-[10px] text-[17px] text-babgray-800">
                      <span>· 차단된 사용자는 나에게 메시지를 보낼 수 없습니다.</span>
                      <span>· 차단된 사용자와 매칭 될 경우에는 동의를 받습니다.</span>
                      <span>· 언제든지 차단을 해제할 수 있습니다.</span>
                      <span>· 차단은 상대방에게 알려지지 않습니다.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 차단자 목록 */}
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[20px]">
                  {loading ? (
                    [...Array(1)].map((_, i) => <CommunityCardSkeleton key={i} />)
                  ) : blockedList.length > 0 ? (
                    blockedList.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-5 bg-white rounded-xl border border-gray-200"
                      >
                        {/* 왼쪽 사용자 정보 */}
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                            <span className="text-xl text-gray-700">
                              <RiUserForbidLine />
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-900">
                              {item.blocked_profile?.nickname}
                            </span>
                            <span className="text-sm text-gray-600">
                              차단일 : {dayjs(item.block_date).format('YYYY-MM-DD')}
                            </span>
                          </div>
                        </div>

                        {/* 차단 해제 버튼 */}
                        <button
                          onClick={() =>
                            handleUnblock(item.id, item.blocked_profile?.nickname ?? '사용자')
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          <RiUserUnfollowLine className="w-4 h-4" />
                          <span className="text-sm font-medium">차단 해제</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-5">차단된 사용자가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}

      {viewModal && (
        <div className="w-full">
          <OkCancelModal
            isOpen={viewModal}
            onClose={() => setViewModal(false)}
            onSubmit={() => {
              setViewModal(false);
            }}
            submitButtonText="해제"
            closeButtonText="취소"
          />
        </div>
      )}
    </div>
  );
}

export default BlockPage;
