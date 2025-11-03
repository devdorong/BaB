import { useEffect, useRef, useState } from 'react';
import { useDirectChat } from '../../../contexts/DirectChatContext';
import type { ChatListItem, DirectChat } from '../../../types/chatType';
import { exitDirectChat } from '@/services/directChatService';
import { toast } from 'sonner';
import { useModal } from '@/ui/sdj/ModalState';
import Modal from '@/ui/sdj/Modal';

interface ChatSwiperItemProps {
  chat: ChatListItem;
  isSelected: boolean;
  onSelect: () => void;
  openChatId: string | null;
  setOpenChatId: (id: string | null) => void;
}

export const ChatSwiperItem = ({
  chat,
  isSelected,
  onSelect,
  openChatId,
  setOpenChatId,
}: ChatSwiperItemProps) => {
  const {
    loadChats,
    createDirectChat,
    error,
    users,
    searchUsers,
    loading,
    userSearchLoading,
    chats,
    exitDirectChat: exitDirectChatFromContext,
  } = useDirectChat();

  const { modal, openModal, closeModal } = useModal();
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const MAX_SWIPE = 80;
  const SWIPE_THRESHOLD = 20; // ← 임계 거리 (이 이상 움직여야 스와이프 인정)
  const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

  useEffect(() => {
    if (openChatId !== chat.id) {
      setOffsetX(0);
    }
  }, [openChatId]);

  // 터치/마우스 시작
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    setIsDragging(true);
  };

  // 이동 중
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX.current - clientX;

    // 아직 threshold 이하이면 무시 (클릭 판정)
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;

    // 왼쪽으로 스와이프 중
    if (diff > 0 && diff <= MAX_SWIPE) {
      setOffsetX(diff);
    }
    // 오른쪽으로 스와이프 중 (닫기)
    else if (diff < 0 && isSwiped) {
      const newOffset = MAX_SWIPE + diff; // diff는 음수
      setOffsetX(Math.max(0, newOffset));
    }
  };

  // 터치/마우스 끝
  const handleEnd = () => {
    setIsDragging(false);
    if (offsetX > MAX_SWIPE / 2) {
      setOffsetX(MAX_SWIPE);
      setIsSwiped(true);
      setOpenChatId(chat.id);
    } else {
      setOffsetX(0);
      setIsSwiped(false);
    }
  };

  // 나가기 처리
  const handleExitChat = async () => {
    // const confirmExit = window.confirm('채팅방을 나가시겠습니까?');
    // if (!confirmExit) return;

    openModal('채팅방 나가기', '채팅방을 나가시겠습니까?', '취소', '확인', async () => {
      try {
        const success = await exitDirectChatFromContext(chat.id);
        if (success) {
          // alert('채팅방을 나갔습니다.');
          toast.info('채팅방을 나갔습니다.', { position: 'top-center' });
          setIsSwiped(false);
          setOffsetX(0);
          setOpenChatId(null);

          if (isSelected) {
            onSelect();
          }
        } else {
          // alert('채팅방 나가기에 실패했습니다.');
          toast.error('채팅방 나가기에 실패했습니다.', { position: 'top-center' });
        }
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
        // alert('채팅방 나가기 중 오류가 발생했습니다.');
        toast.error('채팅방 나가기에 실패했습니다.', { position: 'top-center' });
      }
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* 나가기 버튼 (뒤에 고정) */}
      <div
        className="absolute right-0 top-0 h-full w-[80px] bg-red-500 text-white flex items-center justify-center text-sm font-semibold"
        onClick={handleExitChat}
      >
        나가기
      </div>

      {/* 실제 아이템 */}
      <div
        className={`chat-item ${isSelected ? 'selected' : ''} transition-transform duration-300 ease-in-out relative z-10`}
        style={{ transform: `translateX(-${offsetX}px)` }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onClick={() => {
          if (!isSwiped) onSelect();
        }}
      >
        {/* 아바타 */}
        <div className="chat-avatar">
          <img
            src={
              chat.other_user.avatar_url === 'guest_image' || !chat.other_user.avatar_url
                ? DEFAULT_AVATAR
                : chat.other_user.avatar_url
            }
            alt={chat.other_user.nickname}
          />
          {chat.unread_count > 0 && <div className="unread-badge">{chat.unread_count}</div>}
        </div>
        {/* 채팅 정보 */}
        <div className="chat-info">
          <div className="chat-header">
            <div className="chat-name">{chat.other_user.nickname}</div>
            <div className="chat-time">
              {chat.last_message
                ? new Date(chat.last_message.created_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : ''}
            </div>
          </div>
          <div className="chat-preview">
            {chat.last_message ? (
              <span className={chat.unread_count > 0 ? 'unread' : ''}>
                {chat.last_message.content}
              </span>
            ) : (
              <span className="no-message">
                <br />
              </span>
            )}
          </div>
        </div>
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
