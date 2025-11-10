import { useAdminHeader } from '@/contexts/AdminLayoutContext';
import { GetAllReports, type ReprotsWithNickname } from '@/services/reportService';
import AdminReportsModal from '@/ui/dorong/AdminReportsModal';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RiArrowRightDoubleFill } from 'react-icons/ri';
import type { ReportsType } from '../member/communitys/CommunityDetailPage';

function AdminReportsPage() {
  const { setHeader } = useAdminHeader();
  const [reports, setReports] = useState<ReprotsWithNickname[]>([]);
  const [isReportOpen, setReportOpen] = useState(false);
  const [targetNickname, setTargetNickname] = useState('');
  const [reporterNickname, setReporterNickname] = useState('');
  const [reportType, setReportType] = useState<ReportsType>('댓글');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleReport = async (type: ReportsType, title: string, reason: string) => {
    console.log('신고 접수:', { type, title, reason });
  };

  const openReportModal = (
    nickname: string,
    targetNickname: string,
    type: ReportsType,
    title: string,
    content: string,
  ) => {
    setReporterNickname(nickname);
    setTargetNickname(targetNickname);
    setReportType(type);
    setReportOpen(true);
    setTitle(title);
    setContent(content);
  };
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
  useEffect(() => {
    setHeader('신고 내역', '신고된 채팅과 후기를 관리합니다.');
    const loadReports = async () => {
      try {
        const data = await GetAllReports();
        setReports(data);
      } catch (err) {
        console.error('신고내역 불러오기 실패:', err);
      }
    };

    loadReports();
  }, []);
  const parseReason = (reason: string) => {
    const [title, content] = reason.split(' - ');
    return {
      title: title?.trim() ?? '',
      content: content?.trim() ?? '',
    };
  };

  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
      {/* <h2 className="text-[23px] font-bold text-gray-800 mb-2">신고 내역</h2>
      <p className="text-[13px] text-gray-500 mb-6">신고된 채팅과 후기를 관리합니다.</p> */}

      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-6 items-start justify-start mb-6 bg-white p-[25px] rounded-[16px] shadow">
        <h3 className="font-bold">신고된 콘텐츠</h3>
        {/* 리스트 */}
        {reports.map((r, idx) => {
          const { title, content } = parseReason(r.reason);
          return (
            <div
              key={idx}
              className="flex flex-col p-6 border w-full rounded-2xl cursor-pointer hover:border-bab"
              onClick={() =>
                openReportModal(
                  `${r.reporter_nickname}`,
                  `${r.accused_nickname}`,
                  `${r.report_type}`,
                  title,
                  content,
                )
              }
            >
              <div className="flex items-center gap-3 justify-between">
                <div>{statusBadge(r.report_type)}</div>
                <p className="text-md text-babgray-800">
                  {dayjs(r.created_at).format('YYYY-MM-DD HH:mm')}
                </p>
              </div>
              <div className="flex items-center text-[14px] gap-2 text-babgray-800 pt-3 pb-2">
                <p>신고자:{r.reporter_nickname}</p>
                <RiArrowRightDoubleFill />
                <p>피신고자:{r.accused_nickname}</p>
              </div>
              <div>
                <p className="text-[12px] text-babgray-600 line-clamp-2">{r.reason}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 페이지네이션 */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>총 {reports.length}개의 신고</p>
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
      {isReportOpen && (
        <AdminReportsModal
          reporterNickname={reporterNickname}
          setReports={setReportOpen}
          targetNickname={targetNickname}
          reportType={reportType}
          handleReport={handleReport}
          titleText={title}
          contentText={content}
        />
      )}
    </div>
  );
}

export default AdminReportsPage;
