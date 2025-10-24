/**
 * - 채팅 네비게이션 : 사용자가 참여 중인 채팅방 목록 제공
 * - 상태 표시 : 읽지 않은 메시지와 최신 활동 표시
 * - 새 채팅 시작 : 사용자 검색을 통한 새 채팅방 생성
 */

import { useEffect, useRef, useState } from 'react';
import { useDirectChat } from '../../../contexts/DirectChatContext';
import { supabase } from '../../../lib/supabase';
import type { Profile } from '../../../types/bobType';
import type { ChatUser } from '../../../types/chatType';
import { ChatSwiperItem } from './ChatSwiperItem';

// Props 정의
interface DirectChatListProps {
  children?: React.ReactNode;
  onChatSelect: (chatId: string) => void; // 채팅방 선택시 호출되는 콜백 함수
  onCreateChat: () => void; // 새 채팅방 생성시 호출되는 콜백 함수
  selectedChatId?: string; // 현재 선택된 채팅방의 ID
}

const DirectChatList = ({ onChatSelect, onCreateChat, selectedChatId }: DirectChatListProps) => {
  // ======================== Context 및 상태 관리 ========================
  // DirectChatContext에서 필요한 함수와 상태 추출
  const {
    loadChats,
    createDirectChat,
    error,
    users,
    searchUsers,
    loading,
    userSearchLoading,
    chats,
  } = useDirectChat();

  // 사용자 프로필 상태 (현재 미사용)
  const [profileData, setProfileData] = useState<Profile | null>(null);

  // ======================== 검색 관련 상태 관리 (수정사항) ========================
  const [searchTerm, setSearchTerm] = useState<string>(''); // 사용자 검색어
  const [showUserSearch, setShowUserSearch] = useState<boolean>(false); // 사용자 검색 UI 표시 여부
  const [searchLoading, setSearchLoading] = useState<boolean>(false); // 검색 로딩 상태 (로컬 관리)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 디바운싱을 위한 타이머 참조
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

  // 최초에 컴포넌트 마운트시 채팅 목록
  useEffect(() => {
    loadChats();
  }, [loadChats]); // 신규 또는 메시지 전송 등으로 업데이트 시 채팅목록 호출

  // Supabase Realtime으로 실시간 동기화
  useEffect(() => {
    const subscription = supabase
      .channel('direct_chats_changes') // direct_chats/changes 라는 이름으로 채널을 만든다.
      .on(
        'postgres_changes', // PostgreSQL 데이터 베이스의 변경사항을 알려주는 이벤트 명
        {
          event: '*', // 모든 이벤트 타입을 감지함 (insert, update, delete)
          schema: 'public', // 스키마가 public 인 것이 대상
          table: 'direct_chats', // 변경이 감시되어질 테이블명
        },
        payload => {
          // 변경사항에 대한 상세 정보 (새로운 데이터, 이전 데이터 등..)
          loadChats(); // 변경사항이 있을 때만 새로고침
        },
      )
      .subscribe(); // 구독을 신청한다. (addEventListener 처럼)

    // 클린업 함수 : 컴포넌트가 언마운트 될때, 즉, 화면에서 사라질 때 실행
    return () => {
      // 구독 해제
      subscription.unsubscribe(); // 반드시 해줌. 메모리 누수 방지, 백엔드 부하방지
    };
  }, [loadChats]);

  /**
   * 디바운싱이 적용된 사용자 검색 (수정사항)
   *
   * 주요 개선사항:
   * - 300ms 디바운싱으로 불필요한 API 호출 방지
   * - 로컬 로딩 상태로 전역 리랜더링 방지
   * - 검색어가 비어있을 때 사용자 목록 초기화
   * - 타이머 정리로 메모리 누수 방지
   */

  // 검색어가 비어있지 않을 때만 검색 수행
  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    }
  }, [searchTerm, searchUsers]);

  // 날짜 관련 포맷 설정
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // 24시간 이내인 경우 시간만 표시
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간 형식 사용
      });
    } else {
      // 24시간 이후인 경우 날짜만 표시
      return date.toLocaleDateString('ko-KR', {
        month: 'short', // 짧은 월 이름 (예: "12월")
        day: 'numeric', // 숫자 날짜 (예: "25")
      });
    }
  };

  /**
   * 사용자 선택 시 새 채팅방 생성 및 선택
   * - 처리 과정 :
   * 1. 선택된 사용자와 새 채팅방 생성
   * 2. 생성된 채팅방을 즉시 선택된 것으로 인정
   * 3. 사용자 검색 UI 숨김
   * 4. 사용자 검색어 초기화
   */
  const handleUserSelect = async (user: ChatUser) => {
    // 상대방 선택됨.
    // 상대방의 id를 이용해서 채팅방을 생성해야 합니다.
    const chatId = await createDirectChat(user.id);
    if (chatId) {
      onChatSelect(chatId); // 생성된 채팅방 ID를 전달
      setShowUserSearch(false); // 사용자 검색 UI 숨기기
      setSearchTerm(''); // 검색어 초기화
    }
  };

  // 에러 상태일 때 에러 메시지 표시
  if (error) {
    return (
      <div className="chat-list">
        <div className="error-message">
          <p>오류 : {error}</p>
          <button onClick={loadChats}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list min-h-screen flex bg-white">
      {/* 채팅 목록 헤더 - 제목과 새 채팅 버튼 */}
      <div className="chat-list-header">
        <h2>1 : 1 채팅</h2>
        {/* 사용자가 새 채팅 생성시 showUserSearch를 true로 변경 */}
        <button className="new-chat-btn" onClick={() => setShowUserSearch(!showUserSearch)}>
          새 채팅
        </button>
      </div>
      {/* 사용자 검색 UI - 새 채팅 버튼 클릭 시 표시 */}
      {showUserSearch && (
        <div className="user-search">
          <input
            type="text"
            value={searchTerm} // 사용자 검색어
            onChange={e => setSearchTerm(e.target.value)} //사용자 검색어 변경
            placeholder="사용자 검색..."
            className="search-input"
          />

          {/* ======================== 사용자 검색 결과 목록 (수정사항) ======================== */}
          <div className="search-result">
            {/* 검색 로딩 중일 때 - 로컬 로딩 상태 표시 */}
            {userSearchLoading ? (
              <div className="no-results">사용자 검색 중...</div>
            ) : (
              // 검색된 사용자 출력 - 로딩이 아닐 때만 표시
              users.map(user => (
                // 사용자 중 대화상대를 선택할 수 있음. : handleUserSelect
                <div key={user.id} className="user-item" onClick={() => handleUserSelect(user)}>
                  {/* 사용자 아바타 */}
                  <div className="user-avatar">
                    <img
                      src={
                        user.avatar_url === 'guest_image' || !user.avatar_url
                          ? DEFAULT_AVATAR
                          : user.avatar_url
                      }
                      alt={user.nickname}
                    />
                  </div>
                  {/* 사용자 정보 */}
                  <div className="user-info">
                    <div className="user-nickname">{user.nickname}</div>
                  </div>
                </div>
              ))
            )}

            {/* 사용자가 검색어는 있는데 사용자 목록이 없고 로딩 중이 아닐 때*/}
            {!userSearchLoading && searchTerm && users.length === 0 && (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
      {/* 채팅 목록 컨테이너 */}
      <div className="chat-items">
        {loading ? (
          // 로딩표시
          <div className="loading mt-4 text-babgray-600">로딩 중...</div>
        ) : chats.length === 0 ? (
          // 채팅방이 없을 때 안내 메시지
          <div className="no-chats">
            <p>아직 채팅방이 없습니다.</p>
            <p>새 채팅 버튼을 눌러 대화를 시작해보세요!</p>
          </div>
        ) : (
          // 채팅 목록 렌더링
          chats.map(chat => (
            <ChatSwiperItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onSelect={() => {
                onChatSelect(chat.id);
                setOpenChatId(null);
              }}
              openChatId={openChatId}
              setOpenChatId={setOpenChatId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DirectChatList;
