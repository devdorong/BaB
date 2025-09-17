import { useEffect, useState } from 'react';
import {
  RiArrowRightSLine,
  RiBardFill,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiEditLine,
  RiMailLine,
  RiMastercardLine,
  RiPhoneLine,
  RiUserLine,
  RiVisaLine,
} from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getProfile } from '../../../lib/propile';
import type { Profile } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import { Cafe, ChineseFood, GrayTag, Indoor, KFood, OrangeTag } from '../../../ui/tag';

function ProfilePage() {
  const { user, signOut } = useAuth();
  // 네비게이터
  const navigate = useNavigate();

  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');

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
      setNickName(tempData.nickname || '');
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

  // 전화번호 마스킹처리
  const maskPhone = (phone?: string | null) => {
    if (!phone) return '';
    const path = phone.split('-');
    if (path.length !== 3) return phone;

    const [first, middle, last] = path;
    return `${first}-${middle.slice(0, 2)}**-${last.slice(0, 2)}**`;
  };

  // 로그아웃 처리
  const handleLogout = () => {
    signOut();
    navigate('/member');
  };

  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">프로필 정보</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[15px] flex flex-col justify-center items-center">
                  <div className="w-[94px] h-[94px] overflow-hidden rounded-full">
                    {profileData?.avatar_url && (
                      <img
                        src={
                          profileData.avatar_url === 'guest_image'
                            ? 'https://www.gravatar.com/avatar/?d=mp&s=200'
                            : ''
                        }
                        alt="프로필 이미지"
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-center text-babgray-900 text-[21px] font-bold ">
                      {profileData?.nickname}
                    </div>
                    <div className="text-center text-babgray-500 text-[14px]">
                      {profileData?.comment ? (
                        <div>{profileData.comment}</div>
                      ) : (
                        <p>자기소개가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* 포인트 */}
                <div className="text-center py-[23px]">
                  <div className="text-[22px] font-bold text-yellow-500">포인트금액</div>
                  <div className="text-[14px] text-babgray-600">포인트</div>
                </div>
                {/* 라인 */}
                <div className="w-full border-babgray-100 border-[1px]"></div>
                {/* 리뷰, 찜, 매칭, 평점 */}
                <div className="pt-[23px] text-center grid grid-cols-2 gap-[21px]">
                  <div>
                    <div className="text-[22px] font-bold text-bab-500">리뷰개수</div>
                    <div className="text-[14px] text-babgray-600">리뷰</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-bab-500">찜개수</div>
                    <div className="text-[14px] text-babgray-600">찜</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-bab-500">매칭개수</div>
                    <div className="text-[14px] text-babgray-600">매칭</div>
                  </div>
                  <div>
                    <div className="text-[22px] font-bold text-bab-500">평점</div>
                    <div className="text-[14px] text-babgray-600">평점</div>
                  </div>
                </div>
                <div></div>
              </div>
              {/* 멤버십 가입 */}
              <div className="flex bg-babgray-200 w-[260px] rounded-full py-[8px] justify-center items-center ">
                <button className="text-white flex text-center justify-center items-center gap-[8px]">
                  <RiBardFill />
                  VIP 멤버 가입하기
                </button>
              </div>
            </div>
            {/* 오른쪽 프로필카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* 기본정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <div className="text-babgray-900 text-[18px] font-bold">기본 정보</div>
                  <ButtonFillMd
                    onClick={() => navigate('/member/profile/edit')}
                    style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <RiEdit2Line />
                    편집
                  </ButtonFillMd>
                </div>
                <div className="flex flex-col pt-[40px] gap-[22px]">
                  <div className="flex justify-between text-babgray-600">
                    <div className="flex items-center gap-[10px] ">
                      <RiUserLine />
                      닉네임
                    </div>
                    <div>{profileData?.nickname}</div>
                  </div>
                  <div className="w-full border-babgray-100 border"></div>
                  <div className="flex justify-between text-babgray-600">
                    <div className="flex items-center gap-[10px] ">
                      <RiMailLine />
                      이메일
                    </div>
                    <div>{user?.email}</div>
                  </div>
                  <div className="w-full border-babgray-100 border"></div>
                  <div className="flex justify-between text-babgray-600">
                    <div className="flex items-center gap-[10px] ">
                      <RiPhoneLine />
                      전화번호
                    </div>
                    <div>{maskPhone(profileData?.phone)}</div>
                  </div>
                  <div className="w-full border-babgray-100 border"></div>
                  <div className="flex justify-between text-babgray-600">
                    <div className="flex items-center gap-[10px] ">
                      <RiCalendarLine />
                      가입일
                    </div>
                    <div>{user?.created_at && new Date(user?.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              {/* 관심사 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <div className="text-babgray-900 text-[18px] font-bold">관심사</div>
                  <ButtonFillMd
                    onClick={() => navigate('/member/profile/interest')}
                    style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <RiEdit2Line />
                    편집
                  </ButtonFillMd>
                </div>
                <div className="flex gap-[12px] mt-[12px] mb-[25px]">
                  <KFood />
                  <ChineseFood />
                  <Cafe />
                  <Indoor />
                </div>
                <p className="text-[13px] text-babgray-600">
                  관심사는 맛집 추천과 매칭에 활용됩니다
                </p>
              </div>
              {/* 결제수단 */}
              <div className="inline-flex w-full px-[35px] py-[25px] gap-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <div className="text-babgray-900 text-[18px] font-bold">등록된 결제수단</div>
                  <ButtonFillMd
                    style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <RiEdit2Line />
                    등록하기
                  </ButtonFillMd>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex justify-between items-center border border-babgray-150 rounded-[12px] bg-white p-[20px]">
                    <div className="flex gap-[10px] items-center">
                      <RiVisaLine className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
                      <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center gap-[10px]">
                          <p className="text-babgray-700">Visa 8453 •••• 4532 1642</p>
                          <OrangeTag>기본 카드</OrangeTag>
                        </div>
                        <p className="text-[13px] text-babgray-600">주 사용 카드 • 만료: 12/2026</p>
                      </div>
                    </div>
                    <div className="flex gap-[10px] text-babgray-500">
                      <RiEditLine />
                      <RiDeleteBinLine />
                    </div>
                  </div>
                  <div className="flex justify-between items-center border border-babgray-150 rounded-[12px] bg-white p-[20px]">
                    <div className="flex gap-[10px] items-center">
                      <RiMastercardLine className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
                      <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center gap-[10px]">
                          <p className="text-babgray-700">Mastercard 1234 •••• 2432 1122</p>
                        </div>
                        <p className="text-[13px] text-babgray-600">서브 카드 • 만료: 12/2026</p>
                      </div>
                    </div>
                    <div className="flex gap-[10px] text-babgray-500 items-center">
                      <GrayTag>기본 설정</GrayTag>
                      <RiEditLine />
                      <RiDeleteBinLine />
                    </div>
                  </div>
                </div>
              </div>
              {/* 나의 정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] gap-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div>
                  <div className="text-babgray-900 text-[18px] font-bold">나의 정보</div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <Link
                    to={'/member/profile/chat'}
                    className="flex justify-between text-babgray-900 items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    채팅
                    <RiArrowRightSLine />
                  </Link>
                  <Link
                    to={'/member/profile/point'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    포인트관리
                    <RiArrowRightSLine />
                  </Link>
                  <Link
                    to={'/member/profile/favorite'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    즐겨찾는 식당
                    <RiArrowRightSLine />
                  </Link>
                  <Link
                    to={'/member/profile/recentmatching'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    최근 매칭 기록
                    <RiArrowRightSLine />
                  </Link>
                  <Link
                    to={'/member/profile/block'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    차단
                    <RiArrowRightSLine />
                  </Link>
                </div>
              </div>
              {/* 로그아웃 및 회원탈퇴 */}
              <div className="flex gap-2 justify-end pb-[28px]">
                <div className="text-center justify-start text-babgray-400 text-base font-medium">
                  회원탈퇴
                </div>
                <div className="text-center justify-start text-babgray-400 text-base font-medium">
                  |
                </div>
                <div
                  onClick={handleLogout}
                  className="text-center justify-start text-babgray-400 text-base font-medium cursor-pointer"
                >
                  로그아웃
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
