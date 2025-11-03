import { Link, useNavigate } from 'react-router-dom';
import { Instagram, KakaoTalk } from '../../ui/Icon';
import logo from '/images/logo_sm.png';

const MemberFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="hidden lg:flex w-full bg-white border-t-2 text-gray-600">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* 상단 영역 */}
        <div className="flex justify-between">
          {/* 로고 */}
          <div>
            <img src={logo} alt="logo" onClick={() => navigate('/')} className="cursor-pointer" />
          </div>
          {/* 링크 */}
          <div className="justify-center flex gap-4 mx-auto">
            <Link to={`/privacy`}>이용약관</Link>
            <Link to={`/perpolicy`}>
              <strong>개인정보처리방침</strong>
            </Link>
          </div>
          <div className="flex gap-4">
            <Link to={`https://www.instagram.com/`}>
              <Instagram color="black" bgColor="#E5E7EB" size={25} padding={8} />
            </Link>
            <Link to={`https://open.kakao.com/o/g833oUTh`}>
              <KakaoTalk color="black" bgColor="#E5E7EB" size={25} padding={8} />
            </Link>
          </div>
        </div>
        <div className="text-babgray-500">
          <p className="">Bond and Bite</p>
        </div>
        <div className="flex justify-center font-bold">
          <p>© 2025 BaB.All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MemberFooter;
