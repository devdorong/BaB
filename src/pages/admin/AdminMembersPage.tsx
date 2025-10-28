// src/pages/admin/UserManagementPage.tsx
import { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

const mockUsers = [
  {
    name: '도현',
    email: 'ehgus1@gmail.com',
    joined: '2025.09.02',
    status: '활성',
  },
  {
    name: '도현',
    email: 'ehgus1@gmail.com',
    joined: '2025.09.02',
    status: '활성',
  },
  {
    name: '도현',
    email: 'ehgus1@gmail.com',
    joined: '2025.09.02',
    status: '활성',
  },
  {
    name: '도현',
    email: 'ehgus1@gmail.com',
    joined: '2025.09.02',
    status: '정지',
  },
  {
    name: '도현',
    email: 'ehgus1@gmail.com',
    joined: '2025.09.02',
    status: '탈퇴',
  },
];

export default function UserManagementPage() {
  const [filter, setFilter] = useState('전체');

  const statusBadge = (status: string) => {
    switch (status) {
      case '활성':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">활성</span>
        );
      case '정지':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">정지</span>
        );
      case '탈퇴':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">탈퇴</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
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
              placeholder="이름, 이메일로 검색"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <select className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
            <option>가입일순</option>
            <option>이름순</option>
          </select>
        </div>

        {/* 상태 필터 버튼 */}
        <div className="flex space-x-2">
          {['전체', '활성', '정지', '탈퇴'].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                filter === item
                  ? 'text-orange-600 border-orange-400'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="w-screen border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">이름</th>
              <th className="py-3 px-6 text-left">이메일</th>
              <th className="py-3 px-6 text-left">가입일</th>
              <th className="py-3 px-6 text-left">상태</th>
              <th className="py-3 px-6 text-left">활동내역</th>
              <th className="py-3 px-6 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-6 flex items-center space-x-3">
                  <img
                    src="https://placekitten.com/40/40"
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.joined}</td>
                <td className="py-3 px-6">{statusBadge(user.status)}</td>
                <td className="py-3 px-6 text-orange-500 hover:underline cursor-pointer">
                  상세보기
                </td>
                <td className="py-3 px-6">
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
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
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
