import { useAdminHeader } from '@/contexts/AdminLayoutContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/bobType';
import MemberActivityDetailModal from '@/ui/sdj/MemberActivityDetails';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';

export type RestaurantStatus = Database['public']['Tables']['restaurants']['Row']['status'];
export type RestaurantWithProfile =
  Database['public']['Views']['restaurants_with_profiles_and_email']['Row'];

const ITEMS_PER_PAGE = 10;

export default function AdminPartnersPage() {
  const navigate = useNavigate();
  const { setHeader } = useAdminHeader();
  const { user: authUser } = useAuth();
  const { id } = useParams();
  const [userList, setUserList] = useState<RestaurantWithProfile[]>([]);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState<'이름순' | '가입일순'>('가입일순');

  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<RestaurantStatus>('pending');
  const categories: { label: string; value: RestaurantStatus }[] = [
    { label: '대기', value: 'pending' },
    { label: '승인', value: 'approved' },
    { label: '거절', value: 'rejected' },
    { label: '임시', value: 'draft' },
  ];
  const [memberDetail, setMemberDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDetail = (restaurant: RestaurantWithProfile) => {
    navigate(`/admin/partners/${restaurant.restaurant_id}`, {
      state: { restaurant },
    });
  };

  const filterCategory = useMemo(() => {
    return userList.filter(user => user.restaurant_status === statusFilter);
  }, [userList, statusFilter]);

  dayjs.locale('ko');

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('restaurants_with_profiles_and_email').select(`*`);
    // .eq('owner_role', 'partner');
    if (error) {
      console.log('파트너 정보를 가져오는데 실패했습니다.', error.message);
    }
    setUserList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authUser) return; // 세션 복원 전에는 실행하지 않음
    fetchData();
  }, [authUser]);

  const filteredUsers = useMemo(() => {
    const lower = search.toLowerCase();
    return filterCategory.filter(
      user =>
        user.owner_nickname?.toLowerCase().includes(lower) ||
        user.owner_email?.toLowerCase().includes(lower),
    );
  }, [filterCategory, search]);

  const sortedUsers = useMemo(() => {
    const users = [...filteredUsers];

    if (sortType === '이름순') {
      users.sort((a, b) => (a.owner_nickname ?? '').localeCompare(b.owner_nickname ?? '', 'ko'));
    } else if (sortType === '가입일순') {
      users.sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());
    }

    return users;
  }, [filteredUsers, sortType]);

  // 페이지네이션
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = sortedUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => {
    setHeader('파트너 관리', '플랫폼 파트너 계정을 관리하고 모니터링합니다.');
  }, []);

  return (
    <div className="w-full min-h-screen bg-bg-bg text-babgray-800 font-semibold">
      <div className="p-8">
        {/* <h2 className="text-[23px] font-bold text-gray-800 mb-2">파트너 관리</h2>
        <p className="text-[13px] text-gray-500 mb-6">
          플랫폼 파트너 계정을 관리하고 모니터링합니다.
        </p> */}

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
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:border-bab-500"
              />
            </div>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value as '이름순' | '가입일순')}
              className="appearance-none cursor-pointer border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-bab-500"
            >
              <option value="가입일순">가입일순</option>
              <option value="이름순">이름순</option>
            </select>
          </div>

          {/* 상태 필터 버튼 */}
          <div className="flex space-x-2">
            {categories.map(item => (
              <button
                key={item.value}
                onClick={() => setStatusFilter(item.value)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  statusFilter === item.value
                    ? 'text-bab border-bab'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
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
              <th className="py-3 px-8 text-left">매장정보</th>
              {/* <th className="py-3 px-8 text-left">정산내역</th> */}
              <th className="py-3 px-8 text-left">상태</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  파트너 목록을 불러오는 중입니다...
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  표시할 파트너가 없습니다.
                </td>
              </tr>
            ) : (
              <>
                {paginatedList.map((user, idx) => (
                  <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-8 flex items-center space-x-3">
                      <img
                        src={
                          user.restaurant_thumbnail_url
                            ? user.restaurant_thumbnail_url === 'guest_image'
                              ? `https://www.gravatar.com/avatar/?d=mp&s=200`
                              : user.restaurant_thumbnail_url
                            : 'https://www.gravatar.com/avatar/?d=mp&s=200'
                        }
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{user.owner_name}</span>
                    </td>
                    <td className="py-3 px-8">{user.owner_email}</td>
                    <td className="py-3 px-8">{dayjs(user.created_at).format('YYYY-MM-DD')}</td>
                    <td className="py-3 px-8">{user.owner_nickname}</td>
                    {/* <td
                      onClick={handleMemberDetail}
                      className="py-3 px-8 text-bab hover:underline cursor-pointer"
                    >
                      상세보기
                    </td> */}
                    {memberDetail && (
                      <MemberActivityDetailModal onClose={() => setMemberDetail(false)} />
                    )}
                    <td className="py-3 px-2">
                      {user.restaurant_status === 'rejected' && (
                        <div className="text-gray-600 text-xs px-3 py-1 ">파트너 거절</div>
                      )}
                      {user.restaurant_status === 'draft' && (
                        <div className="text-gray-600 text-xs px-3 py-1 ">임시 저장중</div>
                      )}
                      {user.restaurant_status === 'pending' && (
                        <div
                          onClick={() => handleDetail(user)}
                          className="text-bab text-xs px-3 py-1 cursor-pointer"
                        >
                          파트너 대기
                        </div>
                      )}
                      {user.restaurant_status === 'approved' && (
                        <div className="text-green-600 text-xs px-3 py-1 ">파트너 승인</div>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 */}
      <div className="flex justify-between p-8 items-center mt-4 text-sm text-gray-600">
        <p>총 {sortedUsers.length}명의 파트너</p>

        {/* 페이지네이션 */}
        {paginatedList.length > 0 && (
          <div className="flex justify-center gap-2 mt-4 sm:mt-6 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 bg-bg-bg rounded hover:bg-bab hover:text-white disabled:opacity-50 transition"
            >
              <RiArrowLeftSLine size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`p-2 py-0 rounded hover:bg-bab hover:text-white ${
                  currentPage === idx + 1 ? 'text-bab' : 'bg-bg-bg'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-2 bg-white rounded hover:bg-bab hover:text-white disabled:opacity-50 transition"
            >
              <RiArrowRightSLine size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
