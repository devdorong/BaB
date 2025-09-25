import {
  RiCalendarLine,
  RiErrorWarningLine,
  RiStarFill,
  RiStarLine,
  RiUserForbidLine,
  RiUserUnfollowLine,
} from 'react-icons/ri';

const blockedUsers = [
  { id: 1, name: '도로롱', date: '2025-09-24' },
  { id: 2, name: '스팸두개', date: '2025-09-24' },
  { id: 3, name: '스팸세개', date: '2025-09-24' },
  { id: 4, name: '스팸네개', date: '2025-09-24' },
];

function BlockPage() {
  return (
    <div id="root" className="min-h-screen bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">차단</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-red-100 rounded-[12px] justify-center items-center">
                    <RiUserForbidLine className="w-[20px] h-[20px] text-babbutton-red" />
                  </div>
                  <p className="text-[24px] font-bold">4</p>
                  <p className="text-[16px] text-babgray-800">총 차단 사용자</p>
                </div>
              </div>
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[15px] flex-col items-center justify-center">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-[#FFEEE8] rounded-[12px] justify-center items-center">
                    <RiCalendarLine className="w-[20px] h-[20px] text-[#EA580C]" />
                  </div>
                  <p className="text-[24px] font-bold">4</p>
                  <p className="text-[16px] text-babgray-800">이번 달 차단</p>
                </div>
              </div>
            </div>
            {/* 오른쪽 카드 */}
            <div className="flex flex-col w-full gap-[30px] justify-center">
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex gap-[20px]">
                  <div className="flex w-[40px] h-[40px] p-[10px] bg-red-100 rounded-[12px] justify-center items-center">
                    <RiErrorWarningLine className="w-[20px] h-[20px] text-babbutton-red" />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[24px] font-bold">차단 기능 안내</p>
                    <div className="flex flex-col gap-[10px] text-[17px] text-babgray-800">
                      <span>· 차단된 사용자는 나에게 메시지를 보낼 수 없습니다.</span>
                      <span>· 차단된 사용자와 매칭 될 경우에는 동의를 받습니다.</span>
                      <span>· 언제든지 차단을 해제할 수 있습니다.</span>
                      <span>· 차단은 상대방에게 알려지지 않습니다.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex w-full p-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 차단자 */}
                <div className="flex flex-col gap-[20px]">
                  {blockedUsers.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-5 bg-white rounded-xl border border-gray-200"
                    >
                      {/* 왼쪽 사용자 정보 */}
                      <div className="flex items-center gap-5">
                        {/* 프로필 이미지/아이콘 */}
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                          <span className="text-xl text-gray-700">
                            <RiUserForbidLine />
                          </span>
                        </div>

                        {/* 이름 + 차단일 */}
                        <div className="flex flex-col">
                          <span className="text-base font-medium text-gray-900">{item.name}</span>
                          <span className="text-sm text-gray-600">차단일 : {item.date}</span>
                        </div>
                      </div>

                      {/* 차단 해제 버튼 */}
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                        <RiUserUnfollowLine className="w-4 h-4" />
                        <span className="text-sm font-medium">차단 해제</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockPage;
