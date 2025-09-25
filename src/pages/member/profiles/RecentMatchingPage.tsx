import { useState } from 'react';
import { RiCalendarLine, RiHistoryLine, RiStarFill, RiStarLine } from 'react-icons/ri';
import YetMatchingRecordItem from '../../../components/member/YetMatchingRecordItem';
import RecentMatchingRecordItem from '../../../components/member/RecentMatchingRecordItem';

type TabKey = 'recent' | 'yet';

function RecentMatchingPage() {
  const [tab, setTab] = useState<TabKey>('yet');

  const base = 'group relative px-4 py-2 pb-3 transition-colors outline-none';
  const active = 'text-bab-500';
  const inactive = 'text-babgray-600 hover:text-bab-500 focus-visible:text-bab-500';

  const underlineClass = (isActive: boolean) =>
    [
      'pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0',
      'h-[1px] w-full max-w-[152px] rounded-full transition-opacity',
      isActive ? 'bg-bab-500 opacity-100' : 'opacity-0',
      // 포커스일 때만 나타남 (호버는 아님)
      'group-focus-visible:opacity-100 group-focus-visible:bg-bab-500',
    ].join(' ');

  return (
    <div id="root" className="min-h-screen bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">최근 매칭 기록</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div>
                  <p className="text-[16px] font-bold pb-[15px]">매칭 통계</p>
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#DCFCE7]">
                      <div className="text-[22px] font-bold text-babbutton-green">12</div>
                      <div className="text-[13px] text-babgray-500">총 매칭</div>
                    </div>
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#DBEAFE]">
                      <div className="text-[22px] font-bold text-babbutton-blue">9</div>
                      <div className="text-[13px] text-babgray-500">성공한 매칭</div>
                    </div>
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#FFF2EE]">
                      <div className="text-[22px] font-bold text-bab-500">75%</div>
                      <div className="text-[13px] text-babgray-500">성공률</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col w-full">
                  <p className="text-[16px] font-bold">평균 평점</p>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[#FACC15]  py-[15px] text-[28px] font-bold">4.4</span>
                    <div className="flex p-[10px] items-center">
                      <div className="flex items-center gap-[5px] ">
                        <div className="flex text-[#FACC15] gap-[1px]">
                          <RiStarFill />
                          <RiStarFill />
                          <RiStarFill />
                          <RiStarFill />
                          <RiStarLine />
                        </div>
                        <p className="text-[13px] text-babgray-700">(4.4)</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-babgray-700">9개의 평가기준</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-[50px]">
              <section className="w-full px-[25px] py-[15px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                {/* 카테고리 */}
                <nav
                  className="flex items-center gap-3 border-b border-babgray-150"
                  role="tablist"
                  aria-label="상세 탭"
                >
                  {/* 리뷰 */}
                  <button
                    role="tab"
                    aria-selected={tab === 'recent'}
                    onClick={() => setTab('recent')}
                    className={`${base} ${tab === 'recent' ? active : inactive}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RiHistoryLine />
                      최근 매칭
                      <div>(5)</div>
                    </div>
                    <span className={underlineClass(tab === 'recent')} />
                  </button>

                  {/* 정보 */}
                  <button
                    role="tab"
                    aria-selected={tab === 'yet'}
                    onClick={() => setTab('yet')}
                    className={`${base} ${tab === 'yet' ? active : inactive}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RiCalendarLine />
                      예정된 매칭
                      <div>(5)</div>
                    </div>
                    <span className={underlineClass(tab === 'yet')} />
                  </button>
                </nav>
              </section>

              {/* 탭 콘텐츠 */}
              {tab === 'recent' ? (
                <section className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <RecentMatchingRecordItem key={i} />
                  ))}
                </section>
              ) : (
                <section className="space-y-4">
                  {[1, 2].map(i => (
                    <YetMatchingRecordItem key={i} />
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentMatchingPage;
