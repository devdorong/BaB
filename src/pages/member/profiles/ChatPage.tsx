import { RiSearchLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const navigate = useNavigate();
  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className=" cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">채팅</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          {/* 왼쪽 프로필 카드 */}
          <div className="flex flex-col gap-[20px] justify-center">
            <div className="inline-flex w-full flex-col justify-center bg-white rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]  overflow-hidden ">
              <div className="flex h-[1000px] bg-gray-50">
                {/* 📌 좌측 사이드바 */}
                <div className=" flex flex-col border-r border-gray-200 bg-white">
                  {/* 검색창 */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-[5px] w-full p-[12px] rounded-3xl border border-gray-300 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      <RiSearchLine />
                      <input type="text" placeholder="대화 검색..." />
                    </div>
                  </div>

                  {/* 대화목록 */}
                  <div className="flex-1 overflow-y-auto">
                    {[
                      {
                        name: '스팸두개',
                        msg: '강남 파스타집 정말 맛있었어요..',
                        time: '5분 전',
                        unread: 2,
                      },
                      { name: '스팸세개', msg: '강남 파스타집 정말 맛있었어요..', time: '5분 전' },
                      { name: '스팸네개', msg: '강남 파스타집 정말 맛있었어요..', time: '5분 전' },
                    ].map((chat, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          i === 0 ? 'bg-orange-50' : ''
                        }`}
                      >
                        {/* 프로필 아이콘 */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-l from-red-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {chat.name[0]}
                        </div>
                        {/* 텍스트 */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{chat.name}</p>
                          <p className="text-sm text-gray-500 truncate">{chat.msg}</p>
                        </div>
                        {/* 우측 시간 + 뱃지 */}
                        <div className="text-right text-xs text-gray-400">
                          <p>{chat.time}</p>
                          {chat.unread && (
                            <span className="mt-[8px] w-[20px] h-[20px] justify-center inline-flex bg-orange-500 text-white font-bold rounded-full items-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 📌 우측 채팅창 */}
                <div className="flex-1 flex flex-col">
                  {/* 헤더 */}
                  <div className="h-20 flex items-center justify-between px-5 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-l from-red-400 to-orange-600 flex items-center justify-center text-white font-bold">
                        스
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">스팸두개</p>
                        <p className="text-sm text-gray-500">팔로우</p>
                      </div>
                    </div>
                    <button className="text-gray-500">⋮</button>
                  </div>

                  {/* 메시지 영역 */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* 상대방 메시지 */}
                    <div className="flex flex-col items-start">
                      <div className="bg-white border border-gray-200 rounded-xl p-3 max-w-lg">
                        <p className="text-gray-800">
                          안녕하세요~ 프로필 보니까 양식에 되게 관심이 많으신가 봐요!
                        </p>
                        <p className="text-xs text-right text-gray-400">오후 2:30</p>
                      </div>
                    </div>

                    {/* 내 메시지 */}
                    <div className="flex flex-col items-end">
                      <div className="bg-orange-100 border border-orange-200 rounded-xl p-3 max-w-lg">
                        <p className="text-gray-800">
                          네 맞아요! 혹시 동성로에 맛있는 양식집 알고 계신가요?
                        </p>
                        <p className="text-xs text-right text-gray-400">오후 2:32</p>
                      </div>
                    </div>
                  </div>

                  {/* 입력창 */}
                  <div className="h-20 gap-[20px] flex items-center px-5 border-t border-gray-200 bg-white">
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요"
                      className="flex-1 px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <ButtonFillMd style={{ fontWeight: 500, padding: '25px' }}>전송</ButtonFillMd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
