import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import {
  deleteReadNotification,
  fetchNotificationProfileData,
  handleReadNotification,
  type NotificationsProps,
} from '../../lib/notification';
import {
  CheckboxCircleLine,
  CheckDoubleLine,
  CheckLine,
  CloseFill,
  GiftFill,
  GroupLine,
  Message2Fill,
  QuestionAnswerFill,
  Settings5Fill,
  ShoppingCartFill,
  StarFill,
} from '../../ui/Icon';
import { CheckCheckIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { findOrCreateDirectChat } from '@/services/directChatService';
import { useDirectChat } from '@/contexts/DirectChatContext';
import type { ChatListItem } from '@/types/chatType';
import { useRealTimeNotification } from '@/contexts/NotificationContext';

export const badgeColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500',
  리뷰: 'bg-yellow-400',
  시스템: 'bg-babbutton-blue',
  채팅: 'bg-yellow-100 text-yellow-700',
  매칭완료: 'bg-[#FFF1E6] text-[#FF5722]',
  모집완료: 'bg-orange-100 text-orange-700',
  댓글: 'bg-green-100 text-green-700',
  매칭취소: 'bg-red-100 text-red-600',
  이벤트: 'bg-blue-100 text-blue-700',
};

export const borderColors: Record<NotificationsProps['type'], string> = {
  주문: 'border border-bab-500 border-l-bab-500 text-bab-500',
  리뷰: 'border border-yellow-400 border-l-yellow-400 text-yellow-600',
  시스템: 'border border-babbutton-blue border-l-babbutton-blue text-babbutton-blue',
  채팅: 'border border-yellow-400 border-l-yellow-400 text-yellow-600',
  매칭완료: 'border border-[#FF5722] border-l-[#FF5722] text-[#FF5722]',
  모집완료: 'border border-orange-400 border-l-orange-400 text-orange-600',
  댓글: 'border border-green-400 border-l-green-400 text-green-600',
  매칭취소: 'border border-red-400 border-l-red-400 text-red-600',
  이벤트: 'border border-blue-400 border-l-blue-400 text-blue-600',
};

export const IconColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500',
  리뷰: 'bg-yellow-400',
  시스템: 'bg-babbutton-blue',
  채팅: 'bg-yellow-400',
  매칭완료: 'bg-[#FF5722]',
  모집완료: 'bg-orange-400',
  댓글: 'bg-green-500',
  매칭취소: 'bg-red-500',
  이벤트: 'bg-blue-500',
};

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onRead: (id: number) => void;
}

