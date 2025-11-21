import { useEffect, useState } from 'react';
import type { Profile } from '@/types/bobType';
import { getProfile } from '@/lib/propile';
import { useNavigate } from 'react-router-dom';
import { findOrCreateDirectChat } from '@/services/directChatService';
import { useDirectChat } from '@/contexts/DirectChatContext';
import type { ChatListItem } from '@/types/chatType';
import { supabase } from '@/lib/supabase';

interface Props {
  profileId: string;
}

export function UserQuickProfileContent({ profileId }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { setCurrentChat, loadMessages, loadChats } = useDirectChat();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfile(profileId);
      setProfile(data);
    };
    fetchData();
  }, [profileId]);

  if (!profile) return <p className="p-4 text-sm">불러오는 중...</p>;

  const handleChatClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { success, data } = await findOrCreateDirectChat(profileId);

      if (success && data?.id) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const myId = user?.id;

        // 상대방 ID 구하기
        const otherUserId = data.user1_id === myId ? data.user2_id : data.user1_id;

        await loadChats();

        // DirectChat → ChatListItem 변환
        const chatData: ChatListItem = {
          id: data.id,
          other_user: {
            id: profileId,
            nickname: profile.nickname,
            avatar_url: profile.avatar_url,
            email: '', // 프로필 정보에 이메일이 없다면 빈 문자열 또는 필요한 경우 추가 조회
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
    } catch (error) {
      console.error('채팅방 연결 실패:', error);
      navigate(`/member/profile/chat`);
    }
  };

  return (
    <div className="p-4 w-[220px] flex flex-col items-center text-center">
      <img
        src={
          profile.avatar_url === 'guest_image'
            ? 'https://www.gravatar.com/avatar/?d=mp&s=100'
            : profile.avatar_url
              ? profile.avatar_url
              : 'https://www.gravatar.com/avatar/?d=mp&s=100'
        }
        className="w-16 h-16 rounded-full mb-3 object-cover"
      />
      <div className="text-lg font-bold text-babgray-900">{profile.nickname}</div>

      {profile.comment && (
        <p className="text-sm text-babgray-600 mt-1 line-clamp-2">{profile.comment}</p>
      )}

      {/* <button
        className="mt-3 w-full py-2 rounded-lg bg-gray-100 text-sm font-medium"
        onClick={() => navigate(`/member/profile/${profileId}`)}
      >
        프로필 보기
      </button> */}

      <button
        className="mt-2 w-full py-2 rounded-lg bg-babbutton-blue text-white text-sm font-medium"
        onClick={handleChatClick}
      >
        1:1 채팅
      </button>
    </div>
  );
}
