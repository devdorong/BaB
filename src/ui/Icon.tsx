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
  RiInstagramLine,
  RiKakaoTalkFill,
  RiMailLine,
} from 'react-icons/ri';
import styled from 'styled-components';

// type IconWrapperProps = {
//   bgColor?: string;
//   color?: string;
//   size?: number;
// };

// const IconWrapper = styled.div<IconWrapperProps>`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 25px;
//   padding: 6px;
//   background-color: ${({ bgColor }) => bgColor || '#FF5722'};
//   color: ${({ color }) => color || 'white'};
//   font-size: ${({ size }) => (size ? `${size}px` : '15px')};
// `;

// const createIcon = (IconComponent: React.ElementType) => {
//   return ({ bgColor, color, size }: IconWrapperProps) => (
//     <IconWrapper bgColor={bgColor} color={color} size={size}>
//       <IconComponent />
//     </IconWrapper>
//   );
// };
// 1. 타입 정의
interface IconWrapperProps {
  $bgColor?: string;
  $color?: string;
  $size?: number;
  $padding?: number;
}

// 2. styled component
const IconWrapper = styled.div<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: ${({ $padding }) => `${$padding}px` || '6px'};
  background-color: ${({ $bgColor }) => $bgColor || '#FF5722'};
  color: ${({ $color }) => $color || 'white'};
  font-size: ${({ $size }) => ($size ? `${$size}px` : '15px')};
