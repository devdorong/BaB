import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonFillMd } from '../button';
import Modal from './Modal';
import { useModal } from './ModalState';
import { supabase } from '../../lib/supabase';
import type { Help } from '../../types/bobType';
import dayjs from 'dayjs';

type HelpDetailModalProps = {
  isOpen: (value: React.SetStateAction<boolean>) => void;
};

function HelpDetailModal({ isOpen }: HelpDetailModalProps) {
  const { user } = useAuth();
  const { closeModal, modal, openModal } = useModal();

  const [helpDetail, setHelpDetail] = useState<Help[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('helps').select('*').eq('profile_id', user?.id);
    if (error) console.log('문의 내역 로드에 실패했습니다.', error);
    setHelpDetail(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }
    return () => {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    };
  }, [modal]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-8 max-h-[100vh] bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
        <p className="w-full flex items-start text-xl font-bold">1:1 문의하기</p>

        {helpDetail.map(item => (
          <div
            key={item.help_id}
            className="flex flex-col items-start gap-7 w-[400px] overflow-y-auto pr-4 text-babgray-700"
            style={{ scrollbarGutter: 'stable both-edges' }}
          >
            <div className="w-full">
              <p className="text-sm">답변상태</p>
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">
                  {item.status === false ? '답변 대기중' : '답변 완료'}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">이메일</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{user?.email}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의 일자</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">
                  {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의유형</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{item.help_type}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의제목</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{item.title}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의내용</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold whitespace-pre-line break-words">{item.contents}</div>
              </div>
            </div>

            <div className="w-full inline-flex items-center gap-4">
              <ButtonFillMd
                style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
                className="flex-1 hover:!bg-gray-300"
                onClick={() => isOpen(false)}
              >
                닫기
              </ButtonFillMd>
            </div>
          </div>
        ))}
      </div>
    </div>

    //   {modal.isOpen && (
    //     <Modal
    //       isOpen={modal.isOpen}
    //       onClose={closeModal}
    //       titleText={modal.title}
    //       contentText={modal.content}
    //       closeButtonText={modal.closeText}
    //       submitButtonText={modal.submitText}
    //       onSubmit={modal.onSubmit}
    //     />
    //   )}
  );
}

export default HelpDetailModal;
