/**
 * 1 : 1 채팅 Context Provider
 *  - 1 : 1 채팅 기능 전역 상태 관리
 *  - 채팅방, 메시지, 사용자 검색 등의 상태와 액션 제공
 *
 * 주요 기능
 *  - 채팅방 목록 관리
 *  - 메시지 전송 및 조회
 *  - 사용자 검색
 *  - 에러 처리
 *  - 로딩 상태 관리
 *  - 추후 실시간 채팅 업데이트 필요
 */

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  type ChatListItem,
  type ChatUser,
  type CreateMessageData,
  type DirectMessage,
} from '../types/chatType';
import {
  exitDirectChat,
  findOrCreateDirectChat,
  getChatList,
  getMessages,
  sendMessage as sendMessageService,
  searchUsers as searchUsersService,
} from '../services/directChatService';

/**
 * DirectChatContext 의  Context 타입 정의
 * state 의 모양
 * action 의 모양
 */
/**
 * DirectChatContext의 타입 정의
 * 채팅 관련 상태와 액션을 관리하는 Context의 인터페이스
 */
interface DirectChatContextType {
  // state ========================
  chats: ChatListItem[]; // 채팅방 여러개 관리
  messages: DirectMessage[]; // 여러 메시지를 관리
  users: ChatUser[]; // 검색된 여러 사용자
  currentChat: ChatListItem | null; // 현재 선택된 채팅방 정보
  loading: boolean; // 로딩 상태 관리
  error: string | null; // 에러 메시지 상태
  // action ========================
  loadChats: () => Promise<void>; // 채팅 목록 로딩 상태관리
  loadMessages: (chatId: string) => Promise<void>; // 특정 채팅방의 메시지 조회
  // 메시지가 제대로 전송되었는지 아닌지 체크를 위해서 boolean 리턴 타입
  sendMessage: (messageData: CreateMessageData) => Promise<boolean>; // 메시지 전송
  searchUsers: (searchTerm: string) => Promise<void>; // 검색어(닉네임)롤 사용자 검색
  setUsers: (users: ChatUser[]) => void; // 사용자 목록 직접 설정 (수정사항: 추가됨)
  createDirectChat: (participantId: string) => Promise<string | null>; // 채팅방 생성 또는 접근
  exitDirectChat: (chatId: string) => Promise<boolean>; // 채팅방 나가기
  clearError: () => void; // 에러 상태만 초기화 하기
}
// 컨테스트 생성
const DirectChatContext = createContext<DirectChatContextType | null>(null);

