import { removeRestaurantImg, updateRestaurant, uploadRestaurant } from '@/lib/restaurants';
import { useEffect, useRef, useState } from 'react';
import { RiImageLine } from 'react-icons/ri';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import { getProfile } from '../../lib/propile';
import type { Profile, Restaurants, RestaurantsUpdate } from '../../types/bobType';
import { ButtonFillMd } from '../../ui/button';
import { useModal } from '@/ui/sdj/ModalState';
import Modal from '@/ui/sdj/Modal';

function SettingsPage() {
  const { restaurant, setRestaurant } = useRestaurant();
  const [settings, setSettings] = useState({
    sms: false,
    newLogin: false,
  });
  const [userId, setUserId] = useState('');
  const { openModal, closeModal, modal } = useModal();

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  function getEmailLocalPart(email: string): string {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return ''; // @ 없는 경우
    return email.substring(0, atIndex);
  }

  //=================== 프로필 불러오기

  const { user } = useAuth();
  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');
  // 아바타 이미지를 위한 생태관리
  // 레스토랑
  const [restaurants, setRestaurants] = useState<Restaurants | null>(null);
  // 이미지 업로드 상태 표현
  const [uploading, setUploading] = useState<boolean>(false);
  // 실제 파일
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // 사용자가 새로운 이미지 선택시, 즉 편집 중인 경우 원본 URL 보관용
  const [originalRestUrl, setOriginalRestUrl] = useState<string | null>(null);
  // 이미지 제거 요청 상태(그러나, 실제 file 제거는 수정확인 버튼 눌렀을 때 처리)
  const [imageRemovalRequest, setImageRemovalRequest] = useState<boolean>(false);
  // input type = "file" 태그 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setNickName(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.email) {
      const localPart = getEmailLocalPart(user.email);
      setUserId(localPart); // 기본 닉네임 세팅
    }
  }, [user?.email]);

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  // 저장하기
  const handlesaveImg = async (file?: File) => {
    if (!user?.id || !restaurant) return;

    try {
      setUploading(true);
      let imgUrl = originalRestUrl; // 원본 img

      if (file && restaurant.thumbnail_url) {
        await removeRestaurantImg(String(restaurant.id));
        // console.log('기존 이미지 삭제완료');
      }

      if (file) {
        const uploadedImageUrl = await uploadRestaurant(file, String(restaurant.id));

        if (uploadedImageUrl) imgUrl = uploadedImageUrl;
      }

      const payload: RestaurantsUpdate = {
        thumbnail_url: imgUrl,
      };

      const success = await updateRestaurant(payload, String(restaurant.id));
      if (!success) throw new Error('레스토랑 이미지 업데이트 실패');

      if (setRestaurant) {
        setRestaurant({ ...restaurant, thumbnail_url: imgUrl });
      }

      setRestaurants(prev => (prev ? { ...prev, thumbnail_url: imgUrl } : prev));
      setOriginalRestUrl(imgUrl);
      setSelectedFile(null);
      setImageRemovalRequest(false);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  // 이미지 선택 처리
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      // alert창 수정할것
      // alert(`지원하지 않는 파일 형식`);
      openModal('파일업로드', '지원하지 않는 파일 형식 입니다.', '닫기', '');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      // alert(`파일 크기 큽니다. 최대 (5MB)`);
      openModal('파일업로드', '파일 크기 큽니다. 최대 (5MB)', '닫기', '');
      return;
    }

    await handlesaveImg(file);
  };

  // ===========

  // useEffect(() => {
  //   console.log(user?.app_metadata.provider);
  //   console.log(restaurant);
  // }, []);

  return (
    <>
      <PartnerBoardHeader title="계정 & 보안" subtitle="계정 정보와 보안 설정을 관리하세요." />
      <div className="w-full text-babgray-700 flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="p-5 flex-1 gap-5 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-between items-center">
            {/* 파트너 프로필 이미지 사진 */}
            <div className="flex flex-col gap-2.5 justify-between items-center">
              <div className="w-[100px] h-[100px] rounded-full">
                <img
                  src={
                    String(restaurant?.thumbnail_url) ||
                    'https://www.gravatar.com/avatar/?d=mp&s=200'
                  }
                  alt="아바타"
                  className="w-full h-full object-cover  rounded-full object-center"
                />
              </div>
              <div className="flex flex-col  items-center">
                {/* 파트너 닉네임 */}
                <div className="text-black font-bold">{profileData?.nickname}</div>
                {/* 파트너 아이디 */}
                {/* <div>{userId}</div> */}
              </div>
            </div>
            {/* 클릭시 사진등록 후 바로 변경 */}
            <ButtonFillMd onClick={() => fileInputRef.current?.click()} className="w-full">
              <RiImageLine />
              <p>사진 변경</p>
            </ButtonFillMd>

            {/* 파일 입력 */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
          </div>

          <div className="p-5 flex-1 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-center gap-5">
            <div className="text-black text-lg font-bold">개인 정보</div>
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col w-[50%] gap-4">
                <div className="flex flex-col items-start gap-1">
                  <div className="font-semibold">이름</div>
                  {/* 파트너 이름 */}
                  <div className="">{profileData?.name}</div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="font-semibold">전화번호</div>
                  {/* 파트너 전화번호 */}
                  <div className="">{profileData?.phone}</div>
                </div>
              </div>

              <div className="flex flex-col w-[50%] gap-4">
                <div className="flex flex-col items-start gap-1">
                  <div className="font-semibold">이메일</div>
                  {/* 파트너 이메일 */}
                  <div className="">{user?.email}</div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="font-semibold">사업장등록번호</div>
                    <div className="">{restaurant?.business_number}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* <div className="p-5 flex-1 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-center gap-5">
            <div className="flex gap-5 justify-between items-start">
              <div className="text-black text-lg font-bold">비밀번호</div>
              <ButtonFillMd>
                <RiLock2Line size={20} />
                <div>비밀번호 변경</div>
              </ButtonFillMd>
            </div>

            <div className="flex flex-col gap-1">
              <div>비밀번호 변경</div>
              <div className="text-xs font-medium">마지막 변경: 2025년 8월 29일</div>
            </div>
          </div> */}

          <div className="p-5 flex-1 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-center gap-5">
            <div className="text-black text-lg font-bold">사업자 정보</div>
            <div className="flex flex-col justify-start items-start gap-9">
              <div className="w-full flex flex-col justify-start gap-4">
                <p className="font-semibold">사업자명</p>
                {/* 파트너 매장 명 */}
                <p className="">{restaurant?.name}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="font-semibold ">사업장 주소</div>
                {/* 파트너 매장 주소 */}
                <div className="">{restaurant?.address}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="p-5 flex-1 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-center gap-5">
            <div className="text-black text-lg font-bold ">연결된 소셜 이메일</div>

            <div className="flex flex-col justify-start items-start gap-4">
              <div className="flex flex-col justify-start gap-2">
                <div className="font-semibold">카카오 이메일</div>
                {/* 파트너 카카오 이메일 */}
                <div className="">
                  {user?.app_metadata?.provider === 'kakao'
                    ? user.email
                    : '등록된 카카오 이메일이 없습니다.'}
                </div>
              </div>

              <div className="flex flex-col justify-start gap-2">
                <div className="font-semibold">구글 이메일</div>
                {/* 파트너 구글 이메일 */}
                <div className="">
                  {user?.app_metadata?.provider === 'google'
                    ? user.email
                    : '등록된 구글 이메일이 없습니다.'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border flex flex-col justify-between gap-5">
            <div className="flex flex-col justify-between items-start gap-7">
              <div className="text-black text-lg font-bold">2단계 인증</div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-col justify-start items-start gap-1">
                  <div className="font-semibold">SMS 인증</div>
                  <div className="text-base font-medium">로그인 시 SMS 로 인증코드를 받습니다.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('sms')}
                  className={[
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    settings.sms ? 'bg-[#FF5722]' : 'bg-gray-300',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.sms ? 'translate-x-[18px]' : 'translate-x-[2px]',
                    ].join(' ')}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col justify-start items-start gap-1">
                  <div className="font-semibold">로그인 알림</div>
                  <div className="text-base font-medium">
                    새로운 기기에서 로그인 시 알림을 받습니다
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('newLogin')}
                  className={[
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    settings.newLogin ? 'bg-[#FF5722]' : 'bg-gray-300',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.newLogin ? 'translate-x-[18px]' : 'translate-x-[2px]',
                    ].join(' ')}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
}

export default SettingsPage;
