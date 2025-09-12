import { Link } from 'react-router-dom';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiAlarmLine,
  RiAttachment2,
  RiEmpathizeLine,
  RiEmpathizeFill,
  RiMessage2Line,
  RiMessage2Fill,
  RiNotification2Line,
  RiNotification2Fill,
  RiEBike2Fill,
  RiEBike2Line,
  RiEyeOffLine,
  RiEyeLine,
  RiGitBranchLine,
  RiHeart3Line,
  RiHeart3Fill,
  RiMapPinLine,
  RiPushpinFill,
  RiPushpinLine,
  RiBardFill,
  RiBardLine,
  RiAlarmWarningLine,
  RiChat3Line,
  RiChat3Fill,
  RiEmotionHappyLine,
  RiEmotionLaughLine,
  RiEmotionNormalLine,
  RiEmotionSadLine,
  RiEmotionUnhappyLine,
  RiFireLine,
  RiQuestionAnswerFill,
  RiQuestionAnswerLine,
  RiRepeatFill,
  RiUploadCloud2Line,
  RiGiftLine,
  RiGiftFill,
  RiCloseFill,
  RiCalendarLine,
  RiCustomerServiceLine,
  RiCustomerServiceFill,
  RiSettings5Fill,
  RiSettings5Line,
  RiSettings3Fill,
  RiSettings3Line,
  RiArrowRightLine,
  RiLock2Line,
  RiSearchLine,
  RiMoreFill,
  RiShareLine,
  RiFlagLine,
  RiMore2Fill,
  RiShieldCheckFill,
  RiShieldCheckLine,
  RiSparkling2Fill,
  RiSparkling2Line,
  RiSpeakFill,
  RiSpeakLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiQuestionLine,
  RiRestaurantFill,
  RiDashboardLine,
  RiStoreLine,
  RiFileListLine,
  RiStarFill,
  RiStarLine,
  RiStarHalfFill,
  RiToggleFill,
  RiToggleLine,
  RiLoopLeftLine,
  RiMoneyDollarCircleLine,
  RiMoneyDollarCircleFill,
  RiBarChartLine,
  RiShoppingCartFill,
  RiTableLine,
  RiDownloadLine,
  RiPhoneLine,
  RiTimeLine,
  RiEditLine,
  RiBarChartBoxLine,
  RiImageLine,
  RiCoinLine,
  RiHourglassFill,
  RiAwardLine,
  RiCoupon2Line,
  RiCalendarCheckLine,
  RiAddCircleLine,
  RiLightbulbLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiGroupLine,
  RiUserLine,
  RiUserFill,
  RiUserSettingsLine,
  RiUserAddLine,
  RiUserUnfollowLine,
  RiUserForbidLine,
  RiUserHeartLine,
  RiVisaLine,
  RiMastercardLine,
  RiBarChartFill,
  RiBankCardLine,
  RiCalculatorLine,
  RiHistoryLine,
  RiShareForwardLine,
  RiShieldLine,
} from 'react-icons/ri';
import styled from 'styled-components';

type IconWrapperProps = {
  bgColor?: string;
  color?: string;
  size?: number;
};

const IconWrapper = styled.div<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  padding: 6px;
  background-color: ${({ bgColor }) => bgColor || '#FF5722'};
  color: ${({ color }) => color || 'white'};
  font-size: ${({ size }) => (size ? `${size}px` : '15px')};
`;

const createIcon = (IconComponent: React.ElementType) => {
  return ({ bgColor, color, size }: IconWrapperProps) => (
    <IconWrapper bgColor={bgColor} color={color} size={size}>
      <IconComponent />
    </IconWrapper>
  );
};

// 공통 아이콘
export const AddLine = createIcon(RiAddLine);
export const ArrowDownSLine = createIcon(RiArrowDownSLine);

function IndexPage() {
  return (
    <div>
      <Link to="/member">멤버</Link>
      <Link to="/partner">파트너</Link>
      <ArrowDownSLine bgColor="#f2f2f2" color="black" size={15} />
    </div>
  );
}

export default IndexPage;
