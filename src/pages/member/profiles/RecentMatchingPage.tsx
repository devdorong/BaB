import { useEffect, useState } from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiHistoryLine,
  RiStarFill,
  RiStarLine,
} from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import RecentMatchingRecordItem from '../../../components/member/RecentMatchingRecordItem';
import YetMatchingRecordItem from '../../../components/member/YetMatchingRecordItem';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserMatchings } from '../../../services/matchingService';
import type { Matchings } from '../../../types/bobType';

type TabKey = 'recent' | 'yet';

function RecentMatchingPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') === 'recent' ? 'recent' : 'yet';
  const [tab, setTab] = useState<TabKey>(defaultTab as TabKey);

  const navigate = useNavigate();
  const { user } = useAuth();
  const [matchings, setMatchings] = useState<Matchings[]>([]);
  const [endMatchings, setEndMatchings] = useState<Matchings[]>([]);
  const [expectedMatchings, setExpectedMatchings] = useState<Matchings[]>([]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 예정된 매칭
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = expectedMatchings.slice(startIdx, endIdx);
  const totalPages = Math.ceil(expectedMatchings.length / itemsPerPage);

  // 완료된 매칭
  const currentEndItems = endMatchings.slice(startIdx, endIdx);
  const totalEndPages = Math.ceil(endMatchings.length / itemsPerPage);

  useEffect(() => {
    const fetchUserMatchings = async () => {
      if (!user) return;

      try {
        const userMatchings = await getUserMatchings(user.id);
        const endMatching = userMatchings.filter(
          item => item.status === 'cancel' || item.status === 'completed',
        );
        const expectedMatching = userMatchings.filter(
          item => item.status === 'waiting' || item.status === 'full',
        );
        // console.log('사용자 매칭:', userMatchings);
        // console.log('종료된 매칭:', endMatching);
        // console.log('예정된 매칭:', expectedMatching);
        setMatchings(userMatchings);
        setEndMatchings(endMatching);
        setExpectedMatchings(expectedMatching);
      } catch (err) {
        console.error('매칭 불러오기 실패:', err);
      }
    };

    fetchUserMatchings();
  }, [user]);
  const total = matchings.length;
  const completed = endMatchings.filter(item => item.status === 'completed').length;

  // 퍼센트 계산 (소수점 제거)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

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
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg">
      {/* 메인 컨테이너 */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
          {/* 프로필 헤더 링크 */}
          <div className="hidden lg:flex sm:text-base items-center py-[15px]">
            <div
              onClick={() => navigate('/member/profile')}
              className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
            >
              프로필
            </div>
            <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
              <RiArrowRightSLine />
            </div>{' '}
            <div className="text-bab-500 text-[17px]">최근 매칭 기록</div>
          </div>
          <div className="mt-6 mb-14">
            <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 items-start">
              {/* 왼쪽 프로필 카드 */}
              <div className="flex flex-col w-full gap-5 items-center justify-center lg:w-[300px] ">
                <div className="inline-flex w-full bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] p-6 flex-col items-center lg:w-[260px]">
                  <div className="flex flex-col w-full">
                    <p className="text-[16px] font-bold pb-[15px]">매칭 통계</p>
                    <div className="flex lg:flex-col gap-[15px]">
                      <div className="gap-0.5 flex flex-col rounded-[12px] flex-1 lg:w-full py-[16px] justify-center items-center bg-[#DCFCE7]">
                        <div className="text-[18px] lg:text-[22px] font-bold text-babbutton-green">
                          {matchings.length}
                        </div>
                        <div className="text-[11px] lg:text-[13px] text-babgray-500">총 매칭</div>
                      </div>
                      <div className="gap-0.5 flex flex-col rounded-[12px] flex-1 lg:w-full py-[16px] justify-center items-center bg-[#DBEAFE]">
                        <div className="text-[18px] lg:text-[22px] font-bold text-babbutton-blue">
                          {endMatchings.filter(item => item.status === 'completed').length}
                        </div>
                        <div className="text-[11px] lg:text-[13px] text-babgray-500">
                          성공한 매칭
                        </div>
                      </div>
                      <div className="gap-0.5 flex flex-col rounded-[12px] flex-1 lg:w-full py-[16px] justify-center items-center bg-[#FFF2EE]">
                        <div className="text-[18px] lg:text-[22px] font-bold text-bab-500">
                          {percent}%
                        </div>
                        <div className="text-[11px] lg:text-[13px] text-babgray-500">성공률</div>
                      </div>
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
                        <div>({endMatchings.length})</div>
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
                        <div>({expectedMatchings.length})</div>
                      </div>
                      <span className={underlineClass(tab === 'yet')} />
                    </button>
                  </nav>
                </section>

                {/* 탭 콘텐츠 */}
                {tab === 'recent' ? (
                  <section className="space-y-4">
                    {currentEndItems.length > 0 ? (
                      <>
                        {currentEndItems.map(i => (
                          <RecentMatchingRecordItem key={i.id} endMatching={i} />
                        ))}

                        <div className="flex justify-center gap-2 !mt-10">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            className="p-2  bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                          >
                            <RiArrowLeftSLine size={16} />
                          </button>

                          {Array.from({ length: totalEndPages }).map((_, idx) => (
                            <button
                              key={idx + 1}
                              onClick={() => setCurrentPage(idx + 1)}
                              className={`p-2 py-0 rounded hover:bg-bab hover:text-white ${
                                currentPage === idx + 1 ? 'text-bab' : 'bg-bg-bg'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}

                          <button
                            disabled={currentPage === totalEndPages}
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalEndPages))}
                            className="p-2 bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                          >
                            <RiArrowRightSLine size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <section className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.05)]">
                        <div className="h-[200px] flex text-gray-600 justify-center items-center w-full py-5">
                          최근 매칭 기록이 없습니다.
                        </div>
                      </section>
                    )}
                  </section>
                ) : (
                  <section className="space-y-4">
                    {currentItems.length > 0 ? (
                      <>
                        {currentItems.map(i => (
                          <YetMatchingRecordItem key={i.id} matching={i} />
                        ))}

                        <div className="flex justify-center gap-2 !mt-10">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            className="p-2  bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                          >
                            <RiArrowLeftSLine size={16} />
                          </button>

                          {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                              key={idx + 1}
                              onClick={() => setCurrentPage(idx + 1)}
                              className={`p-2 py-0 rounded hover:bg-bab hover:text-white ${
                                currentPage === idx + 1 ? 'text-bab' : 'bg-bg-bg'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}

                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            className="p-2 bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                          >
                            <RiArrowRightSLine size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <section className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.05)]">
                        <div className="h-[200px] flex text-gray-600 justify-center items-center w-full py-5">
                          예정된 매칭 기록이 없습니다.
                        </div>
                      </section>
                    )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentMatchingPage;
