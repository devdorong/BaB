import { Link } from 'react-router-dom';

const MemberHeader = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 shadow-md bg-bg-bg">
      <Link to="/member" className="text-xl font-bold text-bab-500">
        BaB
      </Link>

      <nav className="flex gap-6">
        <Link to="/member/community">커뮤니티</Link>
        <Link to="/member/reviews">맛집리뷰</Link>
        <Link to="/member/events">이벤트</Link>
        <Link to="/member/support">고객센터</Link>
      </nav>

      <div className="flex gap-4">
        <Link to="/member/profile" className="text-babgray-700">
          프로필
        </Link>
        <Link to="/member" className="text-bab-500">
          로그아웃
        </Link>
      </div>
    </header>
  );
};

export default MemberHeader;
