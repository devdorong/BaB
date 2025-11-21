import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import type { Profile } from '@/types/bobType';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileButton({ profileData }: { profileData: Profile | null }) {
  const { signOut } = useAuth();
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <button className="cursor-pointer inline-flex items-center">
            {profileData?.nickname}님
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          className="w-40 flex flex-col p-0 absolute top-[10px] left-[120px]"
        >
          <PopoverClose asChild>
            <Link to="/member/profile">
              <div className="hover:bg-muted cursor-pointer px-4 py-3 text-sm">프로필</div>
            </Link>
          </PopoverClose>

          <PopoverClose asChild>
            <div
              onClick={() => signOut()}
              className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
            >
              로그아웃
            </div>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
