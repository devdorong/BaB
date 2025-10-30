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
import styles from './HelpPage.module.css';

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
      {/* 상단 경로 표시 */}
      <div className="flex flex-col w-full max-w-[1280px] mx-auto">
        <div className=" py-[15px] px-4 sm:px-6 hidden lg:flex">
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

        {/* 메인 컨테이너 */}
        <div className="w-full max-w-[1280px] mx-auto pt-[20px] lg:pt-[0px] px-4 xl:px-0">
          <div className={styles.wrapper}>
            {/* 왼쪽 통계 카드 */}
            <div className={styles.leftSection}>
              <div className={styles.card}>
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-[#FFEEE8] rounded-[12px] justify-center items-center">
                    <RiCustomerServiceLine className="w-[20px] h-[20px] text-[#EA580C]" />
                  </div>
                  <p className="text-[24px] font-bold">{csList.length}</p>
                  <p className="text-[16px] text-babgray-800">전체 문의 내용</p>
                </div>
              </div>

              <div className={styles.card}>
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

            {/* 오른쪽 안내 및 리스트 */}
            <div className={styles.rightSection}>
              {/* 안내 카드 */}
              <div className={styles.card}>
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

              {/* 문의 내역 리스트 */}
              <div className={`${styles.card} ${styles.helpList}`}>
                {loading ? (
                  [...Array(1)].map((_, i) => <CommunityCardSkeleton key={i} />)
                ) : csList.length > 0 ? (
                  csList.map(item => (
                    <div key={item.help_id} className={styles.helpItem}>
                      {/* 왼쪽 문의 정보 */}
                      <div className={styles.helpInfo}>
                        {item.status === false ? (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                            <RiQuestionLine className="text-babgray-800 text-2xl" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-babbutton-green_back rounded-full">
                            <RiCheckboxCircleLine className="text-babbutton-green text-2xl" />
                          </div>
                        )}

                        <div className="flex flex-col flex-1  min-w-0">
                          <p className={styles.helpTitle}>{item.title}</p>
                          <span className={styles.helpDate}>
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
                        className={styles.helpButton}
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

      {/* 모달 영역 */}
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
