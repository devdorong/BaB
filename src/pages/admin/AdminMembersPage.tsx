import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database, Profile } from '@/types/bobType';
import MemberActivityDetailModal from '@/ui/sdj/MemberActivityDetails';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

type ProfileWithEmail = Profile & {
  email: string;
  created_at: string;
};

export type ProfileStatus = Database['public']['Tables']['profiles']['Row']['status'];

export default function UserManagementPage() {
  const { user: authUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<ProfileStatus>('활성');
  const [userList, setUserList] = useState<ProfileWithEmail[]>([]);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState<'이름순' | '가입일순'>('가입일순');

  const [memberDetail, setMemberDetail] = useState(false);

  const category: ProfileStatus[] = ['활성', '정지', '탈퇴'];

  const filterCategory = useMemo(() => {
    if (statusFilter === '활성') return userList;
    return userList.filter(user => user.status === statusFilter);
  }, [userList, statusFilter]);

  const handleMemberDetail = () => {
    setMemberDetail(true);
  };

  dayjs.locale('ko');

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('profiles_with_email')
      .select('*')
      .eq('role', 'member');
    if (error) {
      console.log('사용자 정보를 가져오는데 실패했습니다.', error.message);
    }
    setUserList(data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    const lower = search.toLowerCase();
    return filterCategory.filter(
      user =>
        user.nickname?.toLowerCase().includes(lower) || user.email?.toLowerCase().includes(lower),
    );
  }, [statusFilter, search]);

  const sortedUsers = useMemo(() => {
    const users = [...filteredUsers];

    if (sortType === '이름순') {
      users.sort((a, b) => a.nickname.localeCompare(b.nickname, 'ko'));
    } else if (sortType === '가입일순') {
      users.sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());
    }

    return users;
  }, [filteredUsers, sortType]);

  return (
    <div className="w-full min-h-screen bg-bg-bg text-babgray-800 font-semibold">
      <div className="p-8">
        <h2 className="text-[23px] font-bold text-gray-800 mb-2">사용자 관리</h2>
        <p className="text-[13px] text-gray-500 mb-6">
          플랫폼 사용자 계정을 관리하고 모니터링합니다.
        </p>

        {/* 검색 및 필터 */}
        <div className="flex items-center justify-between mb-6 bg-white p-[25px] rounded-[16px] shadow">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="닉네임, 이메일로 검색"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value as '이름순' | '가입일순')}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="가입일순">가입일순</option>
              <option value="이름순">이름순</option>
            </select>
          </div>

          {/* 상태 필터 버튼 */}
          <div className="flex space-x-2">
            {category.map(item => (
              <button
                key={item}
                onClick={() => setStatusFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  statusFilter === item
                    ? 'text-orange-600 border-orange-400'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="w-full border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-8 text-left">이름</th>
              <th className="py-3 px-8 text-left">이메일</th>
              <th className="py-3 px-8 text-left">가입일</th>
              <th className="py-3 px-8 text-left">상태</th>
              <th className="py-3 px-8 text-left">활동내역</th>
              <th className="py-3 px-8 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-8 flex items-center space-x-3">
                  <img
                    src={
                      user.avatar_url === 'guest_image'
                        ? `https://www.gravatar.com/avatar/?d=mp&s=200`
                        : user.avatar_url
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.nickname}</span>
                </td>
                <td className="py-3 px-8">{user.email}</td>
                <td className="py-3 px-8">{dayjs(user.created_at).format('YYYY-MM-DD')}</td>
                <td className="py-3 px-8">{user.status}</td>
                <td
                  onClick={handleMemberDetail}
                  className="py-3 px-8 text-orange-500 hover:underline cursor-pointer"
                >
                  상세보기
                </td>
                {memberDetail && (
                  <MemberActivityDetailModal onClose={() => setMemberDetail(false)} />
                )}
                <td className="py-3 px-8">
                  {user.status === '활성' && (
                    <button className="border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-gray-100">
                      정지
                    </button>
                  )}
                  {user.status === '정지' && (
                    <button className="border border-red-300 text-red-500 text-xs px-3 py-1 rounded-full hover:bg-red-50">
                      탈퇴
                    </button>
                  )}
                  {user.status === '탈퇴' && (
                    <button className="border border-green-300 text-green-600 text-xs px-3 py-1 rounded-full hover:bg-green-50">
                      복원
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 */}
      <div className="flex justify-between p-8 items-center mt-4 text-sm text-gray-600">
        <p>총 1,247명의 사용자</p>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`w-7 h-7 rounded-full ${
                num === 1 ? 'bg-orange-500 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
          <span className="text-gray-400">›</span>
        </div>
      </div>
    </div>
  );
}
