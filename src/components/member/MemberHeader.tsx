import { Link } from 'react-router-dom';
import { RiChat3Line } from 'react-icons/ri';
import { LogoSm } from '../../ui/dorong/Ui';
import { ButtonFillMd, ButtonLineMd } from '../../ui/dorong/button';

const MemberHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 shadow-md bg-bg-bg">
      {/* <Link to="/member" className="text-xl font-bold text-bab-500">
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
      </div> */}
      <div className="flex justify-between w-[1280px] h-[70px] items-center">
        <LogoSm />
        <div className="flex items-center gap-[40px] ">
          <div className="flex items-center">
            <div>
              <p>커뮤니티</p>
            </div>
            <div>맛집리뷰</div>
            <div>이벤트</div>
            <div>고객센터</div>
          </div>
          <div>
            <ButtonLineMd>로그인</ButtonLineMd>
            <ButtonFillMd>회원가입</ButtonFillMd>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MemberHeader;
