import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonFillLG, ButtonLineMd } from '../../ui/button';
import Modal from '../../ui/sdj/Modal';
import { useModal } from '../../ui/sdj/ModalState';
import MatchCard from '../MatchCard';

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
const MachingIndex = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { modal, closeModal, openModal } = useModal();

  const handleButtonClick = () => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
        navigate('/member/login'),
      );
    } else {
      navigate('/member/matching/write');
    }
  };
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
          <ButtonFillLG onClick={handleButtonClick}>
            <i>
              <RiAddLine size={24} />
            </i>
            <span>매칭 등록하기</span>
          </ButtonFillLG>
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
          {/* 매칭 대기중인 게시글 최대 4개 출력하기 테이블연결후 수정 */}
          {demo.map((item, index) => (
            <MatchCard
              key={index}
              {...item}
              modal={modal}
              openModal={openModal}
              closeModal={closeModal}
            />
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

export default MachingIndex;
