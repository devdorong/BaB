import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/propile';
import type { Profile } from '@/types/bobType';
import { useEffect, useState } from 'react';
import {
  RiAlignRight,
  RiArrowRightCircleLine,
  RiArrowRightDoubleFill,
  RiSearchLine,
} from 'react-icons/ri';

export const mockReports = [
  {
    id: 1,
    report_type: '채팅',
    report_id: null,
    report_int: 101,
    reporter_id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
    accused_profile_id: 'e5b1a832-3b8c-4a47-94fa-0b891b40a1a1',
    reason: '매칭 중 무단으로 나갔습니다.',
    status: '대기',
    penalty: '없음',
    created_at: '2025-03-03T14:22:00+09:00',
    reporter: {
      id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
      nickname: '박지현',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'member',
    },
    accused: {
      id: 'e5b1a832-3b8c-4a47-94fa-0b891b40a1a1',
      nickname: '이민수',
      avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'member',
    },
  },
  {
    id: 2,
    report_type: '댓글',
    report_id: '2ec3f97e-80c4-43b2-93e5-03aa829fc9a0',
    report_int: null,
    reporter_id: 'a22b741d-1f88-4eac-9c71-8b9c9d2d93a7',
    accused_profile_id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
    reason: '부적절한 댓글을 작성했습니다.',
    status: '처리중',
    penalty: '경고',
    created_at: '2025-03-03T14:25:00+09:00',
    reporter: {
      id: 'a22b741d-1f88-4eac-9c71-8b9c9d2d93a7',
      nickname: '김태훈',
      avatar_url: 'https://randomuser.me/api/portraits/men/48.jpg',
      role: 'partner',
    },
    accused: {
      id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
      nickname: '송지아',
      avatar_url: 'https://randomuser.me/api/portraits/women/46.jpg',
      role: 'member',
    },
  },
  {
    id: 3,
    report_type: '리뷰',
    report_id: '7b241f1a-3f42-4e7c-8cf3-3fd0a801c44f',
    report_int: null,
    reporter_id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
    accused_profile_id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
    reason: '리뷰 내용에 욕설이 포함되어 있습니다.',
    status: '완료',
    penalty: '정지',
    created_at: '2025-03-02T18:10:00+09:00',
    reporter: {
      id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
      nickname: '박지현',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'member',
    },
    accused: {
      id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
      nickname: '송지아',
      avatar_url: 'https://randomuser.me/api/portraits/women/46.jpg',
      role: 'member',
    },
  },
  {
    id: 4,
    report_type: '리뷰',
    report_id: 'bda1a1c2-7629-4f77-b6d4-05c5c5e7dc1b',
    report_int: null,
    reporter_id: 'a22b741d-1f88-4eac-9c71-8b9c9d2d93a7',
    accused_profile_id: 'e5b1a832-3b8c-4a47-94fa-0b891b40a1a1',
    reason: '허위 리뷰로 의심되는 내용입니다.',
    status: '처리중',
    penalty: '경고',
    created_at: '2025-03-01T11:00:00+09:00',
    reporter: {
      id: 'a22b741d-1f88-4eac-9c71-8b9c9d2d93a7',
      nickname: '김태훈',
      avatar_url: 'https://randomuser.me/api/portraits/men/48.jpg',
      role: 'partner',
    },
    accused: {
      id: 'e5b1a832-3b8c-4a47-94fa-0b891b40a1a1',
      nickname: '이민수',
      avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'member',
    },
  },
  {
    id: 5,
    report_type: '댓글',
    report_id: 'cb971f4b-f58a-40b3-a6e9-bc197f5b7cc3',
    report_int: null,
    reporter_id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
    accused_profile_id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
    reason: '상대방을 비하하는 댓글입니다.',
    status: '대기',
    penalty: '없음',
    created_at: '2025-02-28T20:40:00+09:00',
    reporter: {
      id: '9d1f85d2-5c02-44a1-b731-5b5f781c9b11',
      nickname: '박지현',
      avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'member',
    },
    accused: {
      id: 'fc2a6f20-0a4a-4e91-9f22-bfe9a1a6a50e',
      nickname: '송지아',
      avatar_url: 'https://randomuser.me/api/portraits/women/46.jpg',
      role: 'member',
    },
  },
];

function AdminReportsPage() {
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');

  const statusBadge = (status: string) => {
    switch (status) {
      case '게시글':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">게시글</span>
        );
      case '댓글':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">댓글</span>
        );
      case '리뷰':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">리뷰</span>
        );
      case '채팅':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">채팅</span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
      <h2 className="text-[23px] font-bold text-gray-800 mb-2">콘텐츠 및 커뮤니티</h2>
      <p className="text-[13px] text-gray-500 mb-6">신고된 채팅과 후기를 관리합니다.</p>

      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-6 items-start justify-start mb-6 bg-white p-[25px] rounded-[16px] shadow">
        <h3 className="font-bold">신고된 콘텐츠</h3>
        {/* 리스트 */}
        {mockReports.map((user, idx) => (
          <div className="flex flex-col p-6 border w-full rounded-2xl">
            <div className="flex items-center gap-3">
              <div>{statusBadge(user.report_type)}</div>
              <p className="text-[11px] text-babgray-800">{user.created_at.toLocaleString()}</p>
            </div>
            <div className="flex items-center text-[14px] gap-2 text-babgray-800 pt-3 pb-2">
              <p>신고자:{user.reporter.nickname}</p>
              <RiArrowRightDoubleFill />
              <p>피신고자:{user.accused.nickname}</p>
            </div>
            <div>
              <p className="text-[12px] text-babgray-600">{user.reason}</p>
            </div>
          </div>
        ))}
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

export default AdminReportsPage;
