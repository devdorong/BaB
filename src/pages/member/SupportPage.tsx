import { RiArrowDownSLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../ui/button';
import { Chat3Line, MailLine, PhoneLine } from '../../ui/Icon';
import { TagButton } from '../../ui/tag';
import TagBadge from '../../ui/TagBadge';
import { useState } from 'react';
import SupportModal from '../../ui/dorong/SupportModal';
import styles from './SupportPage.module.css';

function SupportPage() {
  // 목업데이터
  const samplesupport = [
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '매칭은 어떻게 하나요?',
      answer:
        '메인 화면에서 빠른 매칭 버튼이나, 매칭 게시글에서 원하는 글을 선택하면 자동으로 연결됩니다.',
    },
    {
      tagBg: 'bg-babgray-150',
      tagText: 'text-babgray-700',
      tagLabel: '기타',
      question: '비밀번호를 잊어버렸어요.',
      answer:
        '로그인 화면에서 "비밀번호 찾기" 버튼을 눌러 이메일로 재설정 링크를 받아보실 수 있습니다.',
    },
    {
      tagBg: 'bg-babbutton-green_back',
      tagText: 'text-babbutton-green',
      tagLabel: '결제/환불',
      question: '환불은 어떻게 하나요?',
      answer:
        '마이페이지 > 결제 내역에서 환불 신청이 가능하며, 결제 수단에 따라 3~5일 이내 처리됩니다.',
    },
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '리뷰는 수정할 수 있나요?',
      answer: '작성한 리뷰는 마이페이지 > 내 리뷰에서 수정 및 삭제가 가능합니다.',
    },
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '파트너 등록은 어떻게 하나요?',
      answer: '메인페이지에서 파트너 등록 메뉴를 누른뒤, 파트너 신청을 작성하시면 됩니다.',
    },
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '매칭 시 주의사항이 있나요?',
      answer: '닉네임 기반으로 매칭되며, 부적절한 언행은 제재될 수 있으니 예의를 지켜주세요.',
    },
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '선호음식 설정은 어디서 하나요?',
      answer: '마이페이지 > 내 정보에서 선호하는 음식을 선택할 수 있으며, 빠른 매칭에 활용됩니다.',
    },
    {
      tagBg: 'bg-babbutton-green_back',
      tagText: 'text-babbutton-green',
      tagLabel: '결제/환불',
      question: '결제 수단은 무엇이 있나요?',
      answer: '신용카드, 카카오페이, 네이버페이, 토스 등 다양한 결제 수단을 지원합니다.',
    },
    {
      tagBg: 'bg-babbutton-blue_back',
      tagText: 'text-babbutton-blue',
      tagLabel: '이용방법',
      question: '리뷰 삭제도 가능한가요?',
      answer: '작성한 리뷰는 언제든 삭제 가능하며, 삭제 시 복구되지 않습니다.',
    },
  ];
  // 카테고리 목업

  const categories = ['전체', '이용방법', '결제/환불', '기타'];

  const [activeTag, setActiveTag] = useState('전체');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const filteredFaqs =
    activeTag === '전체' ? samplesupport : samplesupport.filter(faq => faq.tagLabel === activeTag);

  return (
    <div className={styles.pageContainer}>
      {/* 상단 */}
      <div>
        <div className="pb-[36px]">
          <h2 className="text-[24px] lg:text-3xl font-bold">고객센터</h2>
          <span className="text-babgray-600 text-[16px]">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </span>
        </div>
        <div className={styles.topCards}>
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px] flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
            <PhoneLine bgColor="#FFEDD5" color="#F97A18" size={20} padding={14} />
            <div className="flex flex-col items-center gap-[15px] text-md">
              <span>전화문의</span>
              <p className="text-babgray-600">1588-1234</p>
              <p className="text-sm text-babgray-600">평일 09:00 ~ 18:00</p>
            </div>
          </div>
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px] flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
            <MailLine bgColor="#DBEAFE" color="#4C93F8" size={20} padding={14} />
            <div className="flex flex-col items-center gap-[15px] text-md">
              <span>이메일 문의</span>
              <p className="text-babgray-600">help@matchingbab.com</p>
              <p className="text-sm text-babgray-600">24시간 접수 가능</p>
            </div>
          </div>
          <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] bg-white border-none rounded-[16px] flex flex-col items-center gap-[17px] py-[15px] px-[50px]">
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
      <div className=" bg-white rounded-[18px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
        <div className="p-[25px] flex flex-col gap-[27px]">
          <div className="flex justify-between">
            <h3 className="font-bold text-[27px]">자주 묻는 질문</h3>
            {/* 클릭시 모달열리게 수정하기 */}
            <div onClick={() => setOpenModal(true)}>
              <ButtonFillMd>1:1 문의하기</ButtonFillMd>
            </div>
            {openModal && <SupportModal setOpenModal={setOpenModal} />}
          </div>

          {/* 태그 필터 */}
          <div className="flex gap-[8px] justify-start">
            {categories.map(cat => (
              <TagButton
                key={cat}
                $active={activeTag === cat}
                onClick={() => {
                  setActiveTag(cat);
                  setOpenIndex(null); // 카테고리 바뀔 때 열림 초기화
                }}
              >
                {cat}
              </TagButton>
            ))}
          </div>

          <div className="flex flex-col gap-[15px]">
            <ul className="flex flex-col gap-3">
              {filteredFaqs.map((faq, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex justify-between items-center p-[16px] text-left bg-bg-bg rounded-[10px]"
                  >
                    <div className="flex gap-[10px] items-center">
                      <TagBadge bgColor={faq.tagBg} textColor={faq.tagText}>
                        {faq.tagLabel}
                      </TagBadge>
                      <span className="font-medium text-babgray-800">{faq.question}</span>
                    </div>
                    <RiArrowDownSLine
                      className={`transition-transform duration-200 ${
                        openIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* 답변 영역 */}
                  {openIndex === i && (
                    <div className="px-[16px] pt-[16px] pb-[16px] text-sm text-babgray-600 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-[27px] p-[20px] ">
          <div>
            <h3 className="font-bold text-[27px]">서비스 안내</h3>
          </div>
          <div className={styles.bottomCards}>
            {/* 왼쪽 */}
            <div className="w-[50%] flex flex-col gap-[13px]">
              <h4>이용 시간</h4>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>전화 상담</span>
                <span>평일 09:00 ~ 18:00</span>
              </div>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>실시간 채팅</span>
                <span>평일 09:00 - 22:00</span>
              </div>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>이메일 문의</span>
                <span>24시간 접수</span>
              </div>
            </div>
            {/* 오른쪽 */}
            <div className="w-[50%] flex flex-col gap-[13px]">
              <h4>처리 시간</h4>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>일반 문의</span>
                <span>24시간 이내</span>
              </div>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>기술 지원</span>
                <span>48시간 이내</span>
              </div>
              <div className="flex justify-between text-babgray-600 font-normal ">
                <span>환불 처리</span>
                <span>3-5 영업일</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
