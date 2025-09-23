import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../MatchCard';

const MachingIndex = () => {
  const navigate = useNavigate();
  const demo = [
    {
      tags: [
        { label: '양식', bgClass: 'bg-lime-50', textClass: 'text-lime-800' },
        { label: '실내', bgClass: 'bg-rose-100', textClass: 'text-pink-700' },
      ],
      title: '이태원 스테이크 맛집 같이 가실 분!',
      description: '맛있는 스테이크 먹으면서 즐거운 대화 나누실 분~',
      distanceKm: 1.2,
      area: '장관동',
      timeAgo: '30분 전',
    },
    {
      tags: [
        { label: '양식', bgClass: 'bg-lime-50', textClass: 'text-lime-800' },
        { label: '실내', bgClass: 'bg-rose-100', textClass: 'text-pink-700' },
      ],
      title: '이태원 스테이크 맛집 같이 가실 분!',
      description: '맛있는 스테이크 먹으면서 즐거운 대화 나누실 분~',
      distanceKm: 1.2,
      area: '장관동',
      timeAgo: '30분 전',
    },
    {
      tags: [
        { label: '양식', bgClass: 'bg-lime-50', textClass: 'text-lime-800' },
        { label: '실내', bgClass: 'bg-rose-100', textClass: 'text-pink-700' },
      ],
      title: '이태원 스테이크 맛집 같이 가실 분!',
      description: '맛있는 스테이크 먹으면서 즐거운 대화 나누실 분~',
      distanceKm: 1.2,
      area: '장관동',
      timeAgo: '30분 전',
    },
    {
      tags: [
        { label: '양식', bgClass: 'bg-lime-50', textClass: 'text-lime-800' },
        { label: '실내', bgClass: 'bg-rose-100', textClass: 'text-pink-700' },
      ],
      title: '이태원 스테이크 맛집 같이 가실 분!',
      description: '맛있는 스테이크 먹으면서 즐거운 대화 나누실 분~',
      distanceKm: 1.2,
      area: '장관동',
      timeAgo: '30분 전',
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
              className="flex-1 text-[13px] text-gray-700 focus:outline-none"
              placeholder="원하는 음식이나 지역을 검색해보세요"
            />{' '}
            <RiSearchLine className="text-babgray-300 w-5 h-5 mr-2" />
          </div>
          <button
            onClick={() => navigate('/member/posts/write')}
            className="flex items-center px-8 py-4 bg-bab-500 text-white font-bold rounded-[8px] "
          >
            <i>
              <RiAddLine />
            </i>
            <span>매칭 등록하기</span>
          </button>
        </div>
      </div>
      {/* 중단 */}
      <div className="pt-[30px] pb-[50px]">
        <ul
          className=" grid gap-6 list-none p-0 m-0
    [grid-template-columns:repeat(auto-fill,615px)]
    justify-center"
        >
          {demo.map((item, index) => (
            <MatchCard key={index} {...item} />
          ))}
        </ul>
      </div>
      {/* 하단 */}
      <div></div>
    </div>
  );
};

export default MachingIndex;
