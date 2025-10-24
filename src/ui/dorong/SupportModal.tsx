import { useEffect, useState } from 'react';
import { ButtonFillMd } from '../button';
import Modal from '../sdj/Modal';
import { InputField, TextAreaCustom } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';
import type { Database, HelpInsert, Profile } from '../../types/bobType';
import { getProfile } from '../../lib/propile';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useModal } from '../sdj/ModalState';
import { supabase } from '../../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

type SupportModalProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HelpCategory = Database['public']['Tables']['helps']['Row']['help_type'];
export type HelpCategoryWithEmpty = HelpCategory | '';

const categorys: HelpCategory[] = [
  '계정 관련',
  '결제/환불 관련',
  '매칭/이용 관련',
  '리뷰/신고',
  '서비스 개선 제안',
  '광고/제휴 문의',
  '기타',
];

const SupportModal = ({ setOpenModal }: SupportModalProps) => {
  const { user } = useAuth();
  const { closeModal, modal, openModal } = useModal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<HelpCategoryWithEmpty>('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const [profileData, setProfileData] = useState<Profile | null>(null);

  const loadProfile = async () => {
    if (!user?.id) {
      openModal('사용자 정보', '사용자 정보 없음', '닫기');
      setLoading(false);
      return;
    }
    try {
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        openModal('사용자 정보', '사용자 프로필 정보 찾을 수 없음', '닫기');
        return;
      }
      setNickname(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      console.log('프로필 호출 오류 : ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim() || category) {
      openModal(
        '문의 취소',
        '작성중인 문의내용을 저장하지않고 닫으시겠습니까?',
        '취소',
        '확인',
        () => {
          closeModal();
          setOpenModal(false);
        },
      );
    } else {
      setOpenModal(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        openModal('사용자 정보', '로그인된 사용자가 없습니다.', '닫기');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        openModal('사용자 정보', '프로필 정보를 불러오지 못했습니다.', '닫기');
        console.error('프로필 정보를 불러오지 못했습니다:', profileError?.message);
        return;
      }
      openModal('문의 확인', '작성된 내용으로 문의하시겠습니까?', '취소', '확인', async () => {
        if (!category.trim()) {
          openModal('문의 확인', '문의 유형을 선택 해주세요.', '확인');
          return;
        }
        if (!title.trim() || !content.trim()) {
          openModal('문의 확인', '제목 또는 문의내용을 입력 해주세요.', '확인');
          return;
        }
        const newHelp: HelpInsert = {
          profile_id: profileData.id,
          help_type: category as HelpCategory,
          title,
          contents: content,
        };

        const { error } = await supabase.from('helps').insert([newHelp]);

        if (error) {
          openModal('문의 실패', '문의 등록 실패.', '닫기');
          console.error('문의 등록 실패 : ', error.message);
          return;
        }

        openModal('문의 완료', '문의가 완료되었습니다.', '닫기');
        closeModal();
        setOpenModal(false);
      });
    } catch (err) {
      console.error('handleSubmit 오류:', err);
    }
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
    loadProfile();
  }, [user?.id]);

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
          className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="w-full flex items-start text-xl font-bold">1:1 문의하기</p>
          <div className="flex flex-col items-start gap-7 w-[400px] text-babgray-700">
            <div className="w-full">
              <p className="text-sm">이름</p>

              {/* 문의하는 사람의 닉네임 */}
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">{profileData?.nickname}</div>
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm">이메일</p>
              {/* 문의하는 사람의 이메일 */}
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{user?.email}</div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <p className="text-sm">문의 유형</p>
              {/* 문의하는 사람의 이메일 */}
              <div className="w-full h-12 bg-white items-center relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as HelpCategoryWithEmpty)}
                  required
                  className="w-full h-[50px] rounded-[25px] border border-gray-300 px-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-bab-500 appearance-none"
                >
                  <option value="" disabled>
                    문의 유형을 선택해주세요.
                  </option>
                  {categorys.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <RiArrowDownSLine color="#C2C2C2" />
                </div>
              </div>
            </div>

            <InputField
              label="제목"
              onChange={e => setTitle(e.target.value)}
              value={title}
              placeholder="제목을 입력해주세요"
              required
              type="text"
            />
            <div className="w-full">
              <TextAreaCustom
                label="문의 내용"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="문의내용을 자세히 입력해주세요"
                maxLength={500}
                required
              />
              <p className="text-xs text-babgray-500 text-right">{content.length}/500</p>
            </div>

            <div className="w-full inline-flex items-center gap-4">
              <ButtonFillMd
                style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
                className="flex-1 hover:!bg-gray-300"
                onClick={handleCancel}
              >
                취소
              </ButtonFillMd>
              <ButtonFillMd onClick={handleSubmit} className="flex-1 bg-bab hover:bg-bab-600">
                문의하기
              </ButtonFillMd>
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SupportModal;
