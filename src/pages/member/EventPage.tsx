import { RiArrowRightSLine, RiFireFill, RiShareLine } from 'react-icons/ri';
import TagBadge from '../../ui/TagBadge';
import { supabase } from '../../lib/supabase';
import type { Events } from '../../types/bobType';
import { useEffect, useState } from 'react';

const sampleEvent = [
  {
    img: 'https://images.unsplash.com/photo-1617992477211-dfab5866182b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '신규 회원 특별 혜택',
    desc: '첫 주문 시 최대 5,000원 할인 쿠폰 증정!',
    subtitle:
      'BaB에 새로 가입한 회원분들을 위한 특별한 혜택! 첫 번째 매칭이 성공하면 다음 식사에서 사용할 수 있는 5,000원 할인 쿠폰을 드려요.',
    date: '2025-09-25 ~ 2025-09-31',
    hot: true,
    tag: '진행중',
    tagColor: 'bg-babbutton-green_back',
    tagText: 'text-babbutton-green',
    state: '참여하기',
    buttoncolor: 'bg-bab-500',
    buttonText: 'text-white',
  },
  {
    img: 'https://images.unsplash.com/photo-1674068640712-165cee4b180f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '발렌타인데이 카페 혜택 이벤트',
    desc: '2인 세트 발렌타인 디저트 기획전!',
    subtitle:
      '2월 14일 밸런타인 데이를 기념해서 커플 매칭 이벤트를 진행합니다. 로맨틱한 분위기의 레스토랑에서 특별한 만남을 가져보세요!',
    date: '2025-02-07 ~ 2025-02-14',
    hot: true,
    tag: '종료',
    tagColor: 'bg-babbutton-green_back',
    tagText: 'text-babbutton-green',
    state: '종료된 이벤트',
    buttoncolor: 'bg-bab-500',
    buttonText: 'text-white',
  },
  {
    img: 'https://images.unsplash.com/photo-1592903297149-37fb25202dfa?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '밀랍 감사 이벤트',
    desc: '밀랍 포장 상품 구매 시 사은품 증정',
    subtitle:
      '한 달 동안 가장 많은 도움이 되는 이뷰를 작성해주신 분께 고급 레스토랑 디너 코스 이용권을 선물로 드립니다.',
    date: '2025-10-15 ~ 2025-10-25',
    hot: false,
    tag: '예정',
    tagColor: 'bg-babbutton-blue_back',
    tagText: 'text-babbutton-blue',
    state: '10-15 (수) 17:00',
    buttoncolor: 'bg-babbutton-blue',
    buttonText: 'text-white',
  },
  {
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '친구와 함께하는 이벤트',
    desc: '친구 초대 시 추가 적립 혜택 제공',
    subtitle:
      'BaB에 새로 가입한 회원분들을 위한 특별한 혜택! 첫 번째 매칭이 성공하면 다음 식사에서 사용할 수 있는 5,000원 할인 쿠폰을 드려요.',
    date: '2025-10-25 ~ 2025-10-31',
    hot: false,
    tag: '예정',
    tagColor: 'bg-babbutton-blue_back',
    tagText: 'text-babbutton-blue',
    state: '10-25 (토) 12:00',
    buttoncolor: 'bg-babbutton-blue',
    buttonText: 'text-white',
  },
  {
    img: 'https://images.unsplash.com/photo-1600577916048-804c9191e36c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '신규 회원 특별 혜택',
    desc: '첫 주문 시 최대 5,000원 할인 쿠폰 증정!',
    subtitle:
      'BaB에 새로 가입한 회원분들을 위한 특별한 혜택! 첫 번째 매칭이 성공하면 다음 식사에서 사용할 수 있는 5,000원 할인 쿠폰을 드려요.',
    date: '2025-08-25 ~ 2025-08-31',
    hot: false,
    tag: '종료',
    tagColor: 'bg-babbutton-black_back',
    tagText: 'text-babbutton-black',
    state: '종료된 이벤트',
    buttoncolor: 'bg-babgray-150',
    buttonText: 'text-babgray-600',
  },
  {
    img: 'https://images.unsplash.com/photo-1579600161224-cac5a2971069?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '신규 회원 특별 혜택',
    desc: '첫 주문 시 최대 5,000원 할인 쿠폰 증정!',
    subtitle:
      'BaB에 새로 가입한 회원분들을 위한 특별한 혜택! 첫 번째 매칭이 성공하면 다음 식사에서 사용할 수 있는 5,000원 할인 쿠폰을 드려요.',
    date: '2025-08-25 ~ 2025-08-31',
    hot: false,
    tag: '종료',
    tagColor: 'bg-babbutton-black_back',
    tagText: 'text-babbutton-black',
    state: '종료된 이벤트',
    buttoncolor: 'bg-babgray-150',
    buttonText: 'text-babgray-600',
  },
];

function EventPage() {
  const [events, setEvents] = useState<Events[]>([]);
  const eventData = async (): Promise<Events[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.log('이벤트 불러오기 에러', error.message);
    }
    return data || [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await eventData();
      setEvents(result);
      console.log(result.length);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto py-[40px] flex flex-col gap-[30px]">
      {/* 상단 제목 */}
      <div>
        <h2 className="text-[32px] font-bold">이벤트</h2>
        <p className="text-[16px] text-babgray-600">
          다양한 이벤트에 참여하고 특별한 혜택을 받아보세요
        </p>
      </div>

      {/* 이벤트 카드 리스트 */}
      <div className="grid grid-cols-2 gap-[25px]">
        {sampleEvent.map((event, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white"
          >
            {/* 이미지 */}
            <div className="relative w-full h-[200px] overflow-hidden">
              <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
              {/* HOT 뱃지 */}
              {event.hot && (
                <span className="absolute top-[12px] left-[12px] px-[10px] py-[4px] bg-none text-white text-xs rounded-[8px] flex items-center gap-1">
                  <TagBadge bgColor="bg-red-500" textColor="text-white">
                    <RiFireFill />
                    HOT
                  </TagBadge>
                </span>
              )}
              {/* 진행 상태 */}

              <span className="absolute top-[12px] right-[12px] px-[10px] py-[4px] bg-none text-babgray-700 text-xs rounded-[8px]">
                <TagBadge bgColor={`${event.tagColor}`} textColor={`${event.tagText}`}>
                  {event.tag}
                </TagBadge>
              </span>
            </div>

            {/* 본문 */}
            <div className="flex flex-col gap-[10px] p-[18px]">
              <h3 className="text-[18px] font-bold">{event.title}</h3>
              <p className="text-[14px] text-bab">{event.desc}</p>
              <p className="text-[14px] text-babgray-600">{event.subtitle}</p>

              <div className="flex justify-between items-center text-sm text-babgray-500">
                <span>{event.date}</span>
              </div>
              <div className="flex justify-between gap-[20px] items-center">
                <button
                  className={`px-[14px] py-[8px] w-full ${event.buttoncolor} ${event.buttonText} rounded-[8px] text-nomal font-bold flex items-center justify-center gap-1`}
                >
                  {event.state}
                </button>
                <button className="flex-1">
                  <RiShareLine />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventPage;
