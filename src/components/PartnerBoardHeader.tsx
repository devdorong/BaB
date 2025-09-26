import { RiNotification2Line } from 'react-icons/ri';

interface BoardHeaderProps {
  title: string;
  subtitle: string;
  button?: React.ReactNode;
}

const PartnerBoardHeader = ({ title, subtitle, button }: BoardHeaderProps) => {
  return (
    <div className=" flex w-full bg-white pl-[276px] left-0 top-0 items-center justify-between p-5 border-b border-b-babgray fixed">
      <div className="flex flex-col gap-2">
        {/* 헤더메뉴 클릭시 보여주는 이름 */}
        <p className="text-3xl font-bold">{title}</p>
        {/* ()에 파트너의 이름 들어가도록 */}
        <p className="text-babgray-700">{subtitle}</p>
      </div>
      <div>{button}</div>
    </div>
  );
};

export default PartnerBoardHeader;
