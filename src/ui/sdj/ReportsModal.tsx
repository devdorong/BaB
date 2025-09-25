import { useState } from 'react';
import { ButtonFillMd } from '../button';
import Modal from './Modal';

type ReportsModalProps = {
  setReports: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportsModal = ({ setReports }: ReportsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden">
        <p className="w-full flex items-start text-xl font-bold">신고하기</p>
        <div className="flex flex-col items-start gap-7 text-babgray-700">
          <div className="w-full">
            <p className="text-sm">신고대상</p>
            {/* 신고당하는 사람의 닉네임 */}
            <div className="w-full h-12 px-2.5 py-3 border-b items-center">
              <div className="font-semibold">스팸두개</div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm">문의유형</p>
            {/* 신고한 유형 (게시글,댓글,채팅) */}
            <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
              <div className="font-semibold">게시글 신고</div>
            </div>
          </div>
          <div className="w-full">
            <span className="flex items-center gap-1">
              제목<p className="text-bab">*</p>
            </span>
            {/* 문의 제목 */}
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              className="w-full h-12 mt-2 px-2.5 py-3 bg-white rounded-3xl outline outline-1 outline-gray-300 hover:outline hover:outline-1 focus:outline-bab"
            />
          </div>
          <div className="w-full">
            <span className="flex items-center gap-1">
              문의 내용<p className="text-bab">*</p>
            </span>
            {/* 문의 내용 */}
            <textarea
              placeholder="문의내용을 자세히 입력해주세요"
              className="w-[400px] h-[150px] mt-2 px-2.5 py-3 resize-none bg-white rounded-3xl outline outline-1 outline-gray-300 hover:outline hover:outline-1 focus:outline-bab"
            />
            {/* 문의내용 글자 수 제한 500자 */}
            <p className="mt-2 text-right text-babgray-500 text-xs font-medium">0/500 자</p>
          </div>
          <div className="w-full inline-flex items-center gap-4">
            {/* 취소 버튼 클릭시 확인모달 */}
            <ButtonFillMd
              style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
              className="flex-1 hover:!bg-gray-300"
              onClick={()=>setReports(false)}
            >
              취소
            </ButtonFillMd>
            {/* 누르면 신고 제출 확인 모달 */}
            <ButtonFillMd
              className="flex-1 !bg-babbutton-red hover:!bg-bab-700"
              onClick={() => setIsOpen(true)}
            >
              신고하기
            </ButtonFillMd>
            {/* 모달의 신고하기 눌렀을때 완료모달 */}
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              titleText="신고하기"
              contentText="작성된 내용으로 신고 하시겠습니까?"
              submitButtonText="신고하기"
              closeButtonText="닫기"
              submitButtonBgColor="#ef4444"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
