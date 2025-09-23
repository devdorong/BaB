import { RiErrorWarningLine } from 'react-icons/ri';
import { GrayTag } from '../../../ui/tag';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';

function CommunityWritePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-[750px] mx-auto py-24">
      <p className="font-bold text-3xl">게시글 작성</p>
      <div className="flex flex-col gap-6 p-8 bg-white shadow-sm rounded-2xl text-babgray-800">
        <div className="flex flex-col gap-2">
          <p className="flex gap-1 font-semibold">
            카테고리 <p className="text-bab">*</p>
          </p>
          {/* 카테고리 태그 불러오기 */}
          <div className="flex gap-4">
            <GrayTag>자유 게시판</GrayTag>
            <GrayTag>Q&A</GrayTag>
            <GrayTag>팁·노하우</GrayTag>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex gap-1 font-semibold">
            제목 <p className="text-bab">*</p>
          </p>
          {/* 게시글 제목작성 input */}
          <input
            type="text"
            className="w-full h-[42px] py-3 px-3 border border-babgray rounded-3xl focus:outline-none"
          />
          {/* input 글자수에따라 실시간 변경,최대 100자 제한 */}
          <div className="flex justify-end text-babgray-500">0/100</div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex gap-1 font-semibold">
            내용 <p className="text-bab">*</p>
          </p>
          {/* textarea 글자수에따라 실시간 변경,최대 500자 제한 */}
          <textarea className="w-full h-[100px] py-2 px-3 border border-babgray rounded-3xl focus:outline-none" />
          <div className="flex justify-end text-babgray-500">0/500</div>
        </div>
        <div className="flex flex-col gap-1 bg-bab-100 p-4 rounded-lg text-bab ">
          <div className="flex gap-2 items-center">
            <RiErrorWarningLine />
            <p>게시글 작성 가이드</p>
          </div>
          <ul className="list-disc flex flex-col px-8">
            <li>서로 존중하는 댓글 문화를 만들어가요</li>
            <li>개인 정보나 연락처는 공개하지 말아주세요</li>
            <li>광고성 게시글은 삭제될 수 있습니다</li>
          </ul>
        </div>
        <div className="border-b border-b-babgray" />
        <div className="flex justify-between">
          <ButtonLineMd onClick={() => navigate('/member/community')} className="w-[320px]">
            취소
          </ButtonLineMd>
          {/* 등록하기 클릭시 커뮤니티페이지 detail:id 로 이동 */}
          {/* 카테고리 선택안했거나 제목,내용 중 하나라도 false라면 모달창 띄움 */}
          <ButtonFillMd onClick={() => navigate('/member/community/detail')} className="w-[320px]">
            매칭 등록하기
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
}

export default CommunityWritePage;