// Provide 의 Props
interface DirectChatProiderProps {
  children: React.ReactNode;
}
// Provider 생성
export const DirectChatProider: React.FC<DirectChatProiderProps> = ({ children }) => {
  // 상태관리
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사용자가 선택해서 활성화한 채팅방의 ID 를 보관함.
  // 리랜더링이 되어서 값이 갱신되거나, 화면에 보여줄 필요는 없음.
  const currentChatId = useRef<string | null>(null);

  // 공통 기능 함수
  // 에러 메시지 전용 함수
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // 액션들
  // 채팅방 목록 가져오기 : 내가 참여한 목록
  const loadChats = useCallback(async () => {
    try {
      // 채팅방 목록 로드 시에는 전역 로딩 상태를 사용하지 않음 (사용자 경험 개선)
      const response = await getChatList();
      if (response.success && response.data) {
        setChats(response.data); // 목록담기
      } else {
        handleError(response.error || '채팅방 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      handleError('채팅방 목록 로드 중 오류가 발생했습니다.');
    }
  }, [handleError]);

  // 선택된 채팅방의 모든 메시지 가져오기
  const loadMessages = useCallback(
    async (chatId: string) => {
      try {
        // 메시지 로드 시에는 전역 로딩 상태를 사용하지 않음 (사용자 경험 개선)

        // 현재 활성화된 채팅방 ID 보관
        currentChatId.current = chatId;

        // 현재 채팅방 정보 찾기
        const chatInfo = chats.find(chat => chat.id === chatId);
        if (chatInfo) {
          setCurrentChat(chatInfo);
        }

        const response = await getMessages(chatId);
        if (response.success && response.data) {
          setMessages(response.data);
        } else {
          handleError(response.error || '메시지를 불러올 수 없습니다.');
        }
      } catch (err) {
        handleError('메시지 로드 중 오류가 발생했습니다.');
      }
    },
    [handleError, chats],
  );

  const sendMessage = useCallback(
    async (messageData: CreateMessageData) => {
      try {
        // 메시지 전송 시에는 전역 로딩 상태를 사용하지 않음 (사용자 경험 개선)
        const response = await sendMessageService(messageData);
        if (response.success && response.data) {
          // 메시지 전송 성공 후 즉시 로컬 상태에 메시지 추가 (자연스러운 UX)
          setMessages(prev => [...prev, response.data!]);

          // 백그라운드에서 데이터 동기화 (사용자에게 방해되지 않음)
          setTimeout(async () => {
            await loadMessages(messageData.chat_id);
            await loadChats();
          }, 100);

          return true;
        } else {
          handleError(response.error || '메시지 전송에 실패했습니다.');
          return false;
        }
      } catch (err) {
        handleError('메시지 전송 중 오류가 발생했습니다.');
        return false;
      }
    },
    [handleError, loadChats, loadMessages],
  );

  /**
   * 검색어로 사용자 목록 출력
   *
   * @param searchTerm - 검색할 사용자 닉네임 또는 이메일
   *
   * 수정사항:
   * - 전역 로딩 상태(setLoading) 제거하여 불필요한 리랜더링 방지
   * - 검색 기능만 담당하도록 단순화
   * - 로딩 상태는 컴포넌트에서 로컬로 관리
   */
  const searchUsers = useCallback(
    async (searchTerm: string) => {
      try {
        // Supabase를 통해 사용자 검색 API 호출
        const response = await searchUsersService(searchTerm);
        if (response.success && response.data) {
          // 검색 성공 시 사용자 목록 상태 업데이트
          setUsers(response.data);
        } else {
          // 검색 실패 시 에러 메시지 설정
          handleError(response.error || '사용자 검색에 실패했습니다.');
        }
      } catch (err) {
        // 예외 발생 시 에러 메시지 설정
        handleError('사용자 검색 중 오류가 발생했습니다.');
      }
    },
    [handleError],
  );

  // 채팅방 생성 또는 있으면 선택
  const createDirectChat = useCallback(
    async (participantId: string): Promise<string | null> => {
      try {
        setLoading(true);
        const response = await findOrCreateDirectChat(participantId);

        if (response.success && response.data) {
          // 채팅방 새로 고침으로 목록 갱신
          await loadChats();
          return response.data.id; // 새 채팅ID 를 전달한 이유는 즉시 채팅방 참여
        } else {
          handleError(response.error || '채팅방 생성에 실패했습니다.');
          return null;
        }
      } catch (err) {
        handleError('채팅방 생성 중 오류가 발생했습니다.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadChats],
  );

  // 채팅방 나가기
  const exitDirectChatHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await exitDirectChat(chatId);
        if (response.success) {
          // 채팅방 목록에서 제거
          setChats(prev => prev.filter(chat => chat.id !== chatId));
          // 현재 채팅방이 나간 채팅방이면 초기화
          if (currentChatId.current === chatId) {
            currentChatId.current = null;
            setCurrentChat(null);
            setMessages([]);
          }
          return true;
        } else {
          handleError(response.error || '채팅방 나가기에 실패했습니다.');
          return false;
        }
      } catch (err) {
        handleError('채팅방 나가기 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // 에러메시지 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context 의 value
  const value: DirectChatContextType = {
    // 상태(state)
    chats,
    messages,
    users,
    currentChat,
    loading,
    error,
    // 액션 (action) : 샹태관리 업데이트 함수
    loadChats,
    loadMessages,
    sendMessage,
    searchUsers,
    setUsers,
    createDirectChat,
    exitDirectChat: exitDirectChatHandler,
    clearError,
  };
  return <DirectChatContext.Provider value={value}>{children}</DirectChatContext.Provider>;
};

// 커스텀 훅
export const useDirectChat = () => {
  const context = useContext(DirectChatContext);
  if (!context) {
    throw new Error('채팅 컨텍스트가 생성되지 않았습니다.');
  }
  return context;
};
