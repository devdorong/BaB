import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database, Profile } from '@/types/bobType';
import MemberActivityDetailModal from '@/ui/sdj/MemberActivityDetails';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category: ProfileStatus[] = ['활성', '정지', '탈퇴'];

  dayjs.locale('ko');

  const fetchData = useCallback(async () => {

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles_with_email')
        .select('*')
        .eq('role', 'member')
        .eq('status', statusFilter);

      if (fetchError) {
        console.error('❌ Supabase 에러:', fetchError);
        setError(fetchError.message);
        setUserList([]);
      } else {
        setUserList(data || []);
      }
    } catch (err) {
      console.error('❌ 예외 발생:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }, [authUser, statusFilter]);

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 검색어 필터링만 수행 (statusFilter는 이미 쿼리에서 처리됨)
  const filteredUsers = useMemo(() => {
    if (!search) return userList;

    const lower = search.toLowerCase();
    return userList.filter(
      user =>
        user.nickname?.toLowerCase().includes(lower) || user.email?.toLowerCase().includes(lower),
    );
  }, [userList, search]);

  // 정렬
  const sortedUsers = useMemo(()  => {
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

        <div className="flex items-center justify-between mb-6 bg-white p-[25px] rounded-[16px] shadow">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="닉네임, 이메일로 검색"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-bab-500"
              />
            </div>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value as '이름순' | '가입일순')}

              className="appearance-none border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-bab-500"

            >
              <option value="가입일순">가입일순</option>
              <option value="이름순">이름순</option>
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? '로딩중...' : '새로고침'}
            </button>
          </div>

          <div className="flex space-x-2">
            {category.map(item => (
              <button
                key={item}
                onClick={() => setStatusFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  statusFilter === item
                    ? 'text-bab-600 border-bab-400'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            오류가 발생했습니다: {error}
          </div>
        )}
      </div>

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
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  사용자 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  표시할 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              <>
                {sortedUsers.map((user, idx) => (
                  <tr key={user.id || idx} className="border-b last:border-b-0 hover:bg-gray-50">
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
                      onClick={() => setMemberDetail(true)}
                      className="py-3 px-8 text-bab-500 hover:underline cursor-pointer"
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
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between p-8 items-center mt-4 text-sm text-gray-600">
        <p>총 {sortedUsers.length}명의 사용자</p>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`w-7 h-7 rounded-full ${
                num === 1 ? 'bg-bab-500 text-white' : 'hover:bg-gray-100 text-gray-600'
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
