import { RiAlarmWarningLine, RiCalendarLine, RiMapPinLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MatchingWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="w-[750px] h-auto py-8 flex flex-col gap-10 mx-auto">
      <div className="flex flex-col gap-2.5">
        <p className="text-babgray-900 text-3xl font-bold">매칭 등록</p>
        <p className="text-babgray-600">함께 식사할 친구를 찾아보세요.</p>
      </div>

      <div className="flex flex-col text-babgray-800 p-8 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            <span>매칭 제목</span>
            <p className="text-bab">*</p>
          </div>
          <div className="flex flex-col gap-1">
            {/* 게시글 제목 */}
            <input
              type="text"
              maxLength={50}
              placeholder="매칭 게시글 제목을 입력해주세요"
              onChange={e => setTitle(e.target.value)}
              className="px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray focus:outline-bab"
            />
            <p className="flex justify-end text-babgray-500 text-xs">{title.length}/50</p>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="flex flex-col gap-3.5">
          <p>상세 설명</p>
          {/* 게시글 내용 */}
          <textarea
            maxLength={500}
            placeholder="함께 식사하고 싶은 이유나 추가 정보를 입력해주세요"
            onChange={e => setContent(e.target.value)}
            className="h-24 px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray resize-none focus:outline-bab"
          />
          <p className="flex justify-end text-babgray-500 text-xs">{content.length}/500</p>
        </div>

        {/* 날짜 + 시간 */}
        <div className="flex justify-between gap-3.5">
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-1">
              <span>날짜</span>
              <p className="text-bab">*</p>
            </div>
            <div className="w-[330px] flex items-center justify-between px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray">
              {/* 선택한 날짜만 삽입 */}
              <div className="flex text-babgray-800 font-semibold">연도-월-일</div>
              <RiCalendarLine />
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex gap-1">
              <span>시간</span>
              <p className="text-bab">*</p>
            </div>
            <div className="w-[330px] flex items-center justify-between px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray">
              {/* 선택한 시간 삽입 */}
              <div className="flex text-babgray-800 font-semibold">00 : 00</div>
              <RiCalendarLine />
            </div>
          </div>
        </div>

        {/* 희망 인원수 */}
        <div className="flex flex-col items-start gap-4">
          <p>희망 인원수 (본인 포함)</p>
          {/* 선택한 인원수 만큼의 방 만들기 */}
          <div className="flex items-center gap-3">
            <div className="bg-bab px-3.5 py-2 rounded-lg flex justify-center items-center">
              <p className="text-white font-medium">2명</p>
            </div>
            <div className="bg-babgray px-3.5 py-2 rounded-lg flex justify-center items-center">
              <p className="text-babgray-700 font-medium">3명</p>
            </div>
            <div className="bg-babgray px-3.5 py-2 rounded-lg flex justify-center items-center">
              <p className="text-babgray-700 font-medium">4명</p>
            </div>
            <div className="bg-babgray px-3.5 py-2 rounded-lg flex justify-center items-center">
              <p className="text-babgray-700 font-medium">5명</p>
            </div>
            <div className="bg-babgray px-3.5 py-2 rounded-lg flex justify-center items-center">
              <p className="text-babgray-700 font-medium">6명 이상</p>
            </div>
          </div>
        </div>

        {/* 맛집 선택 */}
        {/* 영역 클릭시 카카오 지도 */}
        <div className="flex flex-col items-start gap-3.5">
          <div className="flex gap-1">
            <span>맛집 선택</span>
            <span className="text-bab">*</span>
          </div>
          <div className="w-full h-48 px-4 py-5 rounded-3xl outline-dashed outline-2 outline-offset-[-1px] outline-babgray flex flex-col justify-center items-center gap-4">
            <RiMapPinLine className="text-bab w-6 h-6" />
            <p className="text-babgray-600">지도에서 맛집을 선택해주세요</p>
          </div>
        </div>

        {/* 매칭 이용 안내 */}
        <div className="px-3.5 py-4 bg-bab-100 text-bab rounded-lg flex flex-col items-start gap-2.5">
          <div className="flex items-center gap-1.5">
            <RiAlarmWarningLine />
            <p>매칭 이용 안내</p>
          </div>
          <ul className="flex flex-col list-disc text-xs gap-1 px-6">
            <li>실제 만남 시 안전을 위해 공공장소에서 만나주세요</li>
            <li>개인정보 보호를 위해 연락처는 매칭 후 공유해주세요</li>
            <li>노쇼나 갑작스러운 취소는 다른 이용자에게 피해가 됩니다</li>
            <li>매너있는 만남 문화를 만들어가요</li>
          </ul>
        </div>

        {/* 버튼 영역 */}
        <div className="flex p-6 border-t justify-center items-center gap-6">
          {/* 취소하기 눌렀을때 취소확인 모달 */}
          <ButtonLineMd className="flex-1" onClick={() => navigate('/member')}>
            취소
          </ButtonLineMd>
          {/* 등록하기 눌렀을때 확인모달 */}
          <ButtonFillMd className="flex-1" onClick={() => navigate('/member/matching/detail')}>
            등록하기
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
};

export default MatchingWritePage;
