import React, { useEffect, useRef, useState } from 'react';
import { useDirectChat } from '../../../contexts/DirectChatContext';
import { supabase } from '../../../lib/supabase';
import type { DirectMessage } from '../../../types/chatType';
import MessageInput from './MessageInput';
import { RiArrowLeftLine, RiArrowLeftSLine } from 'react-icons/ri';

// 날짜별 메시지 그룹 타입 정의 - 같은 날짜의 메세지들을 그룹핑
// 원본데이터를 가공하고 마무리 별도의 파일에 type으로 정의안함.
interface MessageGroup {
  [date: string]: DirectMessage[]; // 날짜 문자열을 키로 하고 해당 날짜의 메시지 배열을 값으로 담음
}

// DirectChatRoom 컴포넌트에 Props 타입 정의
interface DirectChatRoomProps {
  chatId: string;
  onExit?: () => void;
}

function DirectChatRoom({ chatId, onExit }: DirectChatRoomProps) {
  // DirectChatContext에서 필요한 상태와 함수를 가져오기
  const { messages, loading, error, loadMessages, currentChat, exitDirectChat } = useDirectChat();
  // 현재 선택된 채팅방의 ID 상태 관리
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

  // 메세지가 개수가 많으면 하단으로 스크롤을 해야 함.
  // 새 메시지가 추가될 때마다 최신 메시지를 볼 수 있도록 해야 함.
  const messageEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);

  // DOM 업데이트 후 실행되도록 함
  const scrollToBottom = (force: boolean = false) => {
    // DOM 완료 후 실행되도록
    requestAnimationFrame(() => {
      // chat-room-message 클래스를 가진 메시지 컨테이너 찾기
      const messageContainer = document.querySelector('.chat-room-message');
      if (messageContainer) {
        // 메시지 컨테이너의 스크롤을 맨 아래로 설정
        if (force) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        } else {
          // 부드러운 스크롤
          messageContainer.scrollTo({
            top: messageContainer.scrollHeight,
            behavior: 'smooth',
          });
        }
      } else {
        // fallback : 기존 방식을 사용하되 block을 'nearest'로 변경함
        messageEndRef.current?.scrollIntoView({
          behavior: force ? 'auto' : 'smooth',
          block: 'nearest', // 입력창이 보이도록 가장 가까운 위치에 맞춤
          inline: 'nearest',
        });
      }
    });
  };

  // 새로운 메시지가 추가되거나 메시지 목록이 변경이 되면 하단으로 스크롤
  useEffect(() => {
    // 메시지가 왔을 때만 스크롤 실행
    if (messages.length > 0) {
      // 초기 로드시에는 즉시 스크롤
      if (isInitialLoad.current) {
        scrollToBottom(true);
        isInitialLoad.current = false;
      }
      // 메시지가 추가된 경우 부드럽게 스크롤
      else if (messages.length > previousMessageCount.current) {
        scrollToBottom(false);
      }
      previousMessageCount.current = messages.length;
    }
  }, [messages]);

  // 초기 로딩 완료 후 스크롤 (메세지 처음 로딩 완료)
  useEffect(() => {
    if (!loading && messages.length > 0 && isInitialLoad.current) {
      scrollToBottom();
      isInitialLoad.current = false;
    }
  }, [loading, messages]);

  // Supabase Realtime으로 메시지 실시간 동기화
  useEffect(() => {
    if (!chatId) return;
    const subscription = supabase
      .channel(`direct_messages_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        payload => {
          loadMessages(chatId); // 2025-10-21 수정: 실시간 업데이트는 로딩 상태 표시 안함
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, loadMessages]);

  // 채팅방 ID가 변경이 되면 메시지를 다시 로드 (초기 로딩)
  // 2025-10-21 수정: 초기 로딩 시에만 로딩 상태 표시하도록 isInitialLoad: true 전달
  useEffect(() => {
    if (chatId) {
      loadMessages(chatId, true); // 초기 로딩으로 표시
    }
  }, [chatId, loadMessages]);

  // 메시지 시간 포맷팅 함수 : HH:MM:DD 형식 반환
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24시간 형식 사용
    });
  };

  // 날짜 포맷팅 함수 - 오늘 : "오늘", 과거 : "12월 25일"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return '오늘';
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short', // 짧은 월 이름 (예: "12월")
        day: 'numeric', // 숫자 날짜 (예: "25")
      });
    }
  };

  // 메시지를 날짜별로 그룹화하는 함수 - 같은 날짜의 메시지들을 하나의 그룹으로
  // 날짜 구분선도 표시
  // 사용자가 만약 채팅방을 한개 선택하면 각 채팅방의 메세지 내용이 들어옴
  const groupMessagesByDate = (messages: DirectMessage[]): MessageGroup => {
    const groups: MessageGroup = {}; // 날짜별로 그룹화된 메시지를 저장할 객체

    messages.forEach((message: DirectMessage) => {
      const date = new Date(message.created_at).toDateString();
      // 만약 키명으로 새로운 날짜글자가 들어오면 키명을 새로 만들자.
      if (!groups[date]) {
        groups[date] = [];
      }
      // 해당 날짜의 그룹에 메시지 추가
      groups[date].push(message);
    });
    return groups;
  };

  // 현재 사용자 ID (지금은 Mock 버전이어서 current라고 함)
  // 실제 구현에서는 인증된 사용자의 ID를 사용함
  // const currentUserId = 'current';
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('사용자 정보를 가져올 수 없습니다:', error);
          return;
        }
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('사용자 ID 가져오기 오류:', error);
      }
    };

    getCurrentUserId();
  }, []);

  // 채팅방 나가기 처리 함수
  const handleExitChat = async () => {
    if (window.confirm('채팅방을 나가시겠습니까?')) {
      try {
        const success = await exitDirectChat(chatId);
        if (success) {
          alert('채팅방을 나갔습니다.');
          // 페이지 새로고침 또는 채팅방 목록으로 이동
          window.location.reload();
        } else {
          alert('채팅방 나가기에 실패했습니다.');
        }
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
        alert('채팅방 나가기 중 오류가 발생했습니다.');
      }
    }
  };

  // 에러 상태일 때
  if (error) {
    return (
      <div className="chat-room">
        <div className="error-message">
          <p>오류 : {error}</p>
          <button onClick={() => loadMessages(chatId)}>다시 시도</button>
        </div>
      </div>
    );
  }

  // 2025-10-21 수정: 초기 로딩 상태일 때만 로딩 메세지 표현 (메시지가 없을 때만)
  // 기존 메시지가 있을 때는 로딩 화면을 표시하지 않아 UX 개선
  if (loading && messages.length === 0) {
    return (
      <div className="chat-room">
        <div className="loading justify-center mt-10 items-center text-babgray-600">
          메시지를 불러오는 중...
        </div>
      </div>
    );
  }

  // 메시지들을 날짜별로 그룹화 (리랜더링 자동으로 됨)
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-room">
      {/* 채팅방 헤더 - 제목과 나가기 */}
      <div className="chat-room-header">
        {/* 채팅방 정보 */}
        <div className="chat-room-info">
          <h3>{currentChat?.other_user.nickname || '로딩중...'}</h3>
        </div>
        {/* 채팅방 액션 버튼들 */}
        <div className="chat-room-actions">
          {/* 채팅 나가기 */}
          {/* <button className="exit-chat-btn" onClick={handleExitChat}>
            나가기
          </button> */}
        </div>
      </div>
      {/* 모바일 뒤로가기 버튼 */}
      <div
        className="flex lg:hidden h-[80px] items-center gap-2 p-4
                bg-white/80"
      >
        <button onClick={onExit} className="text-babgray-600">
          <RiArrowLeftSLine size={20} />
        </button>
        <h2 className="font-semibold text-babgray-800">{currentChat?.other_user.nickname}</h2>
      </div>

      {/* 메시지 목록 영역 */}
      <div className="chat-room-message">
        {Object.keys(messageGroups).length === 0 ? (
          // 메시지가 없을 때 안내메세지
          <div className="no-message">
            <p>아직 메시지가 없습니다.</p>
            <p>첫 번째 메시지를 보내세요!</p>
          </div>
        ) : (
          // 날짜 별로 그룹화된 메시지 목록 렌더링
          Object.entries(messageGroups).map(([date, dateMessages]: [string, DirectMessage[]]) => (
            <div key={date} className="message-group">
              {/* 날짜 구분선 */}
              <div className="date-divider">
                {/* 날짜 출력 */}
                <span>{formatDate(dateMessages[0].created_at)}</span>
              </div>

              {/* 메시지들 묶음 컨테이너 */}
              <div className="message-group-container">
                {dateMessages.map((message: DirectMessage, index) => {
                  // 시스템 메시지면 따로 렌더링
                  if (message.is_system_message) {
                    return (
                      <div
                        key={message.id}
                        className="flex justify-center my-3 text-bab-400 text-sm font-medium"
                      >
                        <span className="bg-bab-100 px-4 py-1 rounded-full border border-bab-100">
                          {message.content}
                        </span>
                      </div>
                    );
                  }

                  const isMyMessage = message.sender_id === currentUserId;
                  const prevMessage = dateMessages[index - 1];
                  const nextMessage = dateMessages[index + 1];

                  // 보낸 사람 같은지
                  const isSameSenderAsPrev =
                    prevMessage && prevMessage.sender_id === message.sender_id;
                  const isSameSenderAsNext =
                    nextMessage && nextMessage.sender_id === message.sender_id;

                  // 보낸 시간 (분 단위까지)
                  const currentMinute = new Date(message.created_at).getMinutes();
                  const nextMinute = nextMessage && new Date(nextMessage.created_at).getMinutes();

                  // 다음 메시지랑 사람이 같고 분도 같으면 숨김
                  const showTime = !(isSameSenderAsNext && nextMinute === currentMinute);

                  return (
                    <div
                      key={message.id}
                      className={`message-item ${isMyMessage === true ? 'my-message' : 'other-message'}`}
                    >
                      {isMyMessage ? (
                        <>
                          {/* 나의 메시지 - 오른쪽 정렬 */}
                          {showTime && (
                            <div className="message-time">{formatTime(message.created_at)}</div>
                          )}
                          <div className="message-bubble">
                            <div className="message-text">{message.content}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          {!isSameSenderAsPrev ? (
                            <>
                              <div className="message-avatar">
                                <img
                                  src={
                                    message.sender?.avatar_url === 'guest_image' ||
                                    !message.sender?.avatar_url
                                      ? DEFAULT_AVATAR
                                      : message.sender?.avatar_url
                                  }
                                  alt={message.sender?.nickname}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{ padding: '0 24px' }} />
                            </>
                          )}
                          {/* 대화상대 메시지 : 말풍선, 시간, 아바타 (오른쪽 정렬) */}
                          <div className="message-bubble">
                            <div className="message-text">{message.content}</div>
                          </div>
                          {showTime && (
                            <div className="message-time">{formatTime(message.created_at)}</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* 자동 스크롤을 위한 참조 */}
        <div ref={messageEndRef} />
      </div>
      {/* 메시지 입력 컴포넌트 */}
      <MessageInput chatId={chatId} />
    </div>
  );
}

export default React.memo(DirectChatRoom, (prevProps, nextProps) => {
  return prevProps.chatId === nextProps.chatId;
});
