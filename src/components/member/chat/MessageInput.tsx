/**
 * 1:1채팅에서 메시지를 입력하고 전송하는 컴포넌트
 * - 자동 높이 조절되는 텍스트 영역
 * - Enter 키로 메시지 전송, Shift + Enter로 줄바꿈
 * - 전송 중 로딩 상태 표시
 * - 빈 메시지 전송 방지
 * - 전송 후 입력 필드 자동 초기화
 */

import { useRef, useState } from 'react';
import { useDirectChat } from '../../../contexts/DirectChatContext';


interface MessageInputProps {
  chatId: string;
}

const MessageInput = ({ chatId }: MessageInputProps) => {
  // DirectChatContext에서 메시지 전송 함수 가져오기
  const { sendMessage } = useDirectChat();
  // 메시지 입력 상태 관리
  const [message, setMessage] = useState(''); // 현재 입력 중인 메시지
  const [sending, setSending] = useState(false); // 메시지 전송 중 상태

  // textarea 영역 DOM 참조 (자동 높이 조절 활용)
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 전송 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    // 웹브라우저 새로고침 방지
    e.preventDefault();
    // 메세지가 없거나 전송중인 상태라면...
    if (!message.trim() || sending) {
      return;
    }
    // 전송 중인 상태로 중복 전송 방지
    setSending(true);
    try {
      // DirectChatContext의 sendMessage
      const success = await sendMessage({
        chat_id: chatId,
        content: message.trim(),
      });

      // 전송 성공시 처리
      if (success) {
        setMessage(''); // 메세지 내용 초기화
        // 텍스트 영역 높이를 자동으로 리셋
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    } catch (error) {
      // 전송 실패시 에러
      console.log('메세지 전송 오류 : ', error);
    } finally {
      setSending(false);
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Enter키가 눌렸고, Shift 키가 함께 눌리지 않은 경우
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 줄 바꿈 동작 방지
      handleSubmit(e); // 메세지 전송 실행
    }
    // shift + Enter의 경우 기본 동작 (줄바꿈)을 유지
  };

  // 텍스트 영역 변경 처리 함수
  // 최대 높이(120px)
  // 텍스트 영역의 높이를 내용에 맞게 자동 조절
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 입력된 텍스트를 상태에 저장
    setMessage(e.target.value);
    // 자동 높이 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    // 스크롤 높이와 최대 높이 (120px)중 작은 값을 적용
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="message-form">
        {/* 입력 컨테이너 - 텍스트 영역과 전송 버튼 */}
        <div className="input-container">
          {/* 메시지 입력 텍스트 영역 */}
          <textarea
            ref={textareaRef} // DOM 참조를 위한 ref
            value={message}
            onChange={handleTextareaChange} // 텍스트 변경시 높이 조절 및 메시지 보관
            onKeyDown={handleKeyPress} // Enter 처리 (Shift + Enter 예외처리)
            className="message-textarea"
            rows={1}
            placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
            disabled={sending} // 전송 중일때 비활성
          />
          {/* 메시지 전송 버튼 */}
          <button
            type="submit"
            className="send-button"
            disabled={!message.trim() || sending} // 빈 메시지거나 전송중일때 비활성
          >
            {sending ? (
              <>
                {/* 전송 중일 때 로딩 스피너 표시 */}
                <div className="loading-spinner"></div>
              </>
            ) : (
              <>
                {/* 평상시 전송 아이콘 표시 (종이비행기 모양) */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
