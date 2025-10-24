import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  RiArrowRightSLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCustomerServiceLine,
  RiFileListLine,
  RiQuestionLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Help } from '../../../types/bobType';
import CommunityCardSkeleton from '../../../ui/sdj/CommunityCardSkeleton';
import Modal from '../../../ui/sdj/Modal';
import { useModal } from '../../../ui/sdj/ModalState';
import HelpDetailModal from '../../../ui/sdj/HelpDetailModal';

function HelpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { closeModal, modal, openModal } = useModal();
  const [csList, setCsList] = useState<Help[]>([]);
  const [selectedHelp, setSelectedHelp] = useState<Help | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpDetailModal, setHelpDetailModal] = useState(false);

  const loadhelp = async () => {
    const { data, error } = await supabase.from('helps').select('*').eq('profile_id', user?.id);

    if (error) {
      openModal('문의 정보', '문의 내역을 불러오는데 실패했습니다', '닫기');
      console.log(error.message);
    }
    setCsList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadhelp();
  }, []);

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
          <div className="text-bab-500 text-[17px]">문의 내용</div>
        </div>

        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 카드 영역 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              {/* 전체 문의 내용 */}
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-[#FFEEE8] rounded-[12px] justify-center items-center">
                    <RiCustomerServiceLine className="w-[20px] h-[20px] text-[#EA580C]" />
                  </div>
                  <p className="text-[24px] font-bold">{csList.length}</p>
                  <p className="text-[16px] text-babgray-800">전체 문의 내용</p>
                </div>
              </div>

              {/* 답변완료 */}
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-babbutton-green_back rounded-[12px] justify-center items-center">
                    <RiCheckLine className="w-[20px] h-[20px] text-babbutton-green" />
                  </div>
                  <p className="text-[24px] font-bold">
                    {csList.filter(item => item.status).length}
                  </p>
                  <p className="text-[16px] text-babgray-800">답변 완료</p>
                </div>
              </div>
            </div>

            {/* 오른쪽 카드 영역 */}
            <div className="flex flex-col w-full gap-[30px] justify-center">
              {/* 안내 카드 */}
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[20px]">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-[#FFEEE8] rounded-[12px] justify-center items-center">
                    <RiCustomerServiceLine className="w-[20px] h-[20px] text-[#EA580C]" />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[24px] font-bold">문의 내역 안내</p>
                    <div className="flex flex-col gap-[10px] text-[17px] text-babgray-800">
                      <span>· 접수하신 1:1 문의 내역을 확인할 수 있습니다.</span>
                      <span>· 문의 내용과 답변을 한눈에 확인할 수 있습니다.</span>
                      <span>· 문의 접수 후 순차적으로 답변이 제공됩니다.</span>
                      <span>· 추가 문의가 있을 경우 새 문의를 등록할 수 있습니다.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 문의 내역 */}
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[20px]">
                  {loading ? (
                    [...Array(1)].map((_, i) => <CommunityCardSkeleton key={i} />)
                  ) : csList.length > 0 ? (
                    csList.map(item => (
                      <div
                        key={item.help_id}
                        className="flex justify-between items-center p-5 bg-white rounded-xl border border-gray-200"
                      >
                        {/* 왼쪽 문의내역 통계 */}
                        <div className="flex items-center gap-5">
                          {item.status === false ? (
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                              <span className="text-2xl">
                                <RiQuestionLine className="text-babgray-800" />
                              </span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-babbutton-green_back rounded-full">
                              <span className="text-2xl">
                                <RiCheckboxCircleLine className="text-babbutton-green" />
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col">
                            <span className="text-base font-medium truncate w-[70vh] text-gray-900">
                              {item.title}
                            </span>
                            <span className="text-sm text-gray-600">
                              문의 일자 : {dayjs(item.created_at).format('YYYY-MM-DD')}
                            </span>
                          </div>
                        </div>

                        {/* 상세보기 버튼 */}
                        <button
                          onClick={() => {
                            setSelectedHelp(item);
                            setHelpDetailModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          <RiFileListLine className="w-4 h-4" />
                          <span className="text-sm font-medium">상세 보기</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-5">문의 내용이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {helpDetailModal && selectedHelp && (
        <HelpDetailModal help={selectedHelp} isOpen={() => setHelpDetailModal(false)} />
      )}
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
    </div>
  );
}

export default HelpPage;
