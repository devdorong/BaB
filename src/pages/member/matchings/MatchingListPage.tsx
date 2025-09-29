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
    title: '따뜻한 김치찌개 같이 드실 분 구해요!',
    description:
      '오늘같이 쌀쌀한 날씨에 얼큰한 김치찌개가 너무 땡겨요. 2인분 이상 주문해야 해서 혼자 먹기 아쉬운데 같이 드실 분 계시면 좋겠습니다. 밥도 든든하게 나와요.',
    distanceKm: 0.7,
    area: '동성로',
    timeAgo: '5분 전',
  },
  {
    tags: [
      {
        label: '중식',
        bgClass: 'bg-babcategory-chinesebg',
        textClass: 'text-babcategory-chinesetext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '짜장면+탕수육 세트 나눠 드실 분!',
    description:
      '탕수육은 혼자 먹기엔 양이 많아서 같이 주문할 분을 찾아요. 짜장면도 세트로 같이 시키면 훨씬 저렴하더라고요. 동성로 근처 야외 테이블에서 먹으면 좋을 것 같아요.',
    distanceKm: 1.1,
    area: '동성로',
    timeAgo: '12분 전',
  },
  {
    tags: [
      {
        label: '일식',
        bgClass: 'bg-babcategory-japanesbg',
        textClass: 'text-babcategory-japanestext',
      },
      {
        label: '루프탑',
        bgClass: 'bg-babcategory-rooftopbg',
        textClass: 'text-babcategory-rooftoptext',
      },
    ],
    title: '초밥 모둠 세트 같이 드실 분 구합니다',
    description:
      '초밥 세트는 항상 혼자 먹기 벅차서 같이 먹을 분을 찾고 있어요. 특히 오늘은 날씨도 좋아서 루프탑 자리에서 먹으면 분위기도 살고 더 맛있을 것 같네요.',
    distanceKm: 0.9,
    area: '동성로',
    timeAgo: '20분 전',
  },
  {
    tags: [
      {
        label: '이탈리안',
        bgClass: 'bg-babcategory-italianbg',
        textClass: 'text-babcategory-italiantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '파스타+피자 세트 나눠 드실 분!',
    description:
      '오늘 저녁에 동성로 이탈리안 레스토랑 가려는데 파스타와 피자 세트가 2인 기준이라 혼자 가기 어려워서 같이 드실 분 구합니다. 분위기도 좋고 맛도 보장돼요!',
    distanceKm: 1.4,
    area: '동성로',
    timeAgo: '35분 전',
  },
  {
    tags: [
      { label: '카페', bgClass: 'bg-babcategory-cafebg', textClass: 'text-babcategory-cafetext' },
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'text-babcategory-desserttext',
      },
    ],
    title: '케이크 세트 같이 나눠 드실 분 있나요?',
    description:
      '디저트 카페에서 판매하는 케이크 세트는 항상 양이 많아서 혼자 먹기엔 부담스럽네요. 달콤한 케이크에 아메리카노 한 잔 곁들이면 최고의 조합일 것 같아요!',
    distanceKm: 0.5,
    area: '동성로',
    timeAgo: '1시간 전',
  },
  {
    tags: [
      {
        label: '멕시칸',
        bgClass: 'bg-babcategory-mexicanbg',
        textClass: 'text-babcategory-mexicantext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '타코 플래터 같이 드실 분!',
    description:
      '동성로 멕시칸 레스토랑에서 타코 플래터 주문하려고 하는데 혼자 먹기엔 너무 많아요. 옥수수 토르티야와 다양한 소스까지 푸짐하게 나와서 같이 먹으면 딱이에요.',
    distanceKm: 1.8,
    area: '동성로',
    timeAgo: '1시간 15분 전',
  },
  {
    tags: [
      {
        label: '인도식',
        bgClass: 'bg-babcategory-indianbg',
        textClass: 'text-babcategory-indiantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '커리 세트 같이 드실 분',
    description:
      '인도 커리와 난 세트를 시키려는데 혼자서는 여러 종류 맛보기 힘들잖아요. 다양한 커리와 난, 라씨까지 곁들이면 푸짐하게 즐길 수 있어서 같이 먹을 분 찾습니다!',
    distanceKm: 0.6,
    area: '동성로',
    timeAgo: '1시간 40분 전',
  },
  {
    tags: [
      {
        label: '아시안',
        bgClass: 'bg-babcategory-asianbg',
        textClass: 'text-babcategory-asiantext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '쌀국수와 반미 같이 드실래요?',
    description:
      '동남아 음식이 땡겨서 쌀국수와 반미를 주문하려고 해요. 혼자서는 종류를 다양하게 맛보기 힘든데 같이 드시면 여러 메뉴 나눠서 먹을 수 있어서 좋아요.',
    distanceKm: 1.3,
    area: '동성로',
    timeAgo: '2시간 전',
  },
  {
    tags: [
      {
        label: '주류',
        bgClass: 'bg-babcategory-alcoholbg',
        textClass: 'text-babcategory-alcoholtext',
      },
      {
        label: '루프탑',
        bgClass: 'bg-babcategory-rooftopbg',
        textClass: 'text-babcategory-rooftoptext',
      },
    ],
    title: '와인 한 병 같이 나눠 드실 분?',
    description:
      '분위기 좋은 루프탑 바에서 와인 한 병 시켜놓고 안주와 함께 나눠 먹으면 좋을 것 같아요. 혼자서 한 병은 무리라서 같이 즐기실 분 찾습니다!',
    distanceKm: 2.0,
    area: '동성로',
    timeAgo: '2시간 20분 전',
  },
  {
    tags: [
      { label: '카페', bgClass: 'bg-babcategory-cafebg', textClass: 'text-babcategory-cafetext' },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '아이스 아메리카노 1+1 같이 드실 분',
    description:
      '카페 이벤트로 아이스 아메리카노 1+1 쿠폰이 있는데 혼자라서 같이 쓰실 분을 구해요. 깔끔하게 나눠 마시면 더 저렴하게 즐길 수 있을 것 같아요.',
    distanceKm: 0.4,
    area: '동성로',
    timeAgo: '3시간 전',
  },
  {
    tags: [
      {
        label: '한식',
        bgClass: 'bg-babcategory-koreanbg',
        textClass: 'text-babcategory-koreantext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '삼겹살 2인분 같이 구워 드실 분',
    description:
      '고기집에서 혼자 삼겹살 2인분 시키긴 많고, 그렇다고 1인분만 먹기엔 아쉬워요. 상추에 쌈 싸먹고 된장찌개까지 같이 즐기면 든든하게 배부르게 먹을 수 있을 것 같아요.',
    distanceKm: 0.9,
    area: '동성로',
    timeAgo: '3시간 20분 전',
  },
  {
    tags: [
      {
        label: '중식',
        bgClass: 'bg-babcategory-chinesebg',
        textClass: 'text-babcategory-chinesetext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '마라탕 2인 세트 같이 드실 분',
    description:
      '마라탕은 여러 재료를 넣어야 제맛인데 혼자 가면 양 조절이 어렵네요. 오늘은 얼큰한 국물에 중국 당면, 야채, 고기까지 푸짐하게 담아서 같이 나눠 드실 분 찾습니다.',
    distanceKm: 1.6,
    area: '동성로',
    timeAgo: '4시간 전',
  },
  {
    tags: [
      {
        label: '일식',
        bgClass: 'bg-babcategory-japanesbg',
        textClass: 'text-babcategory-japanestext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '돈카츠 정식 2인분 세트 나눠 드실래요?',
    description:
      '일식 돈카츠 정식은 항상 양이 많아서 혼자 다 먹기 벅차더라고요. 밥, 된장국, 사이드 메뉴까지 푸짐하게 나오는 정식이라 함께 드시면 알차게 즐길 수 있습니다.',
    distanceKm: 0.5,
    area: '동성로',
    timeAgo: '4시간 30분 전',
  },
  {
    tags: [
      {
        label: '이탈리안',
        bgClass: 'bg-babcategory-italianbg',
        textClass: 'text-babcategory-italiantext',
      },
      {
        label: '루프탑',
        bgClass: 'bg-babcategory-rooftopbg',
        textClass: 'text-babcategory-rooftoptext',
      },
    ],
    title: '와인과 함께하는 피자 나눠 드실 분',
    description:
      '루프탑 레스토랑에서 피자와 와인을 곁들여 먹고 싶어요. 혼자서는 메뉴가 부담스러워서 같이 와서 분위기도 즐기고 맛있는 음식도 나누면 딱 좋을 것 같네요.',
    distanceKm: 1.9,
    area: '동성로',
    timeAgo: '5시간 전',
  },
  {
    tags: [
      { label: '카페', bgClass: 'bg-babcategory-cafebg', textClass: 'text-babcategory-cafetext' },
      {
        label: '루프탑',
        bgClass: 'bg-babcategory-rooftopbg',
        textClass: 'text-babcategory-rooftoptext',
      },
    ],
    title: '빙수 2인 세트 같이 드실 분',
    description:
      '여름 한정으로 판매하는 빙수 세트가 너무 맛있어 보여서 주문하고 싶은데 혼자 먹기엔 많아요. 시원하게 루프탑에서 빙수 한 그릇 나눠 먹으면 좋겠네요.',
    distanceKm: 0.8,
    area: '동성로',
    timeAgo: '5시간 40분 전',
  },
  {
    tags: [
      {
        label: '멕시칸',
        bgClass: 'bg-babcategory-mexicanbg',
        textClass: 'text-babcategory-mexicantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '부리토 세트 나눠 드실래요?',
    description:
      '부리토에 나초랑 소스까지 곁들여서 세트로 주문하면 양이 꽤 많더라고요. 혼자 먹기보단 같이 먹으면서 여러 가지 소스 맛도 보고 싶습니다.',
    distanceKm: 1.2,
    area: '동성로',
    timeAgo: '6시간 전',
  },
  {
    tags: [
      {
        label: '인도식',
        bgClass: 'bg-babcategory-indianbg',
        textClass: 'text-babcategory-indiantext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '탄두리 치킨 같이 드실 분 찾습니다',
    description:
      '탄두리 치킨은 양도 많고 사이드까지 풍성해서 혼자 주문하기엔 아깝네요. 야외 테이블에서 시원한 맥주와 함께 먹으면 최고의 조합일 것 같아요.',
    distanceKm: 2.1,
    area: '동성로',
    timeAgo: '7시간 전',
  },
  {
    tags: [
      {
        label: '아시안',
        bgClass: 'bg-babcategory-asianbg',
        textClass: 'text-babcategory-asiantext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '팟타이와 똠얌꿍 세트 같이 드실래요?',
    description:
      '태국 음식 특유의 매콤하면서도 달콤한 맛이 생각나서 주문하려고 합니다. 다양한 메뉴를 한 번에 시켜서 나눠 먹으면 더 맛있을 것 같아요.',
    distanceKm: 1.0,
    area: '동성로',
    timeAgo: '7시간 30분 전',
  },
  {
    tags: [
      {
        label: '주류',
        bgClass: 'bg-babcategory-alcoholbg',
        textClass: 'text-babcategory-alcoholtext',
      },
      {
        label: '실내',
        bgClass: 'bg-babcategory-indoorbg',
        textClass: 'text-babcategory-indoortext',
      },
    ],
    title: '수제 맥주 세트 같이 드실 분',
    description:
      '동성로에 새로 생긴 펍에서 수제 맥주 세트를 주문하려는데 종류가 다양해서 혼자서는 고르기 힘드네요. 같이 가서 여러 가지 맥주 맛보고 즐기면 좋겠습니다.',
    distanceKm: 0.6,
    area: '동성로',
    timeAgo: '8시간 전',
  },
  {
    tags: [
      {
        label: '디저트',
        bgClass: 'bg-babcategory-dessertbg',
        textClass: 'text-babcategory-desserttext',
      },
      {
        label: '야외',
        bgClass: 'bg-babcategory-outdoorbg',
        textClass: 'text-babcategory-outdoortext',
      },
    ],
    title: '마카롱 세트 같이 나눠 드실 분',
    description:
      '색색의 마카롱이 가득 들어있는 세트를 주문하고 싶은데 혼자 먹기엔 당도가 높아서 아쉽네요. 달콤한 디저트를 좋아하시는 분과 함께 나눠 먹고 싶습니다.',
    distanceKm: 1.7,
    area: '동성로',
    timeAgo: '9시간 전',
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
  const itemsPerPage = 5;

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
