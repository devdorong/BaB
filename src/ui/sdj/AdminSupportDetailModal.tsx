import { supabase } from '@/lib/supabase';
import type { Help } from '@/types/bobType';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonFillMd } from '../button';

type AdminSupportDetailModalProps = {
  isOpen: (value: React.SetStateAction<boolean>) => void;
};
type HelpWithProfile = Help & {
  profiles: { id: string; nickname: string };
};

function AdminSupportDetailModal({ isOpen }: AdminSupportDetailModalProps) {
  const { id } = useParams();
  const [helpDetail, setHelpDetail] = useState<HelpWithProfile | null>(null);
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('helps')
      .select(`*,profiles(id,nickname)`)
      .eq('profile_id', id)
      .single();
    if (error) return console.log('문의내역을 가지고 오지 못했습니다.', error.message);
    setHelpDetail(data || null);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (!isOpen) return;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className={`flex flex-col items-center gap-6 p-6 max-h-screen bg-white rounded-[30px] shadow text-babgray-700`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="w-full flex items-start text-xl px-2.5 font-bold">문의 상세</p>

          <div
            className={`flex flex-col items-start gap-4 w-[400px] max-h-[70%] overflow-y-auto text-babgray-700`}
            style={{ scrollbarGutter: 'stable both-edges' }}
          >
            <div className="w-full">
              <p className="text-sm">답변상태</p>
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">답변대기중</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">이메일</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{helpDetail?.profiles.nickname}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의 일자</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">
                  {/* {dayjs(help.created_at).format('YYYY-MM-DD HH:mm')} */}
                  1월2일
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의유형</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">계정</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의제목</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">ㅜㅜ</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의내용</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold whitespace-pre-line break-words">
                  ㅠㅠㅠㅠㅠㅠㅠㅠㅠ
                </div>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AdminSupportDetailModal;
