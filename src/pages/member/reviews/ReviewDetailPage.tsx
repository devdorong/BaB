import {
  RiMapPinLine,
  RiStarFill,
  RiHeart3Line,
  RiShareLine,
  RiPhoneLine,
  RiNavigationLine,
  RiChatSmile3Line,
  RiArrowLeftLine,
} from 'react-icons/ri';
import ReviewItem from '../../../components/member/ReviewItem';
import { ItalianFood } from '../../../ui/tag';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ButtonFillLG, ButtonLineLg } from '../../../ui/button';
import InfoSection from '../../../components/member/InfoSection';
import WriteReview from '../../../components/member/WriteReview';

type TabKey = 'review' | 'info';

function ReviewDetailPage() {
  const navigate = useNavigate();
  const [writeOpen, setWriteOpen] = useState(false);

  const goBack = () => {
    if (window.history && window.history.length > 1) navigate(-1);
    else navigate('/'); // 히스토리 없을 때 대체 경로
  };

  const [tab, setTab] = useState<TabKey>('review');

  const base = 'group relative px-4 py-2 pb-3 transition-colors outline-none';
  const active = 'text-bab-500';
  const inactive = 'text-babgray-600 hover:text-bab-500 focus-visible:text-bab-500';

  const underlineClass = (isActive: boolean) =>
    [
      'pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0',
      'h-[1px] w-full max-w-[112px] rounded-full transition-opacity',
      isActive ? 'bg-bab-500 opacity-100' : 'opacity-0',
      // 포커스일 때만 나타남 (호버는 아님)
      'group-focus-visible:opacity-100 group-focus-visible:bg-bab-500',
    ].join(' ');

  return (
    <div className="w-full">
      <div className="max-w-[1280px] mx-auto py-[50px]">
        {/* 가게사진 */}
        <section className="relative rounded-3xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={goBack}
            aria-label="뒤로 가기"
            className="absolute left-4 top-4 z-10 w-10 h-10 rounded-full
                       bg-white/95 backdrop-blur border border-black/10
                       shadow-[0_4px_4px_rgba(0,0,0,0.02)]
                       inline-flex items-center justify-center
                       hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <RiArrowLeftLine className="text-[18px]" />
          </button>
          <img src="/sample.jpg" alt="가게 사진" className="w-full h-[400px] object-cover" />

          {/* 헤더 정보 박스 */}
          <div className="px-5 py-4 md:px-8 md:py-6 bg-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex item-center justify-center gap-[14px] mb-[4px]">
                <h1 className="text-[30px] font-semibold ">미슐랭 파스타 하우스</h1>
                <ItalianFood />
              </div>
              <div className="flex items-center gap-2 text-babgray-700">
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5">
                  <RiHeart3Line className="text-[18px]" />
                </button>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5">
                  <RiShareLine className="text-[18px]" />
                </button>
              </div>
            </div>

            {/* 평점/리뷰/거리 */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-babgray-700">
              <div className="flex items-center gap-1">
                <RiStarFill className="text-[#FACC15] text-[16px]" />
                <span className="text-[16px]">4.8</span>
                <span className="text-[16px]">리뷰 586개</span>
              </div>
              <div className="flex items-center gap-1">
                <RiMapPinLine className="text-[#FF5722] text-[18px]" />
                <span className="text-[14px]">종로구 인사동 · 2.3km</span>
              </div>
            </div>

            {/* 한 줄 소개 */}
            <p className="my-4 text-[16px] text-babgray-600 line-clamp-2">
              매일 뽑아 바로 삶아내는 생면 위에 트러플과 버터, 파르미지아노의 균형을 정교하게 맞춘
              크림 소스부터 산미가 살아 있는 토마토, 향긋한 오일 파스타까지, 와인 한 잔과 함께
              코스처럼 즐길 수 있는 도심 속 미슐랭 감성 파스타바.
            </p>

            {/* 액션 버튼들 */}
            <div className="mt-4 flex flex-wrap gap-5">
              <ButtonFillLG
                style={{ fontWeight: 500, borderRadius: '24px' }}
                onClick={() => setWriteOpen(true)}
              >
                리뷰 작성하기
              </ButtonFillLG>
              <ButtonLineLg style={{ fontWeight: 500, borderRadius: '24px' }}>
                전화하기
              </ButtonLineLg>
              <ButtonLineLg style={{ fontWeight: 500, borderRadius: '24px' }}>길찾기</ButtonLineLg>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <nav
          className="mt-6 flex items-center gap-3 border-b border-babgray-150"
          role="tablist"
          aria-label="상세 탭"
        >
          {/* 리뷰 */}
          <button
            role="tab"
            aria-selected={tab === 'review'}
            onClick={() => setTab('review')}
            className={`${base} ${tab === 'review' ? active : inactive}`}
          >
            <div className="flex gap-2">
              리뷰
              <div>526</div>
            </div>
            <span className={underlineClass(tab === 'review')} />
          </button>

          {/* 정보 */}
          <button
            role="tab"
            aria-selected={tab === 'info'}
            onClick={() => setTab('info')}
            className={`${base} ${tab === 'info' ? active : inactive}`}
          >
            정보
            <span className={underlineClass(tab === 'info')} />
          </button>
        </nav>

        {/* 탭 콘텐츠 */}
        {tab === 'review' ? (
          <section className="mt-10 space-y-4">
            {[1, 2, 3].map(i => (
              <ReviewItem key={i} />
            ))}
          </section>
        ) : (
          <InfoSection />
        )}
      </div>
      <WriteReview
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        onSubmit={data => {
          console.log('리뷰 제출', data);
        }}
      />
    </div>
  );
}

export default ReviewDetailPage;
