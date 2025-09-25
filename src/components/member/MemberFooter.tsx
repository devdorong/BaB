import { Link, useNavigate } from 'react-router-dom';
import { Instagram, KakaoTalk } from '../../ui/Icon';
import logo from '/images/logo_sm.png';

const MemberFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full flex flex-col gap h-[155px] bg-white text-gray-600 border-t-2">
      <div className="w-[1280px] mx-auto p-8">
        <div className="flex justify-between">
          <div>
            <img src={logo} alt="logo" onClick={() => navigate('/')} className="cursor-pointer" />
          </div>
          <div className="justify-center flex gap-4 mx-auto">
            <Link to={`/privacy`}>이용약관</Link>
            <Link to={`/perpolicy`}>
              <strong>개인정보처리방침</strong>
            </Link>
          </div>
          <div className="flex gap-4">
            <Link to={`/instar`}>
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
