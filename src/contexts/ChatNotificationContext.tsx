/**
 * 새 채팅 알림 Context
 * - 새 채팅 요청 시 알림 상태 관리
 * - 주메뉴에 N 아이콘 표시
 * - 채팅방 입장 시 알림 제거
 */

import { createContext, useCallback, useContext, useState } from 'react';

interface NotificationContextType {
  hasNewChat: boolean; // 새 채팅 알림 상태
  setHasNewChat: (hasNew: boolean) => void; // 알림 상태 설정
  setHasNewChatWithStorage: (hasNew: boolean) => void; // 로컬 스토리지와 함께 알림 상태 설정
  clearNewChatNotification: () => void; // 알림 제거
}

const ChatNotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const ChatNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  // 로컬 스토리지에서 알림 상태 초기화
  const [hasNewChat, setHasNewChat] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hasNewChat');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const clearNewChatNotification = useCallback(() => {
    setHasNewChat(false);
    try {
      localStorage.setItem('hasNewChat', 'false');
    } catch {
      // 로컬 스토리지 오류 무시
    }
  }, []);

  // 알림 상태 변경 시 로컬 스토리지에 저장
  const setHasNewChatWithStorage = useCallback((hasNew: boolean) => {
    setHasNewChat(hasNew);
    try {
      localStorage.setItem('hasNewChat', hasNew.toString());
    } catch {
      // 로컬 스토리지 오류 무시
    }
  }, []);

  return (
    <ChatNotificationContext.Provider
      value={{
        hasNewChat,
        setHasNewChat,
        setHasNewChatWithStorage,
        clearNewChatNotification,
      }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(ChatNotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
