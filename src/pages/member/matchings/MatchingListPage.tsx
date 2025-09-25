import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { RiArrowRightDoubleLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import MatchCard from '../../../components/MatchCard';
import { BlackTag, BrandTag, GrayTag } from '../../../ui/tag';
const demo = [
  {
    tags: [
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'babcategory-desserttext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '맛있는 도넛 먹으러 같이 가실 분!',
    description: '달달한 도넛 하나에 커피 한잔 하실분 계신가요~',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '5분 전',
  },
  {
    tags: [
      {
        label: '한식',
        bgClass: 'bg-babcategory-koreanbg',
        textClass: 'text-babcategory-koreantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '동성로에 있는 밥장인 가실분!',
    description: '뜨끈한 돼지찌개 한사바리 하러가실분',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '30분 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '매콤한 떡볶이 한그릇 하실분',
    description: '맛있는 떡볶이이 한그릇 하면서 땀쫌 빼러갈까요?',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '1시간 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '달달한 탕후루 먹을분 있나요?',
    description:
      '한쿸에 와서 korean 분식이 탕후류가 유명하다 들어쒀효~ 처음이라 같이가주실분 구해요!',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '3시간 전',
  },
  {
    tags: [
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'babcategory-desserttext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '맛있는 도넛 먹으러 같이 가실 분!',
    description: '달달한 도넛 하나에 커피 한잔 하실분 계신가요~',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '5분 전',
  },
  {
    tags: [
      {
        label: '한식',
        bgClass: 'bg-babcategory-koreanbg',
        textClass: 'text-babcategory-koreantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '동성로에 있는 밥장인 가실분!',
    description: '뜨끈한 돼지찌개 한사바리 하러가실분',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '30분 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '매콤한 떡볶이 한그릇 하실분',
    description: '맛있는 떡볶이이 한그릇 하면서 땀쫌 빼러갈까요?',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '1시간 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '달달한 탕후루 먹을분 있나요?',
    description:
      '한쿸에 와서 korean 분식이 탕후류가 유명하다 들어쒀효~ 처음이라 같이가주실분 구해요!',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '3시간 전',
  },
  {
    tags: [
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'babcategory-desserttext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '맛있는 도넛 먹으러 같이 가실 분!',
    description: '달달한 도넛 하나에 커피 한잔 하실분 계신가요~',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '5분 전',
  },
  {
    tags: [
      {
        label: '한식',
        bgClass: 'bg-babcategory-koreanbg',
        textClass: 'text-babcategory-koreantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '동성로에 있는 밥장인 가실분!',
    description: '뜨끈한 돼지찌개 한사바리 하러가실분',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '30분 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '매콤한 떡볶이 한그릇 하실분',
    description: '맛있는 떡볶이이 한그릇 하면서 땀쫌 빼러갈까요?',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '1시간 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '달달한 탕후루 먹을분 있나요?',
    description:
      '한쿸에 와서 korean 분식이 탕후류가 유명하다 들어쒀효~ 처음이라 같이가주실분 구해요!',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '3시간 전',
  },
  {
    tags: [
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'babcategory-desserttext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '맛있는 도넛 먹으러 같이 가실 분!',
    description: '달달한 도넛 하나에 커피 한잔 하실분 계신가요~',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '5분 전',
  },
  {
    tags: [
      {
        label: '한식',
        bgClass: 'bg-babcategory-koreanbg',
        textClass: 'text-babcategory-koreantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '동성로에 있는 밥장인 가실분!',
    description: '뜨끈한 돼지찌개 한사바리 하러가실분',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '30분 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '매콤한 떡볶이 한그릇 하실분',
    description: '맛있는 떡볶이이 한그릇 하면서 땀쫌 빼러갈까요?',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '1시간 전',
  },
  {
    tags: [
      {
        label: '분식',
        bgClass: 'bg-babcategory-kfoodbg',
        textClass: 'text-babcategory-kfoodtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '달달한 탕후루 먹을분 있나요?',
    description:
      '한쿸에 와서 korean 분식이 탕후류가 유명하다 들어쒀효~ 처음이라 같이가주실분 구해요!',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '3시간 전',
  },
  // 필요 시 더 추가
];

dayjs.extend(relativeTime);
dayjs.locale('ko');
const MatchingListPage = () => {
  // 검색어 상태
  const [search, setSearch] = useState('');

  // 페이지네이션 관련 상태
  // 현재 페이지에 보여줄 아이템들 (슬라이싱 결과)
  const [currentItems, setCurrentItems] = useState<typeof demo>([]);

  // 총 페이지 수
  const [pageCount, setPageCount] = useState(0);

  // 현재 잘라내기 시작할 아이템 인덱스 (offset)
  const [itemOffset, setItemOffset] = useState(0);

  // 현재 페이지 번호 (0부터 시작)
  const [currentPage, setCurrentPage] = useState(0);

  // 한 페이지에 보여줄 아이템 개수
  const itemsPerPage = 1;

  // 페이지네이션 블록 크기 (한 번에 보여줄 페이지 버튼 개수)
  const blockSize = 5;

  // 현재 몇 번째 블록에 있는지 계산
  // 예: currentPage=6, blockSize=5 → currentBlock=1 (즉 6~10페이지 블록)
  const currentBlock = Math.floor(currentPage / blockSize);

  // 현재 블록에서 시작 페이지 번호
  const startPage = currentBlock * blockSize;

  // 현재 블록에서 마지막 페이지 번호 (총 페이지 수를 넘지 않도록 Math.min)
  const endPage = Math.min(startPage + blockSize, pageCount);

  // 페이지 버튼 클릭 핸들러
  // e.selected : 클릭한 페이지 번호 (0부터 시작)
  const handlePageClick = (e: { selected: number }) => {
    setCurrentPage(e.selected); // 현재 페이지 업데이트
    // offset 재계산: 선택한 페이지 * itemsPerPage
    const newOffset = (e.selected * itemsPerPage) % demo.length;
    setItemOffset(newOffset);
  };

  // 실제로 currentItems 업데이트
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    // demo 배열에서 현재 페이지 범위에 해당하는 아이템만 자름
    setCurrentItems(demo.slice(itemOffset, endOffset));

    // 총 페이지 수 계산 (demo 전체 길이를 itemsPerPage로 나눔)
    setPageCount(Math.ceil(demo.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);
  return (
    <div className="w-full bg-bg-bg">
      <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">매칭게시판</p>
          <p className="text-babgray-600">매칭에 참여해보세요</p>
        </div>

        {/* 검색/필터 */}
        <div className="flex p-[24px] flex-col gap-[16px] rounded-[20px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
          <div className="flex w-full justify-between items-center gap-[16px]">
            <div
              onClick={() => document.getElementById('searchInput')?.focus()}
              className="flex w-full items-center pl-[20px] bg-white h-[55px] py-3 px-3 border border-s-babgray rounded-3xl"
            >
              <input
                id="searchInput"
                className="focus:outline-none w-full"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="맛집 이름이나 음식 종류로 검색하기"
              />
            </div>
            <div className="flex px-[30px] py-[20px] justify-center items-center bg-bab-500 rounded-[18px]">
              <RiSearchLine className=" text-white" />
            </div>
          </div>
          <div className="flex gap-[8px] justify-start ">
            <BrandTag>전체</BrandTag>
            <GrayTag>한식</GrayTag>
            <GrayTag>중식</GrayTag>
            <GrayTag>일식</GrayTag>
            <GrayTag>양식</GrayTag>
            <GrayTag>분식</GrayTag>
            <GrayTag>아시안</GrayTag>
            <GrayTag>인도</GrayTag>
            <GrayTag>멕시칸</GrayTag>
          </div>
          <div className="flex justify-start gap-[8px]">
            <BlackTag>최신순</BlackTag>
            <GrayTag>별점순</GrayTag>
            <GrayTag>리뷰순</GrayTag>
          </div>
        </div>

        {/* 리스트 */}
        <div className="w-full pt-[30px] pb-[50px]">
          <ul className="flex flex-col gap-x-[30px] gap-y-[24px] list-none p-0 m-0">
            {currentItems.map((item, index) => (
              <MatchCard key={index} {...item} />
            ))}
          </ul>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            {currentBlock > 0 && (
              <button
                className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                onClick={() => handlePageClick({ selected: 0 })}
              >
                <RiArrowRightDoubleLine className="transform rotate-180" />
              </button>
            )}
            {currentPage > 0 && (
              <button
                className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                onClick={() => handlePageClick({ selected: currentPage - 1 })}
              >
                <RiArrowRightSLine className="transform rotate-180" />
              </button>
            )}

            {Array.from({ length: endPage - startPage }, (_, i) => {
              const page = startPage + i;
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick({ selected: page })}
                  className={`flex justify-center items-center px-2 ${page === currentPage ? 'font-bold text-bab' : ''} rounded-md hover:bg-bab hover:text-white w-6 h-6`}
                >
                  {page + 1}
                </button>
              );
            })}

            {currentPage < pageCount - 1 && (
              <button
                className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                onClick={() => handlePageClick({ selected: currentPage + 1 })}
              >
                <RiArrowRightSLine />
              </button>
            )}
            {currentBlock < Math.floor((pageCount - 1) / blockSize) && (
              <button
                className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                onClick={() => handlePageClick({ selected: pageCount - 1 })}
              >
                <RiArrowRightDoubleLine />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingListPage;
