import { getUserMatchings } from '@/services/matchingService';
import { useEffect, useState } from 'react';
import {
  RiArrowRightSLine,
  RiBankCard2Line,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiMailLine,
  RiMastercardLine,
  RiPhoneLine,
  RiUserLine,
  RiVisaLine,
} from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { usePoint } from '../../../contexts/PointContext';
import { fetchCurrentProfileInterests } from '../../../lib/interests';
import { fetchMyReviewData, type MyReviewData } from '../../../lib/myreviews';
import { getProfile } from '../../../lib/propile';
import { getAvgMyRatingScore, getMyFavoritesCount } from '../../../lib/restaurants';
import type { Matchings, Profile } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import CategoryBadge from '../../../ui/jy/CategoryBadge';

import { usePayment } from '@/components/payment/PaymentContext';
import { PaymentInputModal } from '@/components/payment/PaymentInputModal';

interface PaymentMethod {
  id: number;
  brand: string;
  number: string;
  is_default: boolean;
  description?: string;
  expire?: string;
}

import { GrayTag, OrangeTag } from '../../../ui/tag';
import { useModal } from '@/ui/sdj/ModalState';
import Modal from '@/ui/sdj/Modal';

function ProfilePage() {
  const { closeModal, modal, openModal } = useModal();
  const { user, signOut } = useAuth();
  const { refreshPoint } = usePoint();
  // 네비게이터
  const navigate = useNavigate();
  const { point } = usePoint();

  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');
  // 사용자 관심사
  const [interests, setInterests] = useState<string[]>([]);
  // 리뷰 개수
  const [review, setReview] = useState<MyReviewData[]>([]);
  // 찜 개수
  const [favoritesCount, setFavoritesCount] = useState(0);
  // 평점
  const [avgScore, setAvgScore] = useState<number>(0);
  // 사용자 매칭 배열
  const [matchings, setMatchings] = useState<Matchings[]>([]);
  // 결제 관련 모달 상태
  const {
    paymentMethods,
    addPaymentMethod,
    reloadPayments,
    setDefaultMethod,
    removePaymentMethod,
  } = usePayment();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const MyReviewCount = async () => {
      setLoading(true);
      try {
        const data = await fetchMyReviewData();
        setReview(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    MyReviewCount();
  }, []);

  // 사용자 별점 계산

  useEffect(() => {
    const avgRating = async () => {
      const data = await getAvgMyRatingScore();

      const ratings = data.map(r => r.rating_food ?? 0);
      const avg =
        ratings.length > 0
          ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
          : 0;

      setAvgScore(avg);
    };
    avgRating();
  }, []);

  // 사용자 찜개수 계산
  useEffect(() => {
    const loadFavorite = async () => {
      if (!user?.id) return;
      const count = await getMyFavoritesCount(user.id);
      // console.log(count);
      setFavoritesCount(count);
    };
    loadFavorite();
  }, [user?.id]);

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
      await refreshPoint();
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

  // 관심사 저장
  useEffect(() => {
    const loadProfileInterests = async () => {
      setLoading(true);
      try {
        const interests = await fetchCurrentProfileInterests();
        setInterests(interests);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileInterests();
  }, []);
  useEffect(() => {
    const fetchUserMatchings = async () => {
      if (!user) return;

      try {
        const userMatchings = await getUserMatchings(user.id);
        setMatchings(userMatchings);
      } catch (err) {
        console.error('매칭 불러오기 실패:', err);
      }
    };

    fetchUserMatchings();
  }, [user]);

  const handleAddPayment = async (data: any) => {
    try {
      await addPaymentMethod({
        brand: data.brand,
        number: data.number,
        expire: data.expire,
        description: data.description,
        is_default: false,
      });
      await reloadPayments();
      setOpen(false);
    } catch (err) {
      console.error('결제 등록 실패:', err);
      alert('결제 등록 중 오류가 발생했습니다.');
    }
  };
  // 로그아웃 처리
  const handleLogout = () => {
    signOut();
    navigate('/member');
  };

  if (!user) {
    setTimeout(() => navigate('/member'), 0);
  }
  const handleSignout = () => {
    openModal(
      '회원탈퇴',
      '정말 회원탈퇴를 진행하시겠습니까?\n 탈퇴후에는 기존 정보가 모두 사라집니다.',
      '취소',
      '탈퇴하기',
      () => {
        closeModal();
        openModal('회원탈퇴', '카카오 문의로 회원정보를 남겨주세요', '', '확인', () => {
          window.location.href = 'https://open.kakao.com/o/sf561R0h';
        });
      },
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-bg-bg min-h-screen justify-center">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        {/* 헤더 */}
        <div className="hidden lg:flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
        </div>

        <div className="mt-[20px] mb-[60px]">
          <div className="flex flex-col lg:flex-row gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center w-full lg:w-[300px]">
              <div className="inline-flex w-full lg:w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[15px] flex flex-col justify-center items-center">
                  <div className="w-[94px] h-[94px] overflow-hidden rounded-full">
                    {profileData?.avatar_url && (
                      <img
                        src={
                          profileData.avatar_url !== 'guest_image'
                            ? profileData.avatar_url
                            : 'https://www.gravatar.com/avatar/?d=mp&s=200'
                        }
                        alt="프로필 이미지"
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-center text-babgray-900 text-[21px] font-bold break-keep">
                      {profileData?.nickname}
                    </div>
                    <div className="text-center text-babgray-500 text-[14px] break-words max-w-[200px]">
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
                  <div className="text-[28px] font-bold text-yellow-500">
                    {point.toLocaleString()}P
                  </div>
                  <div className="text-[14px] text-babgray-600">포인트</div>
                </div>

                <div className="w-full border-babgray-100 border-[1px]"></div>

                {/* 리뷰, 찜, 매칭, 평점 */}
                <div className="pt-[23px] w-full text-center grid grid-cols-4 lg:grid-cols-2 gap-[21px]">
                  <div>
                    <div className="text-[22px] sm:text-[24px] font-bold text-bab-500">
                      {review.length}
                    </div>
                    <div className="text-[13px] sm:text-[14px] text-babgray-600">리뷰</div>
                  </div>
                  <div>
                    <div className="text-[22px] sm:text-[24px] font-bold text-bab-500">
                      {favoritesCount}
                    </div>
                    <div className="text-[13px] sm:text-[14px] text-babgray-600">찜</div>
                  </div>
                  <div>
                    <div className="text-[22px] sm:text-[24px] font-bold text-bab-500">
                      {matchings.length}
                    </div>
                    <div className="text-[13px] sm:text-[14px] text-babgray-600">매칭</div>
                  </div>
                  <div>
                    <div className="text-[22px] sm:text-[24px] font-bold text-bab-500">
                      {avgScore}
                    </div>
                    <div className="text-[13px] sm:text-[14px] text-babgray-600">평점</div>
                  </div>
                </div>
              </div>

              {/* 멤버십 가입
              <button className="flex bg-bab-500 hover:bg-bab-600 transition text-white w-full sm:w-[260px] rounded-full py-[10px] justify-center items-center gap-[8px] text-sm sm:text-base">
                <RiBardFill />
                VIP 멤버 가입하기
              </button> */}
            </div>

            {/* 오른쪽 프로필 카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* 기본정보 */}
              <div className="w-full px-[20px] sm:px-[35px] py-[25px] flex flex-col bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex flex-wrap mb-[25px] justify-between items-center gap-3">
                  <div className="text-babgray-900 text-[18px] font-bold">기본 정보</div>
                  <ButtonFillMd
                    onClick={() => navigate('/member/profile/edit')}
                    style={{ fontWeight: 400 }}
                  >
                    <RiEdit2Line />
                    편집
                  </ButtonFillMd>
                </div>
                <div className="flex flex-col pt-[30px] gap-[22px] text-[15px]">
                  <div className="flex justify-between flex-wrap text-babgray-600">
                    <div className="flex items-center gap-[10px]">
                      <RiUserLine />
                      닉네임
                    </div>
                    <div>{profileData?.nickname}</div>
                  </div>
                  <hr />
                  <div className="flex justify-between flex-wrap text-babgray-600">
                    <div className="flex items-center gap-[10px]">
                      <RiMailLine />
                      이메일
                    </div>
                    <div className="break-all">{user?.email}</div>
                  </div>
                  <hr />
                  <div className="flex justify-between flex-wrap text-babgray-600">
                    <div className="flex items-center gap-[10px]">
                      <RiPhoneLine />
                      전화번호
                    </div>
                    <div>{maskPhone(profileData?.phone)}</div>
                  </div>
                  <hr />
                  <div className="flex justify-between flex-wrap text-babgray-600">
                    <div className="flex items-center gap-[10px]">
                      <RiCalendarLine />
                      가입일
                    </div>
                    <div>{user?.created_at && new Date(user?.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* 관심사 */}
              <div className="w-full px-[20px] sm:px-[35px] py-[25px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-[25px]">
                  <div className="text-babgray-900 text-[18px] font-bold">관심사</div>
                  <ButtonFillMd onClick={() => navigate('/member/profile/interest')}>
                    <RiEdit2Line />
                    편집
                  </ButtonFillMd>
                </div>
                <div className="flex gap-[10px] flex-wrap mt-[12px] mb-[25px]">
                  {interests.length === 0 ? (
                    <span className="text-babgray-500 text-[13px]">
                      아직 선택된 관심사가 없어요
                    </span>
                  ) : (
                    interests.map(item => <CategoryBadge key={item} name={item} />)
                  )}
                </div>
                <p className="text-[13px] text-babgray-600">
                  관심사는 맛집 추천과 매칭에 활용됩니다
                </p>
              </div>

              {/* 결제수단 */}
              <div className="w-full px-[20px] sm:px-[35px] py-[25px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <div className="text-babgray-900 text-[18px] font-bold">등록된 결제수단</div>
                  <ButtonFillMd
                    onClick={() => setOpen(true)}
                    style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <RiEdit2Line />
                    등록하기
                  </ButtonFillMd>
                </div>

                {/* 결제수단들 */}
                <div className="flex flex-col gap-[10px] mt-[25px]">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center text-babgray-500 py-8 text-[14px]">
                      등록된 결제수단이 없습니다.
                    </div>
                  ) : (
                    paymentMethods.map(method => {
                      // 카드 브랜드별 아이콘 설정
                      const Icon = method.brand.toLowerCase().includes('visa')
                        ? RiVisaLine
                        : method.brand.toLowerCase().includes('master')
                          ? RiMastercardLine
                          : RiBankCard2Line; // fallback 아이콘 (은행 카드 형태)

                      return (
                        <div
                          key={method.id}
                          className="flex justify-between items-center border border-babgray-150 rounded-[12px] bg-white p-[20px] hover:shadow-sm transition"
                        >
                          <div className="flex gap-[10px] items-center">
                            <Icon className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
                            <div className="flex flex-col gap-[2px]">
                              <div className="flex items-center gap-[10px]">
                                <p className="text-babgray-700 font-medium">
                                  {method.brand}{' '}
                                  {method.number.length > 4
                                    ? '•••• ' + method.number.slice(-4)
                                    : method.number}
                                </p>
                                {method.is_default && <OrangeTag>기본 카드</OrangeTag>}
                              </div>
                              <p className="text-[13px] text-babgray-600">
                                {method.description || '등록된 카드'}{' '}
                                {method.expire && `• 만료: ${method.expire}`}
                              </p>
                            </div>
                          </div>

                          {/* 오른쪽 버튼들 */}
                          <div className="flex gap-[10px] text-babgray-500 items-center">
                            {!method.is_default && (
                              <button
                                onClick={() => setDefaultMethod(method)}
                                className="hover:text-bab-500 transition"
                              >
                                <GrayTag>기본 설정</GrayTag>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                openModal(
                                  '삭제',
                                  '선택하신 카드의 정보를 삭제하시겠습니까?',
                                  '취소',
                                  '삭제',
                                  () => {
                                    closeModal();
                                    removePaymentMethod(method.id);
                                  },
                                );
                              }}
                              className="hover:text-red-500 transition"
                              title="삭제"
                            >
                              <RiDeleteBinLine />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              {/* 나의 정보 */}
              <div className="w-full px-[20px] sm:px-[35px] py-[25px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div>
                  <div className="text-babgray-900 text-[18px] font-bold mb-[25px]">나의 정보</div>
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
                    to={'/member/profile/myreviews'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    내가 쓴 리뷰
                    <RiArrowRightSLine />
                  </Link>
                  <Link
                    to={'/member/profile/mywrite'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    내가 쓴 게시글
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
                    to={'/member/profile/helps'}
                    className="flex text-babgray-900 justify-between items-center border border-babgray-150 rounded-[12px] bg-bg-bg p-[20px]"
                  >
                    문의내역
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
              <div className="flex gap-2 justify-end lg:pb-[28px]">
                <div
                  onClick={handleSignout}
                  className="text-center justify-start text-babgray-400 text-base font-medium cursor-pointer"
                >
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
      <PaymentInputModal isOpen={open} onClose={() => setOpen(false)} onSubmit={handleAddPayment} />
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          closeButtonText={modal.closeText}
          contentText={modal.content}
          submitButtonText={modal.submitText}
          titleText={modal.title}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
}

export default ProfilePage;
