import { Link, useNavigate } from 'react-router-dom';
import { Instagram, KakaoTalk } from '../../ui/Icon';
import logo from '/images/logo_sm.png';

const MemberFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-white border-t-2 text-gray-600">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* 상단 영역 */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:items-start">
          {/* 로고 */}
          <div className="flex justify-center sm:justify-start">
            <img
              src={logo}
              alt="logo"
              onClick={() => navigate('/')}
              className="cursor-pointer w-[90px] sm:w-[110px]"
            />
          </div>

          {/* 링크 */}
          <div
            className="
                flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm 
                sm:text-base
              "
          >
            <Link to={`/privacy`} className="hover:text-gray-900 whitespace-nowrap">
              이용약관
            </Link>
            <Link to={`/perpolicy`} className="font-bold hover:text-gray-900 whitespace-nowrap">
              개인정보처리방침
            </Link>
            <Link to={`/member/support`} className="hover:text-gray-900 whitespace-nowrap">
              고객센터
            </Link>
            <Link to={`/location-service`} className="hover:text-gray-900 whitespace-nowrap">
              위치기반서비스 이용약관
            </Link>
            <Link to={`/youth-policy`} className="hover:text-gray-900 whitespace-nowrap">
              청소년 보호 정책
            </Link>
          </div>

          {/* SNS 아이콘 */}
          <div className="flex justify-center sm:justify-end gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="인스타그램"
            >
              <Instagram color="black" bgColor="#E5E7EB" size={25} padding={8} />
            </a>

            <a
              href="https://open.kakao.com/o/sf561R0h"
              target="_blank"
              rel="noopener noreferrer"
              title="카카오톡 오픈링크"
            >
              <KakaoTalk color="black" bgColor="#E5E7EB" size={25} padding={8} />
            </a>
          </div>
        </div>

        {/* 중간 텍스트 */}
        <div className="text-babgray-500 text-center">
          <p>Bond and Bite</p>
        </div>

        {/* 하단 영역 */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-bold text-sm sm:text-base">© 2025 BaB. All rights reserved.</p>
          <p className="text-sm text-babgray-500">
            dev.dorong@gmail.com | dev.gsheep@gmail.com | dev.seastj@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MemberFooter;