export default function Notification({ isOpen, onClose, onRead }: NotificationProps) {
  const { setCurrentChat, loadMessages, loadChats } = useDirectChat();
  const { notifications, setNotifications } = useRealTimeNotification();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // // 초기 로드 - isOpen과 무관하게 항상 실행
  // useEffect(() => {
  //   const loadNotification = async () => {
  //     const data = await fetchNotificationProfileData();
  //     setNotification(data);
  //   };
  //   loadNotification();
  // }, []); // 한 번만 실행

  // // Realtime 구독 - isOpen과 무관하게 항상 유지
  // useEffect(() => {
  //   const setupRealtimeSubscription = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (!user) {
  //       console.error('사용자 ID를 찾을 수 없습니다.');
  //       return;
  //     }

  //     console.log('Realtime 구독 시작');

  //     // 기존 채널 제거 (중복 방지)
  //     if (channelRef.current) {
  //       await supabase.removeChannel(channelRef.current);
  //       channelRef.current = null;
  //     }

  //     channelRef.current = supabase
  //       .channel(`notifications-${user.id}`)
  //       .on(
  //         'postgres_changes',
  //         {
  //           event: '*',
  //           schema: 'public',
  //           table: 'notifications',
  //           filter: `receiver_id=eq.${user.id}`,
  //         },
  //         payload => {
  //           // console.log('Realtime 이벤트:', payload.eventType, payload.new);

  //           if (payload.eventType === 'INSERT') {
  //             setNotification(prev => {
  //               const newNotification = payload.new as NotificationsProps;
  //               if (prev.some(n => n.id === newNotification.id)) {
  //                 return prev;
  //               }
  //               const updated = [newNotification, ...prev];
  //               return updated.sort((a, b) => {
  //                 if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
  //                 return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  //               });
  //             });
  //           } else if (payload.eventType === 'UPDATE') {
  //             setNotification(prev =>
  //               prev.map(n => (n.id === payload.new.id ? (payload.new as NotificationsProps) : n)),
  //             );
  //           } else if (payload.eventType === 'DELETE') {
  //             setNotification(prev => prev.filter(n => n.id !== payload.old.id));
  //           }
  //         },
  //       )
  //       .subscribe(status => {
  //         console.log('구독 상태:', status);
  //         // if (status === 'SUBSCRIBED') {
  //         //   console.log('구독 성공');
  //         // }
  //       });
  //   };

  //   setupRealtimeSubscription();

  //   return () => {
  //     if (channelRef.current) {
  //       // console.log('Realtime 채널 정리');
  //       supabase.removeChannel(channelRef.current);
  //     }
  //   };
  // }, []); // 한 번만 실행, 컴포넌트가 완전히 언마운트될 때만 정리

  // 알림창 열 때마다 데이터 새로고침
  useEffect(() => {
    if (!isOpen) return;

    const refreshNotifications = async () => {
      // console.log('알림창 열림 - 데이터 새로고침');
      const data = await fetchNotificationProfileData();
      setNotifications(data);
    };
    refreshNotifications();

    // 3일 지난 알림 삭제
    const cleanup = async () => {
      try {
        await deleteReadNotification();
      } catch (err) {
        console.error('알림 자동 정리 실패:', err);
      }
    };
    cleanup();
  }, [isOpen]);

  // 패널 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 전체 읽음 처리
  const handleAllClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // 비동기: 모든 알림 읽음 처리
      await Promise.all(
        notifications.map(async n => {
          if (!n.is_read) {
            await handleReadNotification(n.id);
          }
        }),
      );
      // 상태 업데이트 (전부 is_read = true)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      // // 상위 콜백 (onRead) 에 전체 처리 알림
      // onRead?.('all');

      return () => {
        if (channelRef.current) {
          // console.log('Realtime 채널 정리');
          supabase.removeChannel(channelRef.current);
        }
      };
    } catch (err) {
      console.error('전체 읽음 처리 실패:', err);
    }
  };

  // 읽음처리
  const handleClick = async (item: NotificationsProps) => {
    try {
      // 읽음 처리
      await handleReadNotification(item.id);

      setNotifications(prev => prev.map(n => (n.id === item.id ? { ...n, is_read: true } : n)));
      onRead(item.id);
      onClose();
      switch (item.type) {
        case '채팅': {
          const senderId = item.profile_id;
          if (!senderId) {
            console.warn('알림에 보낸 사람 ID가 없습니다.');
            navigate('/member/profile/chat');
            return;
          }

          const { success, data } = await findOrCreateDirectChat(senderId);
          console.log(data);
          if (success && data?.id) {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            const myId = user?.id;

            // 상대방 ID 구하기
            const otherUserId = data.user1_id === myId ? data.user2_id : data.user1_id;

            await loadChats();

            // 상대방 프로필 정보 가져오기
            const { data: otherProfile } = await supabase
              .from('profiles')
              .select('id, nickname, avatar_url')
              .eq('id', otherUserId)
              .single();
            // DirectChat → ChatListItem 변환
            const chatData: ChatListItem = {
              id: data.id,
              other_user: {
                id: senderId,
                nickname: item.title || '상대방', // 알림 제목이 있다면 임시 대체
                avatar_url: null,
                email: '',
              },
              last_message: undefined,
              unread_count: 0,
              is_new_chat: false,
            };
            setCurrentChat(chatData);
            await loadMessages(chatData.id);
            navigate(`/member/profile/chat`, { state: { chatId: data.id } });
          } else {
            navigate(`/member/profile/chat`);
          }
          break;
        }
        case '리뷰':
          if (item.restaurant_id) {
            navigate(`/partner/notification`);
          }
          break;
        case '매칭완료':
          navigate(`/member/profile/recentmatching`);
          break;
        case '매칭취소':
          navigate(`/member/profile/recentmatching?tab=recent`);
          break;
        case '모집완료': {
          navigate(`/member/matching/${item.content}`);
          break;
        }
        case '댓글': {
          navigate(`/member/reviews/${item.content}`);
          break;
        }
        case '이벤트':
          navigate(`/member/events`);
          break;
        default:
          console.log('알 수 없는 알림 타입:', item.type);
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            onMouseDown={e => e.stopPropagation()}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-[350px] bg-white shadow-xl border-l border-gray-200 z-50 p-5 flex flex-col"
          >
            {/* 상단 타이틀 */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-bab-500">알림</h2>
                <span
                  onClick={handleAllClick}
                  className="hover:text-bab hover:bg-bab-100 border rounded-full px-2 py-0.5 text-[13px] cursor-pointer"
                >
                  모두읽기
                </span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <RiCloseLine size={22} />
              </button>
            </div>
            <hr />

            {/* 알림 목록 */}
            <div className="flex flex-col mt-5 gap-3 overflow-y-auto scrollbar-hide">
              {notifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {/* 2025-10-30: Context 기반 notifications 사용 */}
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        읽지 않은 알림({notifications.filter(n => !n.is_read).length})
                      </div>
                      {notifications
                        .filter(n => !n.is_read)
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                        )
                        .map(n => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                              opacity: 0.7,
                              transition: { duration: 0.6, ease: 'easeInOut' },
                            }}
                            className={`relative flex bg-white items-start gap-3 cursor-pointer border rounded-lg p-4 border-l-4 ${n.is_read === true ? ' border border-babgray border-l-4' : ` ${borderColors[n.type as NotificationsProps['type']].split(' ')[2]} ${borderColors[n.type as NotificationsProps['type']].split(' ')[1]}`}`}
                            onClick={() => handleClick(n)}
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-md  ${IconColors[n.type as NotificationsProps['type']]}`}
                            >
                              {n.type === '매칭완료' ? (
                                <CheckLine size={20} bgColor="none" />
                              ) : n.type === '채팅' ? (
                                <Message2Fill bgColor="none" size={20} />
                              ) : n.type === '이벤트' ? (
                                <GiftFill bgColor="none" size={20} />
                              ) : n.type === '매칭취소' ? (
                                <CloseFill bgColor="none" size={20} />
                              ) : n.type === '댓글' ? (
                                <QuestionAnswerFill bgColor="none" size={20} />
                              ) : n.type === '모집완료' ? (
                                <GroupLine bgColor="none" size={20} />
                              ) : (
                                <StarFill bgColor="none" size={20} />
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">{n.title}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </>
                  )}

                  {/* 읽은 알림 */}
                  {notifications.filter(n => n.is_read).length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-gray-500 mb-2 mt-2">
                        읽은 알림 ({notifications.filter(n => n.is_read).length})
                      </div>
                      {notifications
                        .filter(n => n.is_read)
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(), // 2025-10-27
                        )
                        .map(n => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                              opacity: 0.7,
                              transition: { duration: 0.6, ease: 'easeInOut' },
                            }}
                            className="relative flex bg-gray-50 items-start gap-3 cursor-pointer border rounded-lg p-4 border-l-4 border-gray-200"
                            onClick={() => handleClick(n)}
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-300">
                              {n.type === '매칭완료' ? (
                                <CheckLine size={20} bgColor="none" />
                              ) : n.type === '채팅' ? (
                                <Message2Fill bgColor="none" size={20} />
                              ) : n.type === '이벤트' ? (
                                <GiftFill bgColor="none" size={20} />
                              ) : n.type === '매칭취소' ? (
                                <CloseFill bgColor="none" size={20} />
                              ) : n.type === '댓글' ? (
                                <QuestionAnswerFill bgColor="none" size={20} />
                              ) : n.type === '모집완료' ? (
                                <GroupLine bgColor="none" size={20} />
                              ) : (
                                <StarFill bgColor="none" size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 font-medium">{n.title}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-start min-h-[378px] text-babgray-500">
                  현재 알림이 없습니다.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
