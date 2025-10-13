import { useEffect, useState } from 'react';
import { ButtonFillMd } from '../button';
import Modal from '../sdj/Modal';
import { InputField, TextAreaCustom } from '../../components/InputField';
import { useAuth } from '../../contexts/AuthContext';
import type { Profile } from '../../types/bobType';
import { getProfile } from '../../lib/propile';
import { RiArrowDownSLine } from 'react-icons/ri';

type SupportModalProps = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const categorys = [
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
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [nickname, setNickname] = useState(''); // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');


  // 사용자 프로필 정보
  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickname(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden">
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
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full h-[50px] rounded-[25px] border border-gray-300 px-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-bab-500 appearance-none"
              >
                <option value="">문의 유형</option>
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
            {/* 취소 버튼 클릭시 확인모달 */}
            <ButtonFillMd
              style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
              className="flex-1 hover:!bg-gray-300"
              onClick={() => setOpenModal(false)}
            >
              취소
            </ButtonFillMd>
            {/* 누르면 문의 제출 확인 모달 */}
            <ButtonFillMd
              className="flex-1 bg-bab hover:bg-bab-600"
              onClick={() => setIsOpen(true)}
            >
              문의하기
            </ButtonFillMd>
            {/* 모달의 문의하기 눌렀을때 완료모달 */}
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              titleText="문의하기"
              contentText="작성된 내용으로 문의 하시겠습니까?"
              submitButtonText="문의하기"
              closeButtonText="닫기"
              submitButtonBgColor="#ff5722"
              onSubmit={() => {
                setIsOpen(false);
                setOpenModal(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
