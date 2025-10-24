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
import type { Matchings, Payment_methods, Profile } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import { Cafe, ChineseFood, GrayTag, Indoor, KFood, OrangeTag } from '../../../ui/tag';
import { usePoint } from '../../../contexts/PointContext';
import { supabase } from '../../../lib/supabase';
import { fetchCurrentProfileInterests } from '../../../lib/interests';
import { Divider } from 'antd';
import CategoryBadge from '../../../ui/jy/CategoryBadge';
import { fetchMyReviewData, type MyReviewData } from '../../../lib/myreviews';
import {
  checkFavoriteRest,
  fetchFavoriteRestaurants,
  fetchRestaurantDetailId,
  getAvgMyRatingScore,
  getFavoriteCount,
  getMyFavoritesCount,
  type RestaurantsDetailType,
  type RestaurantsType,
  type RestaurantTypeRatingAvg,
} from '../../../lib/restaurants';
import { getUserMatchings } from '@/services/matchingService';
import { PaymentMethodModal } from '@/components/payment/PaymentInputModal';
import {
  deletePaymentMethod,
  fetchPaymentMethods,
  insertPaymentMethod,
  updatePaymentMethod,
} from '@/services/myPaymentService';
import { useModal } from '@/ui/sdj/ModalState';
import Modal from '@/ui/sdj/Modal';

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { refreshPoint } = usePoint();
  const { closeModal, modal, openModal, x } = useModal();
  // 네비게이터
  const navigate = useNavigate();
  const { point } = usePoint();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [paymentMethods, setPaymentMethods] = useState<Payment_methods[]>([]);

  const loadPaymentMethods = async () => {
    if (!user?.id) return;

    try {
      const data = await fetchPaymentMethods(user.id);
      setPaymentMethods(data);
    } catch (error) {
      console.error('결제수단 불러오기 실패:', error);
    }
  };
  useEffect(() => {
    loadPaymentMethods();
  }, [user?.id]);

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

  // 결제수단 등록 핸들러 (수정)
  const handlePaymentSubmit = async (paymentData: {
    number: string;
    expire: string;
    cvv: string;
    card_holder: string;
    brand: string;
    description: string;
  }) => {
    try {
      if (!user?.id) {
        openModal('로그인', '로그인이 필요합니다.', '닫기', '', () => closeModal());

        return;
      }

      // 첫 번째 카드면 기본 카드로 설정
      const isFirstCard = paymentMethods.length === 0;

      await insertPaymentMethod({
        profile_id: user.id,
        brand: paymentData.brand,
        number: paymentData.number,
        expire: paymentData.expire,
        is_default: isFirstCard,
        description: paymentData.description || null,
      });
      openModal('결제수단', '결제수단이 등록되었습니다!', '', '확인', () => closeModal());
      // alert('결제수단이 등록되었습니다!');
      setIsModalOpen(false);

      // 목록 새로고침
      await loadPaymentMethods();
    } catch (error) {
      console.error('결제수단 등록 실패:', error);
      openModal('결제수단', '결제수단 등록에 실패했습니다.', '닫기', '', () => closeModal());
      // alert('결제수단 등록에 실패했습니다.');
    }
  };

  // 결제수단 삭제
  const handleDeletePayment = async (id: number) => {
    // if (!confirm('이 결제수단을 삭제하시겠습니까?')) return;
    openModal(
      '결제수단',
      '이 결제수단을 삭제하시겠습니까?',
      '취소',
      '삭제',
      // 삭제시
      async () => {
        try {
          await deletePaymentMethod(id);
          openModal('결제수단', '결제수단이 삭제되었습니다.', '', '확인', () => closeModal());
          // alert('결제수단이 삭제되었습니다.');
          await loadPaymentMethods();
        } catch (error) {
          console.error('결제수단 삭제 실패:', error);
          openModal('결제수단', '결제수단 삭제에 실패했습니다.', '닫기', '', () => closeModal());
          // alert('결제수단 삭제에 실패했습니다.');
        }
      },
      // 취소시
      () => {
        return;
      },
    );
  };

  // 기본 카드 설정
  const handleSetDefaultPayment = async (id: number) => {
    try {
      // 기존 기본 카드들 해제
      for (const method of paymentMethods) {
        if (method.is_default) {
          await updatePaymentMethod(method.id, { is_default: false });
        }
      }

      // 새로운 기본 카드 설정
      await updatePaymentMethod(id, { is_default: true });
      openModal('결제수단', '기본 카드로 설정되었습니다.', '', '확인', () => closeModal());
      // alert('기본 카드로 설정되었습니다.');
      await loadPaymentMethods();
    } catch (error) {
      console.error('기본 카드 설정 실패:', error);

      openModal('결제수단', '기본 카드 설정에 실패했습니다.', '닫기', '', () => closeModal());
      // alert('기본 카드 설정에 실패했습니다.');
    }
  };

  // 카드번호 마스킹 (마지막 4자리만 표시)
  const maskCardNumber = (number: string) => {
    if (!number || number.length < 4) return '•••• •••• •••• ••••';
    const last4 = number.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  // 카드 브랜드별 아이콘 반환
  const getCardIcon = (brand: string) => {
    const brandUpper = brand.toUpperCase();
    if (brandUpper.includes('VISA'))
      return (
        <RiVisaLine className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
      );
    if (brandUpper.includes('MASTER'))
      return (
        <RiMastercardLine className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
      );
    return (
      <RiMastercardLine className="rounded-[8px] bg-babgray-100 w-[48px] h-[48px] p-[12px] justify-center items-center aspect-square" />
    );
  };

  // 로그아웃 처리
  const handleLogout = () => {
    signOut();
    navigate('/member');
  };

  if (!user) {
    setTimeout(() => navigate('/member'), 0);
  }

  return (
    <div className="flex bg-bg-bg min-h-screen justify-center">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        {/* 헤더 */}
        <div className="flex py-[15px]">
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
                <div className="flex flex-wrap justify-between items-center gap-3">
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
                <div className="flex justify-between items-center">
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
              <div className="inline-flex w-full px-[35px] py-[25px] gap-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <div className="text-babgray-900 text-[18px] font-bold">등록된 결제수단</div>
                  <ButtonFillMd
                    style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <RiEdit2Line />
                    등록하기
                  </ButtonFillMd>
                </div>

                <div className="flex flex-col gap-[10px]">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-10 text-babgray-500">
                      등록된 결제수단이 없습니다.
                    </div>
                  ) : (
                    paymentMethods.map(method => (
                      <div
                        key={method.id}
                        className="flex justify-between items-center border border-babgray-150 rounded-[12px] bg-white p-[20px]"
                      >
                        <div className="flex gap-[10px] items-center">
                          {getCardIcon(method.brand)}
                          <div className="flex flex-col gap-[2px]">
                            <div className="flex items-center gap-[10px]">
                              <p className="text-babgray-700">
                                {method.brand} {maskCardNumber(method.number)}
                              </p>
                              {method.is_default && <OrangeTag>기본 카드</OrangeTag>}
                            </div>
                            <p className="text-[13px] text-babgray-600">
                              {method.description || '카드'} • 만료: {method.expire}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-[10px] text-babgray-500 items-center">
                          {!method.is_default && (
                            <button onClick={() => handleSetDefaultPayment(method.id)}>
                              <GrayTag>기본 설정</GrayTag>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayment(method.id)}
                            className="hover:text-red-500"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 모달 */}
              <PaymentMethodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handlePaymentSubmit}
              />
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
                    문의 내용
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
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
          onX={x}
        />
      )}
    </div>
  );
}

export default ProfilePage;
