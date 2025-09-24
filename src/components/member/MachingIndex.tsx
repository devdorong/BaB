import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../MatchCard';
import { ButtonLineMd } from '../../ui/button';

const MachingIndex = () => {
  const navigate = useNavigate();
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
    // 필요 시 더 추가
  ];
  return (
    <div className="">
      {/* 상단 */}
      <div className="flex justify-between mt-[120px]">
        {/* 왼쪽 */}
        <div>
          <span className="text-3xl font-bold">매칭 대기중</span>
        </div>
        {/* 오른쪽 */}
        <div className="flex items-center justify-between gap-[30px]">
          {/* 검색창 */}
          <div className="flex items-center w-[300px] h-[56px]  px-[15px] py-[20px] bg-white rounded-[28px] border border-babgray-300 gap-[10px]">
            <input
              type="text"
              className="flex-1 text-[13px] text-gray-700 focus:outline-none ml-1"
              placeholder="원하는 음식이나 지역을 검색해보세요"
            />{' '}
            <RiSearchLine className="text-babgray-300 w-5 h-5 mr-2" />
          </div>
          <button
            onClick={() => navigate('/member/posts/write')}
            className="flex items-center px-8 py-4 bg-bab-500 text-white font-bold rounded-[8px] gap-2 "
          >
            <i>
              <RiAddLine size={24} />
            </i>
            <span>매칭 등록하기</span>
          </button>
        </div>
      </div>
      {/* 중단 */}
      <div className="w-full pt-[30px] pb-[50px]">
        <ul
          className=" w-full grid list-none p-0 m-0 
  [grid-template-columns:repeat(auto-fill,615px)]
  justify-between
  gap-x-[30px] gap-y-[24px]
    "
        >
          {demo.map((item, index) => (
            <MatchCard key={index} {...item} />
          ))}
        </ul>
      </div>
      {/* 하단 */}
      <div className="flex justify-center pb-[50px]">
        <ButtonLineMd
          onClick={() => navigate('/member/matching')}
          style={{ borderRadius: '20px', padding: '20px 30px' }}
        >
          더보기
        </ButtonLineMd>
      </div>
    </div>
  );
};

export default MachingIndex;
