import { useNavigate } from 'react-router-dom';

function IndexPage() {
  const navigate = useNavigate();
  const handleClickPartner = () => {
    navigate('/partner/login');
  };
  const handleClickMember = () => {
    navigate('/member');
  };
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="flex w-fit relative group overflow-hidden">
        <img
          className="w-screen h-screen object-cover transition group-hover:blur-sm outline-none group-hover:scale-105 overflow-hidden"
          src="/unsplash_ZgREXhl8ER0.png"
          alt="파트너 이미지"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300"></div>
        <div className="flex flex-col items-center gap-[18px] text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <span className="text-8xl font-['Impact']">PARTNER</span>

          <button
            onClick={handleClickPartner}
            className="w-64 h-14 px-3.5 py-2.5  rounded-lg inline-flex justify-center items-center gap-2.5 border border-white cursor-pointer hover:bg-bab-500 hover:border-bab-500"
          >
            <div className="justify-start text-white text-base font-bold font-['Inter']">
              파트너로 함께하기
            </div>
          </button>
        </div>
      </div>
      <div className="flex w-fit relative group overflow-hidden">
        <img
          className="w-screen h-screen object-cover transition group-hover:blur-sm outline-none group-hover:scale-105 "
          src="/membermain.png"
          alt="멤버 이미지"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300"></div>
        <div className="flex flex-col items-center gap-[18px] text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <span className="text-8xl font-['Impact']">MEMBER</span>

          <button
            onClick={handleClickMember}
            className="w-64 h-14 px-3.5 py-2.5  rounded-lg inline-flex justify-center items-center gap-2.5 border border-white cursor-pointer hover:bg-bab-500 hover:border-bab-500"
          >
            <div className="justify-start text-white text-base font-bold font-['Inter']">
              회원으로 즐기기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
