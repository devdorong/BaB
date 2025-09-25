import { RiAlarmWarningLine, RiCalendarLine, RiMapPinLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';

const MatchingWritePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[750px] h-auto py-8 flex flex-col gap-10 mx-auto">
      <div className="flex flex-col gap-2.5">
        <p className="text-babgray-900 text-3xl font-bold">매칭 등록</p>
        <p className="text-babgray-600">함께 식사할 친구를 찾아보세요.</p>
      </div>

      <div className="flex flex-col text-babgray-800 p-8 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] gap-2.5">
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
              className="px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-150 focus:outline-bab"
            />
            <p className="flex justify-end text-babgray-500 text-xs">0/50</p>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="flex flex-col gap-3.5">
          <p className="self-stretch text-color-grayscale-g700 text-base font-normal font-['Inter']">
            상세 설명
          </p>
          {/* 게시글 내용 */}
          <textarea
            maxLength={500}
            placeholder="함께 식사하고 싶은 이유나 추가 정보를 입력해주세요"
            className="h-24 px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray resize-none"
          />
          <p className="flex justify-end text-babgray-500 text-xs">0/500</p>
        </div>

        {/* 날짜 + 시간 */}
        <div className="self-stretch inline-flex justify-start items-center gap-3.5">
          <div className="w-80 inline-flex flex-col justify-start items-start gap-3.5">
            <div className="self-stretch justify-start">
              <span className="text-color-grayscale-g700 text-base font-normal font-['Inter']">
                날짜
                <p className="text-color-primary-p-500 text-base font-normal font-['Inter']">*</p>
              </span>
            </div>
            <div className="self-stretch px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-color-grayscale-g-150 inline-flex justify-between items-center">
              {/* 선택한 날짜만 삽입 */}
              <div className="text-color-grayscale-g800 text-base font-semibold font-['Inter']">
                연도-월-일
              </div>
              <RiCalendarLine />
            </div>
          </div>

          <div className="w-80 inline-flex flex-col justify-start items-start gap-3.5">
            <div className="self-stretch justify-start">
              <span className="text-color-grayscale-g700 text-base font-normal font-['Inter']">
                시간
                <p className="text-color-primary-p-500 text-base font-normal font-['Inter']">*</p>
              </span>
            </div>
            <div className="self-stretch px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-color-grayscale-g-150 inline-flex justify-between items-center">
              {/* 선택한 시간만 삽입 */}
              <div className="text-color-grayscale-g800 text-base font-semibold font-['Inter']">
                00 : 00
              </div>
              <RiCalendarLine />
            </div>
          </div>
        </div>

        {/* 희망 인원수 */}
        <div className="w-[683px] inline-flex justify-start items-center gap-3">
          <div className="w-80 inline-flex flex-col justify-start items-start gap-1.5">
            <p className="self-stretch text-color-grayscale-g700 text-base font-normal font-['Inter']">
              희망 인원수 (본인 포함)
            </p>
            {/* 선택한 인원수 만큼의 방 만들기 */}
            <div className="self-stretch inline-flex justify-start items-center gap-[5px]">
              <div className="h-10 px-3.5 py-2.5 bg-color-primary-p-500 rounded-lg flex justify-center items-center gap-2.5">
                <p className="text-white text-base font-medium font-['Inter']">2명</p>
              </div>
              <div className="h-10 px-3.5 py-2.5 bg-color-grayscale-g-100 rounded-lg flex justify-center items-center gap-2.5">
                <p className="text-color-grayscale-g700 text-base font-medium font-['Inter']">
                  3명
                </p>
              </div>
              <div className="h-10 px-3.5 py-2.5 bg-color-grayscale-g-100 rounded-lg flex justify-center items-center gap-2.5">
                <p className="text-color-grayscale-g700 text-base font-medium font-['Inter']">
                  4명
                </p>
              </div>
              <div className="h-10 px-3.5 py-2.5 bg-color-grayscale-g-100 rounded-lg flex justify-center items-center gap-2.5">
                <p className="text-color-grayscale-g700 text-base font-medium font-['Inter']">
                  5명
                </p>
              </div>
              <div className="h-10 px-3.5 py-2.5 bg-color-grayscale-g-100 rounded-lg flex justify-center items-center gap-2.5">
                <p className="text-color-grayscale-g700 text-base font-medium font-['Inter']">
                  6명 이상
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 맛집 선택 */}
        {/* 영역 클릭시 카카오 지도 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
          <div className="self-stretch justify-start">
            <span className="text-color-grayscale-g700 text-base font-normal font-['Inter']">
              맛집 선택
              <span className="text-color-primary-p-500 text-base font-normal font-['Inter']">
                *
              </span>
            </span>
          </div>
          <div className="self-stretch h-48 px-4 py-5 rounded-3xl outline outline-2 outline-offset-[-1px] outline-color-grayscale-g-150 flex flex-col justify-center items-center gap-4">
            <RiMapPinLine className="text-color-primary-p-500 w-6 h-6" />
            <p className="text-color-grayscale-g700 text-base font-normal font-['Inter']">
              지도에서 맛집을 선택해주세요
            </p>
          </div>
        </div>

        {/* 매칭 이용 안내 */}
        <div className="self-stretch px-3.5 py-4 bg-color-primary-p-100 rounded-lg flex flex-col justify-start items-start gap-2.5">
          <div className="inline-flex items-center gap-1.5">
            <RiAlarmWarningLine className="text-color-primary-p-400" />
            <p className="text-color-primary-p-400 text-base font-normal font-['Inter']">
              매칭 이용 안내
            </p>
          </div>
          <ul className="self-stretch flex flex-col justify-start items-start gap-1">
            <li className="text-color-primary-p-400 text-xs font-normal font-['Inter']">
              실제 만남 시 안전을 위해 공공장소에서 만나주세요
            </li>
            <li className="text-color-primary-p-400 text-xs font-normal font-['Inter']">
              개인정보 보호를 위해 연락처는 매칭 후 공유해주세요
            </li>
            <li className="text-color-primary-p-400 text-xs font-normal font-['Inter']">
              노쇼나 갑작스러운 취소는 다른 이용자에게 피해가 됩니다
            </li>
            <li className="text-color-primary-p-400 text-xs font-normal font-['Inter']">
              매너있는 만남 문화를 만들어가요
            </li>
          </ul>
        </div>

        {/* 버튼 영역 */}
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-color-grayscale-g-150"></div>
          <div className="w-[661px] inline-flex justify-between items-center">
            <ButtonLineMd className="w-80 h-12" onClick={() => navigate('/member')}>
              취소
            </ButtonLineMd>
            <ButtonFillMd className="w-80 h-12" onClick={() => navigate('/member/matching/detail')}>
              매칭 등록하기
            </ButtonFillMd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingWritePage;
