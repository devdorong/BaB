import { RiCalendarLine, RiImageLine } from 'react-icons/ri';

function EventWriteModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col w-[615px] min-h-[250px] bg-white text-babgray-500 rounded-[30px] overflow-hidden shadow ">
        <div className="w-full h-[230px] bg-babgray-200  flex justify-center items-center cursor-pointer">
          <RiImageLine className="text-5xl" />
        </div>
        <div className="flex flex-col p-6 gap-6">
          <div className="flex flex-col gap-6">
            <input
              className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
              type="text"
              required
              placeholder="제목을 입력하세요"
            />
            <input
              className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
              type="text"
              required
              placeholder="혜택을 입력해주세요"
            />
            <input
              type="text"
              className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
              required
              placeholder="상세 내용을 입력해주세요"
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-babgray-700">
            <RiCalendarLine />
            이벤트 기간을 설정해주세요
          </div>
          <div>
            <button>작성하기</button>
            <button>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventWriteModal;
