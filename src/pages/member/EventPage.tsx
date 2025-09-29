import { useEffect, useState } from 'react';
import { RiFireFill, RiShareLine } from 'react-icons/ri';
import { supabase } from '../../lib/supabase';
import type { Events } from '../../types/bobType';
import TagBadge from '../../ui/TagBadge';
import { GiftFill, PhoneLine } from '../../ui/Icon';
// 모달 임시...ㅠ
import { RiCloseFill } from 'react-icons/ri';
import type React from 'react';
import { ButtonFillMd } from '../../ui/button';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  contentText?: React.ReactNode;
  titleText?: string;
  closeButtonBgColor?: string;
  submitButtonBgColor?: string;
  closeButtonTextColor?: string;
  submitButtonTextColor?: string;
  submitButtonText?: string;
  closeButtonText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  titleText,
  contentText,
  submitButtonText,
  closeButtonText,
  closeButtonBgColor = '#c2c2c2',
  submitButtonBgColor = '#ff5722',
  closeButtonTextColor = '#5C5C5C',
  submitButtonTextColor = '#ffffff',
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col pt-10  w-[470px] min-h-[250px] bg-white rounded-[30px] shadow ">
        <div className="flex items-center justify-between  ">
          <div className=" w-full font-bold">{titleText}</div>
        </div>
        <div className="w-full flex  items-center p-[20px]">
          <div className="w-full font-bold">{contentText}</div>
        </div>
        <div className="flex justify-center gap-4 items-center  py-[20px] px-[20px] rounded-b-[30px]">
          <ButtonFillMd onClick={onSubmit} style={{ background: submitButtonBgColor, flex: 1 }}>
            {submitButtonText}
          </ButtonFillMd>
          <ButtonFillMd onClick={onClose} className="w-[200px]  !text-babgray-700 !bg-babgray-200">
            {closeButtonText}
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
};

function EventPage() {
  const [events, setEvents] = useState<Events[]>([]);
  const [viewModal, setViewModal] = useState(false);

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

      // 상태별 우선순위 부여
      const statusOrder: Record<string, number> = {
        진행중: 1,
        예정: 2,
        종료: 3,
      };

      // 정렬
      const sorted = result.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setEvents(sorted);
    };
    fetchData();
  }, []);
  const handleViewModal = () => {
    setViewModal(true);
  };
  const modalText = () => {
    return (
      <>
        <div className="w-full  bg-white border-none rounded-[16px] flex flex-col items-center gap-[17px] ">
          <GiftFill bgColor="#FFEDD5" color="#F97A18" size={20} padding={14} />
          <div className="w-full flex flex-col items-center gap-[15px] text-md">
            <span>이벤트 참여</span>
            <p className="text-babgray-600">‘신규 회원 특별 혜택’ 이벤트에 참여하시겠습니까?</p>

            <div className="self-stretch w-full p-3.5 bg-bg-bg rounded-xl inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
              <div className="self-stretch p-3.5 flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch justify-start">
                  <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                    이벤트:
                  </span>
                  <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                    
                    신규 회원 특별 혜택
                  </span>
                </div>
                <div className="self-stretch justify-start">
                  <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                    혜택:
                  </span>
                  <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                    첫 매칭 성공 시 3,000원 할인 쿠폰 증정!
                  </span>
                </div>
                <div className="self-stretch justify-start">
                  <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                    기간:
                  </span>
                  <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                    2025-09-15 ~ 2025-12-31
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto py-8 flex flex-col gap-[30px]">
      {/* 상단 제목 */}
      <div>
        <h2 className="text-[32px] font-bold">이벤트</h2>
        <p className="text-[16px] text-babgray-600">
          다양한 이벤트에 참여하고 특별한 혜택을 받아보세요
        </p>
      </div>

      {/* 이벤트 카드 리스트 */}
      <div className="grid grid-cols-2 gap-[25px]">
        {events.map(event => (
          <div
            key={event.id}
            className="flex flex-col overflow-hidden rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white"
          >
            {/* 이미지 */}
            <div className="relative w-full h-[200px] overflow-hidden">
              <img
                src={event.image_url ?? ''}
                alt={event.title ?? ''}
                className="w-full h-full object-cover"
              />
              {/* HOT 뱃지 */}
              {event.badge === 'HOT' && (
                <span className="absolute top-[12px] left-[12px] px-[10px] py-[4px] text-white text-xs rounded-[8px] flex items-center gap-1">
                  <TagBadge bgColor="bg-red-500" textColor="text-white">
                    <RiFireFill />
                    HOT
                  </TagBadge>
                </span>
              )}
              {/* 진행 상태 */}
              <span className="absolute top-[12px] right-[12px] px-[10px] py-[4px] text-xs rounded-[8px]">
                <TagBadge
                  bgColor={
                    event.status === '종료'
                      ? 'bg-babbutton-black_back'
                      : event.status === '예정'
                        ? 'bg-babbutton-blue_back'
                        : 'bg-babbutton-green_back'
                  }
                  textColor={
                    event.status === '종료'
                      ? 'text-babbutton-black'
                      : event.status === '예정'
                        ? 'text-babbutton-blue'
                        : 'text-babbutton-green'
                  }
                >
                  {event.status}
                </TagBadge>
              </span>
            </div>

            {/* 본문 */}
            <div className="flex flex-col gap-[10px] p-[18px]">
              <h3 className="text-[18px] font-bold">{event.title ?? ''}</h3>
              <p className="text-[14px] text-bab">{event.description ?? ''}</p>
              <p className="text-[14px] text-babgray-600">{event.benefit ?? ''}</p>

              <div className="flex justify-between items-center text-sm text-babgray-500">
                <span>
                  {event.start_date ?? ''} ~ {event.end_date ?? ''}
                </span>
              </div>

              <div className="flex justify-between gap-[20px] items-center">
                <button
                  disabled={event.status === '종료'}
                  onClick={handleViewModal}
                  className={`px-[14px] py-[8px] w-full rounded-[8px] text-nomal font-bold flex items-center justify-center gap-1
                    ${
                      event.status === '종료'
                        ? 'bg-babgray-150 text-babgray-600 opacity-50 cursor-not-allowed'
                        : event.status === '예정'
                          ? 'bg-babbutton-blue text-white'
                          : 'bg-bab-500 text-white'
                    }`}
                >
                  {event.participation ?? ''}
                </button>

                <button className="flex-1">
                  <RiShareLine />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {viewModal && (
        <div className="w-full">
          <Modal
            isOpen={viewModal}
            onClose={() => setViewModal(false)}
            onSubmit={() => {
              setViewModal(false);
            }}
            contentText={modalText()}
            submitButtonText="확인"
            closeButtonText="취소"
          />
        </div>
      )}
    </div>
  );
}

export default EventPage;
