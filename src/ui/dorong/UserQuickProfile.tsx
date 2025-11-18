import { useEffect, useState } from 'react';
import type { Profile } from '@/types/bobType';
import { getProfile } from '@/lib/propile';
import { useNavigate } from 'react-router-dom';

interface Props {
  profileId: string;
}

export function UserQuickProfileContent({ profileId }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfile(profileId);
      setProfile(data);
    };
    fetchData();
  }, [profileId]);

  if (!profile) return <p className="p-4 text-sm">불러오는 중...</p>;

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

      <button
        className="mt-3 w-full py-2 rounded-lg bg-gray-100 text-sm font-medium"
        onClick={() => navigate(`/member/profile/${profileId}`)}
      >
        프로필 보기
      </button>

      <button
        className="mt-2 w-full py-2 rounded-lg bg-babbutton-blue text-white text-sm font-medium"
        onClick={() => navigate(`/member/profile/chat?to=${profileId}`)}
      >
        1:1 채팅
      </button>
    </div>
  );
}
