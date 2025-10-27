import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RiEditLine } from 'react-icons/ri';
import OkCancelModal from '../../components/member/OkCancelModal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database, Events } from '../../types/bobType';
import { ButtonFillMd } from '../../ui/button';
import { GiftFill } from '../../ui/Icon';
import EventCardSkeleton from '../../ui/sdj/EventCardSkeleton';
import EventEditModal from '../../ui/sdj/EventEditModal';
import EventWriteModal from '../../ui/sdj/EventWriteModal';
import Modal from '../../ui/sdj/Modal';
import { useModal } from '../../ui/sdj/ModalState';
import TagBadge from '../../ui/TagBadge';
import styles from './EventPage.module.css';
import { AnimatePresence, motion } from 'framer-motion';

type EventState = Database['public']['Tables']['events']['Row']['status'];
type EventFilterState = EventState | '전체';

function EventPage() {
  const { user } = useAuth();
  const { closeModal, modal, openModal } = useModal();
  const [viewModal, setViewModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<Events[]>([]);
  const [filterCategories, setFilterCategories] = useState<Events[]>([]);
  const [selectCategories, setSelectCategories] = useState<EventFilterState>('전체');
  const [loading, setLoading] = useState(true);

  const [eventModal, setEventModal] = useState(false);

  const [editPage, setEditPage] = useState(false);

  const [admin, setAdmin] = useState(false);

  const statusTags: EventFilterState[] = ['전체', '진행중', '예정', '종료'];

  const handleEditBt = (id: number) => {
    setSelectedEventId(id);
    setEditPage(true);
  };

  const getStatusByDate = (start: string | null, end: string | null): EventState => {
    if (!start || !end) return '예정';

    const today = dayjs().startOf('day');
    const startDate = dayjs(start).startOf('day');
    const endDate = dayjs(end).endOf('day');

    if (today.isBefore(startDate)) return '예정';
    if (today.isAfter(endDate)) return '종료';
    return '진행중';
  };

  const handleJoin = async (eventId: number) => {
    if (!user) {
      openModal('이벤트 참여', '로그인 후 이용 가능합니다.', '닫기');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'member') {
      openModal('이벤트 참여', '회원만 이벤트에 참여할 수 있습니다.', '닫기');
      return;
    }

    const { data: existing, error: existError } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      openModal('이벤트 참여', '이미 참여한 이벤트입니다.', '닫기');
      return;
    }

    const { error } = await supabase.from('event_participants').insert({
      event_id: eventId,
      user_id: user.id,
    });

    if (error) {
      openModal('이벤트 참여', '참여 중 오류가 발생했습니다.', '닫기');
      return;
    }

    openModal('이벤트 참여', '이벤트에 성공적으로 참여했습니다', '닫기');
  };

  const addBadges = async (events: Events[]) => {
    setLoading(true);
    const { error, data: participants } = await supabase
      .from('event_participants')
      .select('*,events(id,start_date)');

    if (error) {
      console.error('참여자 데이터 불러오기 실패:', error.message);
      return [];
    }

    const grouped = participants.reduce(
      (acc, cur) => {
        const id = cur.event_id;

        // 해당 event_id가 accumulator에 없으면 초기화
        if (!acc[id]) {
          acc[id] = {
            count: 0,
            start_date: cur.events?.start_date || null,
          };
        }

        // 같은 event_id가 나오면 count 증가
        acc[id].count++;

        return acc; // 누적 결과 반환
      },
      {} as Record<number, { count: number; start_date: string | null }>,
    );

    return events.map(e => {
      const count = grouped[e.id]?.count ?? 0;
      const start = e.start_date ? dayjs(e.start_date) : null;
      const now = dayjs();

      let badge: 'HOT' | '신규' | null = null;
      if (count >= 2) badge = 'HOT';
      else if (start) {
        const diffDays = now.diff(start, 'day');
        if (diffDays >= 0 && diffDays <= 3) badge = '신규';
      }

      setLoading(false);
      return { ...e, badge };
    });
  };

  const eventData = async (): Promise<Events[]> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('이벤트 불러오기 에러', error.message);
      setLoading(false);
    }
    setLoading(false);
    return data || [];
  };

  useEffect(() => {
    document.body.style.overflow = eventModal ? 'hidden' : 'auto';
  }, [modal, eventModal]);

  useEffect(() => {
    const checkAdmin = async (userId: string | unknown) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        setAdmin(false);
        return;
      }
      setAdmin(data.role === 'admin');
    };
    if (!user) return;
    checkAdmin(user.id);
  }, [user, events]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await eventData();
      const withBadge = await addBadges(result);

      // 상태별 우선순위 부여
      const statusOrder: Record<string, number> = {
        진행중: 1,
        예정: 2,
        종료: 3,
      };

      const mapped = withBadge.map(e => ({
        ...e,
        status: getStatusByDate(e.start_date, e.end_date),
      }));

      // 정렬
      const sorted = mapped.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setEvents(sorted);
    };
    fetchData();
  }, [eventModal, editPage]);

  useEffect(() => {
    if (selectCategories === '전체') {
      setFilterCategories(events);
    } else {
      setFilterCategories(events.filter(e => e.status === selectCategories));
    }
  }, [selectCategories, events]);

  const handlePlannedModal = (startDate: string | null) => {
    if (!startDate) return;
    openModal(
      '이벤트 안내',
      `${dayjs(startDate).format('YYYY-MM-DD')} 에 시작되는 이벤트입니다.`,
      '확인',
    );
  };

  const handleViewModal = (id: number) => {
    setSelectedEventId(id);
    setViewModal(true);
  };

  const modalText = () => {
    return (
      <AnimatePresence>
        {filterCategories
          .filter(e => e.id === selectedEventId)
          .map(e => (
            <motion.div
              className="w-full bg-white border-none rounded-[16px] flex flex-col items-center gap-[17px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              key={e.id}
            >
              <GiftFill bgColor="#FFEDD5" color="#F97A18" size={20} padding={14} />
              <div className="w-full flex flex-col items-center gap-[15px] text-md">
                <span>이벤트 참여</span>
                <p className="text-babgray-600">‘{e.title}’ 이벤트에 참여하시겠습니까?</p>
                {e.title}
                <div className="self-stretch w-full p-3.5 bg-bg-bg rounded-xl inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch p-3.5 flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch justify-start">
                      <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                        이벤트 :{' '}
                      </span>
                      <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                        {e.title}
                      </span>
                    </div>
                    <div className="self-stretch justify-start">
                      <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                        혜택 :{' '}
                      </span>
                      <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                        {e.benefit}
                      </span>
                    </div>
                    <div className="self-stretch justify-start">
                      <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                        내용 :{' '}
                      </span>
                      <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                        {e.description}
                      </span>
                    </div>
                    <div className="self-stretch justify-start">
                      <span className="text-babgray-700 text-base font-bold font-['Noto_Sans_KR']">
                        기간 :{' '}
                      </span>
                      <span className="text-babgray-600 text-base font-normal font-['Noto_Sans_KR']">
                        {dayjs(e.start_date).format('YYYY-MM-DD')} ~{' '}
                        {dayjs(e.end_date).format('YYYY-MM-DD')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    );
  };

  return (
    <div className={`${styles.pageContainer}`}>
      {/* 상단 제목 */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>이벤트</h2>
        <p className={styles.headerDesc}>다양한 이벤트에 참여하고 특별한 혜택을 받아보세요</p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterButtons}>
          {statusTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectCategories(tag)}
              className="rounded-2xl cursor-pointer"
            >
              <TagBadge
                bgColor={selectCategories === tag ? 'bg-bab' : 'bg-gray-100'}
                textColor={selectCategories === tag ? 'text-white' : 'text-gray-700'}
              >
                {tag}
              </TagBadge>
            </button>
          ))}
        </div>
        {admin && <ButtonFillMd onClick={() => setEventModal(true)}>작성하기</ButtonFillMd>}
      </div>
      {eventModal && <EventWriteModal onSuccess={eventData} onClose={() => setEventModal(false)} />}

      {loading ? (
        [...Array(1)].map((_, i) => <EventCardSkeleton key={i} />)
      ) : events.length > 0 ? (
        <div className={styles.eventGrid}>
          {filterCategories.map(event => (
            <div key={event.id} className={styles.eventCard}>
              {/* 이미지 */}
              <div className={styles.eventImage}>
                <img
                  src={event.image_url ?? ''}
                  alt={event.title ?? ''}
                  className="w-full h-full object-cover"
                />
                {event.badge === 'HOT' ? (
                  <span className="absolute top-[12px] left-[12px] px-[10px] py-[4px] text-white text-xs rounded-[8px] flex items-center gap-1">
                    <TagBadge bgColor="bg-red-500" textColor="text-white">
                      HOT
                    </TagBadge>
                  </span>
                ) : event.badge === '신규' ? (
                  <span className="absolute top-[12px] left-[12px] px-[10px] py-[4px] text-white text-xs rounded-[8px] flex items-center gap-1">
                    <TagBadge bgColor="bg-blue-500" textColor="text-white">
                      NEW
                    </TagBadge>
                  </span>
                ) : null}

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
              <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{event.title ?? ''}</h3>
                <p className={styles.eventDesc}>{event.description ?? ''}</p>
                <p className={styles.eventBenefit}> {event.benefit ?? ''}</p>

                <p className={styles.eventDate}>
                  {event.start_date ?? ''} ~ {event.end_date ?? ''}
                </p>

                <div className={styles.eventButtonGroup}>
                  <button
                    disabled={event.status === '종료'}
                    onClick={() => {
                      if (event.status === '진행중') {
                        handleViewModal(event.id);
                      } else if (event.status === '예정') {
                        handlePlannedModal(event.start_date);
                      }
                    }}
                    className={`px-[14px] py-[8px] w-full rounded-[8px] text-nomal font-bold flex items-center justify-center gap-1
                    ${
                      event.status === '종료'
                        ? 'bg-babgray-150 text-babgray-600 opacity-50 cursor-not-allowed'
                        : event.status === '예정'
                          ? 'bg-babbutton-blue text-white'
                          : 'bg-bab-500 text-white'
                    }`}
                  >
                    {event.status === '진행중' && `참여하기`}
                    {event.status === '예정' && dayjs(event.start_date).format('YYYY-MM-DD (ddd)')}
                    {event.status === '종료' && `종료된 이벤트`}
                  </button>
                  {admin && (
                    <button
                      onClick={() => handleEditBt(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 p-2"
                    >
                      <RiEditLine className="translate-y-0.5" /> 수정하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-5">이벤트 목록을 불러오는데 실패했습니다.</p>
      )}
      {/* 이벤트 카드 리스트 */}

      {editPage && (
        <EventEditModal
          isOpen={editPage}
          onClose={() => setEditPage(false)}
          eventId={selectedEventId}
        />
      )}
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
      {viewModal && (
        <div className="w-full">
          <OkCancelModal
            isOpen={viewModal}
            onClose={() => setViewModal(false)}
            onSubmit={() => {
              if (selectedEventId) handleJoin(selectedEventId);
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
