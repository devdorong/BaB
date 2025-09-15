import { Link } from 'react-router-dom';
import { ButtonFillMd, ButtonLineMd } from '../../ui/button';
import { LogoSm } from '../../ui/Ui';
import { Chat3Line } from '../../ui/Modal';
import { RiChat3Line } from 'react-icons/ri';

const MemberHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 shadow-md bg-bg-bg">
      <div className="flex justify-between w-[1280px] h-[70px] items-center mx-auto">
        <Link to={'/member'}>
          <LogoSm />
        </Link>
        <div className="flex items-center gap-[40px] ">
          <div className="flex items-center gap-[40px]">
            <Link to={'/member/community'}>
              <Chat3Line color="none" bgColor="none" />
              커뮤니티
            </Link>
            <Link to={'/member/reviews'}>맛집리뷰</Link>
            <Link to={'/member/events'}>이벤트</Link>
            <Link to={'/member/support'}>고객센터</Link>
          </div>
          <div className="flex gap-[10px]">
            <Link to={'/member/login'}>
              <ButtonLineMd>로그인</ButtonLineMd>
            </Link>
            <Link to={'/member/signup'}>
              <ButtonFillMd>회원가입</ButtonFillMd>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MemberHeader;

{
  /* <Link to="/member" className="text-xl font-bold text-bab-500">
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
      </div> */
}
