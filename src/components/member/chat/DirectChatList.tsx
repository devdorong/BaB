/**
 * - 채팅 네비게이션 : 사용자가 참여 중인 채팅방 목록 제공
 * - 상태 표시 : 읽지 않은 메시지와 최신 활동 표시
 * - 새 채팅 시작 : 사용자 검색을 통한 새 채팅방 생성
 */

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useDirectChat } from '../../../contexts/DirectChatContext';
import type { ChatUser } from '../../../types/chatType';
import type { Profile } from '../../../types/bobType';

// Props 정의
interface DirectChatListProps {
  children?: React.ReactNode;
  onChatSelect: (chatId: string) => void; // 채팅방 선택시 호출되는 콜백 함수
  onCreateChat: () => void; // 새 채팅방 생성시 호출되는 콜백 함수
  selectedChatId?: string; // 현재 선택된 채팅방의 ID
}

const DirectChatList = ({ onChatSelect, onCreateChat, selectedChatId }: DirectChatListProps) => {
  // Context 활용
  const { loadChats, createDirectChat, error, users, searchUsers, loading, chats } =
    useDirectChat();

  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);

  // 사용자 검색 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>(''); // 사용자 검색어
  const [showUserSearch, setShowUserSearch] = useState<boolean>(false); // 사용자 검색 UI 표시 여부

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
      .subscribe(); // 구독으 신청한다. (addEventListener 처럼)

    // 클린업 함수 : 컴포넌트가 언마운트 될때, 즉, 화면에서 사라질 때 실행
    return () => {
      // 구독 해제
      subscription.unsubscribe(); // 반드시 해줌. 메모리 누수 방지, 백엔드 부하방지
    };
  }, [loadChats]);

  // 컴포넌트가 변경시 사용자 검색 즉시 실행
  // 검색어가 비어있지 않을 때만 검색 수행
  useEffect(() => {
    // 사용자 검색어가 만약 있다면
    if (searchTerm.trim()) {
      // console.log('db에서 사용자 닉네임을 실시간으로 검색');
      // 검색어가 입력이 되면 Service의 사용자 검색 API를 호출해야 한다.
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
    <div className="chat-list">
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

          {/* 사용자 검색 결과 목록 */}
          <div className="search-result">
            {/* 검색된 사용자 출력 */}
            {users.map(user => (
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
            ))}

            {/* 검색 결과가 없을 때 표시 */}
            {/* 사용자 검색어는 있는데 사용자 목록이 없다면 */}
            {searchTerm && users.length === 0 && (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
      {/* 채팅 목록 컨테이너 */}
      <div className="chat-items">
        {loading ? (
          // 로딩표시
          <div className="loading">로딩 중...</div>
        ) : chats.length === 0 ? (
          // 채팅방이 없을 때 안내 메시지
          <div className="no-chats">
            <p>아직 채팅방이 없습니다.</p>
          </div>
        ) : (
          // 채팅 목록 렌더링
          chats.map(chat => (
            // 개별 채팅 아이템
            <div
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
              onClick={() => onChatSelect(chat.id)}
            >
              {/* 채팅 상대방 아바타 */}
              <div className="chat-avatar">
                <img
                  src={
                    chat.other_user.avatar_url === 'guest_image' || !chat.other_user.avatar_url
                      ? DEFAULT_AVATAR
                      : chat.other_user.avatar_url
                  }
                  alt={chat.other_user.nickname}
                />
                {/* 읽지 않은 메시지 개수 배지 */}
                {chat.unread_count > 0 && <div className="unread-badge">{chat.unread_count}</div>}
              </div>

              {/* 채팅 정보 */}
              <div className="chat-info">
                {/* 채팅 헤더 - 이름과 시간 */}
                <div className="chat-header">
                  <div className="chat-name">{chat.other_user.nickname}</div>
                  <div className="chat-time">
                    {chat.last_message ? formatTime(chat.last_message.created_at) : ''}
                  </div>
                </div>
                {/* 마지막 메시지 미리보기 */}
                <div className="chat-preview">
                  {chat.last_message ? (
                    <span className={chat.unread_count > 0 ? 'unread' : ''}>
                      {chat.last_message.sender_nickname} : {chat.last_message.content}
                    </span>
                  ) : (
                    <span className="no-message">메시지가 없습니다.</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DirectChatList;
