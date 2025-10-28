import { useCallback, useEffect, useState } from 'react';
import { RiRestaurantFill } from 'react-icons/ri';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../lib/supabase';
import type { Banner } from '../../types/bobType';
import { useNavigate } from 'react-router-dom';

import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import '../../css/buttonStyles.css';
import { findQuickMatchingCandidate, joinMatchingById } from '@/services/matchingService';

type Preview = Awaited<ReturnType<typeof findQuickMatchingCandidate>>;

const MainBanner = () => {
  const [bannerImgs, setBannerImgs] = useState<Banner[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { modal, closeModal, openModal } = useModal();
  const [preview, setPreview] = useState<Preview>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const PreviewContent = (
    <div className="space-y-3">
      {loadingPreview && <div className="text-sm text-babgray-600">매칭 정보를 불러오는 중…</div>}
      {!loadingPreview && !preview && (
        <div className="text-sm text-babgray-600">참여 가능한 매칭이 없습니다.</div>
      )}
      {preview && (
        <>
          <div className="text-base font-semibold">{preview.title ?? preview.restaurant?.name}</div>
          {preview.restaurant?.interest[0]?.name && (
            <div className="text-xs text-babgray-500">
              카테고리: {preview.restaurant.interest[0].name}
            </div>
          )}
          {preview.description && (
            <p className="text-sm text-babgray-700 line-clamp-3">{preview.description}</p>
          )}
          <div className="text-xs text-babgray-500">
            인원 {preview.participantCount}/{preview.desired_members}명 · 남은자리{' '}
            {preview.remaining}명
          </div>
        </>
      )}
    </div>
  );

  useEffect(() => {
    const getBannerData = async () => {
      try {
        const { data, error } = await supabase.from('banners').select('*');
        if (error) throw new Error(`배너 이미지를 불러오지 못했습니다. : ${error.message}`);
        setBannerImgs(data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getBannerData();
  }, []);
  const fetchPreview = useCallback(async () => {
    setLoadingPreview(true);
    try {
      const candidate = await findQuickMatchingCandidate();
      setPreview(candidate);
    } catch {
      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  const handleMatchingClick = useCallback(async () => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
        navigate('/member/login'),
      );
      return;
    }

    // 모달 먼저 열고
    setPreview(null);
    setLoadingPreview(true);
    openModal(
      '빠른매칭',
      PreviewContent, // 상태를 읽는 JSX
      '닫기',
      '참가하기',
      async () => {
        if (!preview) return;
        try {
          const res = await joinMatchingById(preview.id, user.id);
          if (res.success) {
            // navigate(`/member/matching/${preview.id}`);
          }
        } finally {
          closeModal();
        }
      },
    );

    // 그리고 바로 미리보기 로드
    await fetchPreview();
  }, [user, openModal, closeModal, navigate, PreviewContent, preview, fetchPreview]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const candidate = await findQuickMatchingCandidate();
        setPreview(candidate);
      } catch (e) {
        setPreview(null);
      } finally {
        setLoadingPreview(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="relative flex justify-center">
        <div className="w-full max-w-[1280px] h-[180px] sm:h-[240px] md:h-[300px] lg:h-[320px] rounded-b-[20px] bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">배너 로딩 중...</span>
        </div>
        <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-20 border-[10px] rounded-[50%] bg-white border-bg-bg ">
          <button
            className="flex flex-col items-center justify-center gap-3 
        w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] 
        bg-gradient-to-br from-bab-400 to-bab-600 
        text-white rounded-full shadow-md custom-btn"
          >
            <RiRestaurantFill size={40} className="sm:size-[48px]" />
            <span className="text-lg sm:text-xl md:text-2xl">빠른매칭</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      {/* 배너 Swiper */}
      <div
        className="w-full max-w-[1280px] h-[180px] sm:h-[240px] md:h-[300px] lg:h-[320px] rounded-b-[20px] overflow-hidden cursor-pointer"
        onClick={() => navigate('/member/events')}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          centeredSlides
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
        >
          {bannerImgs?.map(item => (
            <SwiperSlide key={item.id}>
              <img
                src={item.thumbnail_url}
                alt={item.alt || ''}
                className="w-full h-full object-cover rounded-b-[20px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 중앙 버튼 (하단 절반 걸치게) */}
      <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-20 border-[4px] rounded-[50%] bg-white border-bg-bg sm:border-[10px]">
        <button
          onClick={handleMatchingClick}
          className="flex flex-col items-center justify-center gap-3 
        w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] 
        bg-gradient-to-br from-bab-400 to-bab-600 
        text-white rounded-full shadow-md custom-btn"
        >
          <RiRestaurantFill size={40} className="sm:size-[48px]" />
          <span className="text-lg sm:text-xl md:text-2xl">빠른매칭</span>
        </button>
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
  );
};

export default MainBanner;
