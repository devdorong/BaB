import { ButtonFillMd } from '../../ui/button';
import { Chat3Line, MailLine, PhoneLine } from '../../ui/Icon';
import { BrandTag, GrayTag } from '../../ui/tag';
import TagBadge from '../../ui/TagBadge';

function SupportPage() {
  return (
    <div className="max-w-[1280px] mx-auto py-[50px] flex flex-col gap-[35px]">
      {/* 상단 */}
      <div>
        <div className="pb-[36px]">
          <h2 className="text-[32px] font-bold">고객센터</h2>
          <span className="text-[16px] font-medium">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </span>
        </div>
        <div className=" flex mx-auto justify-center gap-[45px]">
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px]  flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
            <PhoneLine bgColor="#FFEDD5" color="#F97A18" size={20} padding={14} />

            <div className="flex flex-col items-center gap-[15px] text-md">
              <span>전화문의</span>
              <p className="text-babgray-600">1588-1234</p>
              <p className="text-sm text-babgray-600">평일 09:00 ~ 18:00</p>
            </div>
          </div>
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px]  flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
            <MailLine bgColor="#DBEAFE" color="#4C93F8" size={20} padding={14} />
            <div className="flex flex-col items-center gap-[15px] text-md">
              <span>이메일 문의</span>
              <p className="text-babgray-600">help@matchingbab.com</p>
              <p className="text-sm text-babgray-600">20시간 접수 가능</p>
            </div>
          </div>
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px]  flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
            <Chat3Line bgColor="#DCFCE7" color="#22C55E" size={24} padding={14} />
            <div className="flex flex-col items-center gap-[15px] text-md">
              <span>실시간 채팅 </span>
              <p className="text-babgray-600">즉시 상담 가능</p>
              <p className="text-sm text-babgray-600">평일 09:00 - 22:00</p>
            </div>
          </div>
        </div>
      </div>
      {/* 중단 */}
      <div className="flex flex-col gap-[27px]">
        <div className="flex justify-between">
          <h3 className="font-bold text-[27px]">자주 묻는 질문</h3>
          <ButtonFillMd>1:1 문의하기</ButtonFillMd>
        </div>

        <div className="flex gap-[8px] justify-start ">
          <BrandTag>전체</BrandTag>
          <GrayTag>이용방법</GrayTag>
          <GrayTag>결제/환불</GrayTag>
          <GrayTag>매칭</GrayTag>
          <GrayTag>기술지원</GrayTag>
          <GrayTag>기타</GrayTag>
        </div>

        <div>
          <TagBadge bgColor="bg-babbutton-blue_back" textColor="text-babbutton-blue">
            이용방법
          </TagBadge>
        </div>
      </div>
      {/* 하단 */}
      <div></div>
    </div>
  );
}

export default SupportPage;
