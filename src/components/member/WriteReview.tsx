import React, { useEffect, useRef, useState } from 'react';
import { RiCloseFill, RiImage2Line } from 'react-icons/ri';
import { StarScore } from '../../ui/jy/StarScore';
import {
  fetchRestaurantDetailId,
  fetchRestaurantReviews,
  type RestaurantsDetailType,
  type ReviewWithPhotos,
} from '../../lib/restaurants';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../lib/propile';
import type { Profile } from '../../types/bobType';
import { insertReview } from '../../services/RestReviewService';
import { supabase } from '../../lib/supabase';
import { giveReviewPoint } from '../../services/PointService';

type Props = {
  restaurantId: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit?: (data: {
    food: number;
    service: number;
    mood: number;
    content: string;
    files: File[];
  }) => void;
};

function WriteReview({ open, onClose, onSubmit, onSuccess, restaurantId }: Props) {
  const { user } = useAuth();
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [mood, setMood] = useState(0);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [reviews, setReviews] = useState<ReviewWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantsDetailType | null>(null);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const review = await fetchRestaurantReviews(restaurantId);
      setReviews(review);
      setLoading(false);
    };
    loadReviews();
  }, [restaurantId]);

  useEffect(() => {
    if (!id) return;

    const loadRestaurant = async () => {
      const data = await fetchRestaurantDetailId(id);
      setRestaurant(data);
    };
    loadRestaurant();
  }, [id]);

  // 리셋 함수
  const resetReview = () => {
    setFood(0);
    setService(0);
    setMood(0);
    setContent('');
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = open ? 'hidden' : '';
      return () => {
        document.body.style.overflow = prev;
      };
    } else {
      // 닫히면 폼 초기화
      resetReview();
    }
  }, [open]);

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const next = [...files, ...selected].slice(0, 4); // 최대 4장
    setFiles(next);
    e.target.value = '';
  };

  const removeAt = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!user) {
      return;
    }

    try {
      await giveReviewPoint();
      console.log('리뷰 작성 포인트 지급 완료');
      alert('리뷰가 등록되었습니다!');
    } catch (err) {
      console.error('리뷰 등록 중 오류:', err);
    }

    const success = await insertReview({
      restaurantId,
      profileId: user.id,
      content,
      rating_food: food,
      files,
    });

    if (success) {
      resetReview();
      onClose();
      onSuccess?.();
    } else {
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-[500px] max-w-[92vw] rounded-2xl bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
        {/* 헤더 */}
        <div className="relative px-6 py-4 border-b border-black/10">
          <h2 className="text-center text-[18px] font-semibold">{restaurant?.name}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-3 top-3 p-2 rounded-full hover:bg-black/5"
          >
            <RiCloseFill className="text-[22px]" />
          </button>
        </div>

        {/* 바디 */}
        <div className="px-6 py-5">
          {/* 작성자 라인 (목업) */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
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
            <div className="text-sm text-babgray-700">
              {profileData?.nickname} ·{' '}
              <span className="text-babgray-500">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <hr />
          <br />
          {/* 별점 */}
          <div className="text-babgray-600 space-y-4 mb-6">
            <StarScore label="만족도" value={food} onChange={setFood} />
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <textarea
              rows={5}
              value={content}
              maxLength={500}
              onChange={e => setContent(e.target.value)}
              placeholder="이곳에 다녀온 경험을 자세히 공유해 주세요."
              className="w-full resize-none rounded-xl border border-black/10 outline-none
                         px-4 py-3 text-[14px] placeholder:text-babgray-400
                         focus:border-bab-500"
            />
            <div className="text-right text-xs text-babgray-500 mt-1">{content.length}/500</div>
          </div>

          {/* 이미지 업로드 - 왼쪽부터 채우기 (4칸 고정) */}
          <div className="mb-2 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => {
              // 1) 업로드된 파일 → 썸네일 (테두리 없음)
              if (files[idx]) {
                const url = URL.createObjectURL(files[idx]);
                return (
                  <div
                    key={`thumb-${idx}`}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      onClick={() => removeAt(idx)}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                  </div>
                );
              }

              // 2) 다음 빈 칸 → 업로드 버튼 (테두리 있음)
              if (idx === files.length) {
                return (
                  <button
                    key="uploader"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border border-black/10 bg-babgray-50
                     flex items-center justify-center hover:bg-babgray-100
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bab-500"
                  >
                    <RiImage2Line className="text-[28px] text-babgray-400" />
                  </button>
                );
              }

              // 3) 남은 칸 → 빈 자리(레이아웃 유지, 테두리 없음)
              return (
                <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-transparent" />
              );
            })}
          </div>
          <div className="text-right text-xs pb-3 text-babgray-500">{files.length}/4</div>

          {/* 액션 */}
          <div className="pt-3 pb-2">
            <button
              onClick={submit}
              className="w-full h-12 rounded-xl bg-bab-500 text-white font-semibold
                         shadow-[0_4px_4px_rgba(0,0,0,0.02)] disabled:opacity-50"
              disabled={food === 0 || !content.trim()}
            >
              등록하기
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handlePickFiles}
        />
      </div>
    </div>
  );
}

export default WriteReview;