`;

// 3. HOC
const createIcon = (IconComponent: React.ElementType) => {
  return ({
    bgColor,
    color,
    size,
    padding,
  }: {
    bgColor?: string;
    color?: string;
    size?: number;
    padding?: number;
  }) => (
    <IconWrapper $bgColor={bgColor} $color={color} $size={size} $padding={padding}>
      <IconComponent />
    </IconWrapper>
  );
};

/**
 * 아이콘 사용법
 * <ShareForwardLine bgColor="배경색상" color="아이콘색상" size={크기} />
 */

// 아이콘 생성
export const AddLine = createIcon(RiAddLine);
export const ArrowDownSLine = createIcon(RiArrowDownSLine);
export const ShareForwardLine = createIcon(RiShareForwardLine);
export const GroupLine = createIcon(RiGroupLine);
export const UserLine = createIcon(RiUserLine);
export const UserFill = createIcon(RiUserFill);
export const UserSettingsLine = createIcon(RiUserSettingsLine);
export const UserAddLine = createIcon(RiUserAddLine);
export const UserUnfollowLine = createIcon(RiUserUnfollowLine);
export const UserForbidLine = createIcon(RiUserForbidLine);
export const UserHeartLine = createIcon(RiUserHeartLine);
export const VisaLine = createIcon(RiVisaLine);
export const MastercardLine = createIcon(RiMastercardLine);
export const BarChartFill = createIcon(RiBarChartFill);
export const BankCardLine = createIcon(RiBankCardLine);
export const CalculatorLine = createIcon(RiCalculatorLine);
export const HistoryLine = createIcon(RiHistoryLine);
export const ShieldLine = createIcon(RiShieldLine);
export const PhoneLine = createIcon(RiPhoneLine);
export const TimeLine = createIcon(RiTimeLine);
export const EditLine = createIcon(RiEditLine);
export const BarChartBoxLine = createIcon(RiBarChartBoxLine);
export const ImageLine = createIcon(RiImageLine);
export const CoinLine = createIcon(RiCoinLine);
export const HourglassFill = createIcon(RiHourglassFill);
export const AwardLine = createIcon(RiAwardLine);
export const Coupon2Line = createIcon(RiCoupon2Line);
export const CalendarCheckLine = createIcon(RiCalendarCheckLine);
export const AddCircleLine = createIcon(RiAddCircleLine);
export const LightbulbLine = createIcon(RiLightbulbLine);
export const CheckLine = createIcon(RiCheckLine);
export const DeleteBinLine = createIcon(RiDeleteBinLine);
export const CheckDoubleLine = createIcon(RiCheckDoubleLine);
export const SpeakLine = createIcon(RiSpeakLine);
export const ErrorWarningLine = createIcon(RiErrorWarningLine);
export const CheckboxCircleLine = createIcon(RiCheckboxCircleLine);
export const QuestionLine = createIcon(RiQuestionLine);
export const RestaurantFill = createIcon(RiRestaurantFill);
export const DashboardLine = createIcon(RiDashboardLine);
export const StoreLine = createIcon(RiStoreLine);
export const FileListLine = createIcon(RiFileListLine);
export const StarFill = createIcon(RiStarFill);
export const StarLine = createIcon(RiStarLine);
export const StarHalfFill = createIcon(RiStarHalfFill);
export const ToggleFill = createIcon(RiToggleFill);
export const ToggleLine = createIcon(RiToggleLine);
export const LoopLeftLine = createIcon(RiLoopLeftLine);
export const MoneyDollarCircleLine = createIcon(RiMoneyDollarCircleLine);
export const MoneyDollarCircleFill = createIcon(RiMoneyDollarCircleFill);
export const BarChartLine = createIcon(RiBarChartLine);
export const ShoppingCartFill = createIcon(RiShoppingCartFill);
export const TableLine = createIcon(RiTableLine);
export const DownloadLine = createIcon(RiDownloadLine);
export const GiftFill = createIcon(RiGiftFill);
export const CloseFill = createIcon(RiCloseFill);
export const CalendarLine = createIcon(RiCalendarLine);
export const CustomerServiceLine = createIcon(RiCustomerServiceLine);
export const CustomerServiceFill = createIcon(RiCustomerServiceFill);
export const Settings5Fill = createIcon(RiSettings5Fill);
export const Settings5Line = createIcon(RiSettings5Line);
export const Settings3Fill = createIcon(RiSettings3Fill);
export const Settings3Line = createIcon(RiSettings3Line);
export const ArrowRightLine = createIcon(RiArrowRightLine);
export const Lock2Line = createIcon(RiLock2Line);
export const SearchLine = createIcon(RiSearchLine);
export const MoreFill = createIcon(RiMoreFill);
export const ShareLine = createIcon(RiShareLine);
export const FlagLine = createIcon(RiFlagLine);
export const More2Fill = createIcon(RiMore2Fill);
export const ShieldCheckFill = createIcon(RiShieldCheckFill);
export const ShieldCheckLine = createIcon(RiShieldCheckLine);
export const Sparkling2Fill = createIcon(RiSparkling2Fill);
export const Sparkling2Line = createIcon(RiSparkling2Line);
export const SpeakFill = createIcon(RiSpeakFill);
export const Heart3Fill = createIcon(RiHeart3Fill);
export const MapPinLine = createIcon(RiMapPinLine);
export const PushpinFill = createIcon(RiPushpinFill);
export const PushpinLine = createIcon(RiPushpinLine);
export const BardFill = createIcon(RiBardFill);
export const AlarmWarningLine = createIcon(RiAlarmWarningLine);
export const Chat3Line = createIcon(RiChat3Line);
export const Chat3Fill = createIcon(RiChat3Fill);
export const EmotionHappyLine = createIcon(RiEmotionHappyLine);
export const EmotionLaughLine = createIcon(RiEmotionLaughLine);
export const EmotionNormalLine = createIcon(RiEmotionNormalLine);
export const EmotionSadLine = createIcon(RiEmotionSadLine);
export const EmotionUnhappyLine = createIcon(RiEmotionUnhappyLine);
export const FireLine = createIcon(RiFireLine);
export const QuestionAnswerFill = createIcon(RiQuestionAnswerFill);
export const QuestionAnswerLine = createIcon(RiQuestionAnswerLine);
export const RepeatFill = createIcon(RiRepeatFill);
export const UploadCloud2Line = createIcon(RiUploadCloud2Line);
export const GiftLine = createIcon(RiGiftLine);
export const AlarmLine = createIcon(RiAlarmLine);
export const Attachment2 = createIcon(RiAttachment2);
export const EmpathizeLine = createIcon(RiEmpathizeLine);
export const EmpathizeFill = createIcon(RiEmpathizeFill);
export const Message2Line = createIcon(RiMessage2Line);
export const Message2Fill = createIcon(RiMessage2Fill);
export const Notification2Line = createIcon(RiNotification2Line);
export const Notification2Fill = createIcon(RiNotification2Fill);
export const EBike2Fill = createIcon(RiEBike2Fill);
export const EBike2Line = createIcon(RiEBike2Line);
export const EyeOffLine = createIcon(RiEyeOffLine);
export const EyeLine = createIcon(RiEyeLine);
export const GitBranchLine = createIcon(RiGitBranchLine);
export const Heart3Line = createIcon(RiHeart3Line);
export const Instagram = createIcon(RiInstagramLine);
export const KakaoTalk = createIcon(RiKakaoTalkFill);
export const MailLine = createIcon(RiMailLine);
