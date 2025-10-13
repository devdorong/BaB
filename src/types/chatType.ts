// 1:1채팅을 위한 타입

// 사용자 정보
export interface ChatUser {
  id: string; // 사용자 고유 식별자 (UUID)
  email?: string; // 사용자 이메일 주소
  nickname: string; // 표시용 닉네임
  avatar_url?: string | null; // 프로필 이미지 URL (선택사항)
}

// 1:1 채팅 정보
export interface DirectChat {
  id: string; // 채팅방 고유 식별자
  user1_id: string; // 참여자 1 ID
  user2_id: string; // 참여자 2 ID
  created_at: string; // 생성시간
  last_mesaage_at: string; // 마지막 메세지 시간
  user1?: ChatUser; // 참여자 1번의 정보
  user2?: ChatUser; // 참여자 2번의 정보
  last_message?: DirectMessage; // 마지막 메시지 정보
}

// 메시지 타입
export interface DirectMessage {
  id: string; // 메시지 고유 식별자
  chat_id: string; // 채팅방 ID
  sender_id: string; // 발신자 사용자 ID
  content: string; // 메시지 내용
  is_read: boolean; // 읽음 상태
  read_at?: string; // 읽은 시간
  created_at: string; // 전송 시간
  sender?: ChatUser; // 발신자 정보
}

// 메시지의 상세 추가 확장 정보
export interface MessageDetail extends DirectMessage {
  sender: ChatUser;
}

// 채팅방 목록 타입
export interface ChatListItem {
  id: string; // 채팅방 ID
  other_user: ChatUser; // 상대방 사용자 정보
  last_message?: {
    content: string; // 마지막 메시지 내용
    created_at: string; // 작성 시간
    sender_nickname: string; // 보낸사람 닉네임
  };
  unread_count: number; // 읽지 않은 메시지 수
}

// 채팅방 생성용
export interface CreateChatData {
  participant_id: string; // 상대방 사용자 ID
}

// 메시지 전송용
export interface CreateMessageData {
  chat_id: string; // 채팅방 ID
  content: string; // 메시지 내용
}

// 메세지 읽음 상태 업데이트용
export interface UpdateMessageReadData {
  message_id: string; // 메시지 ID
  user_id: string; // 사용자 ID
}

// API 응답 래퍼
export interface ChatApiResponse<T> {
  success: boolean; // 성공 여부
  data?: T; // 응답데이터 (제네릭타입-선택적)
  error?: string; // 에러메시지 (실패시)
}

// 채팅방 상태 타입
export interface ChatState {
  currentChatId?: string; // 현재 활성 채팅방 ID
  messages: DirectMessage[]; // 메시지 목록
  loading: boolean; // 로딩 상태
  error?: string; // 에러메시지
}

// 채팅방 목록 상태 타입
export interface ChatListState {
  chats: ChatListItem[]; // 채팅방 목록
  loading: boolean; // 로딩 상태
  error?: string; // 에러 메시지
}
