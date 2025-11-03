import { RiArrowLeftLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import DirectChatList from '../../../components/member/chat/DirectChatList';
import { useCallback, useEffect, useRef, useState } from 'react';
import DirectChatRoom from '../../../components/member/chat/DirectChatRoom';
import { useDirectChat } from '@/contexts/DirectChatContext';

function ChatPage() {
  const navigate = useNavigate();
  // 현재 선택된 채팅방의 ID 상태 관리
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const location = useLocation();
  const { loadMessages, currentChat, setCurrentChat, chats, loadChats } = useDirectChat();

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    const chatId = location.state?.chatId;
    if (!chatId) return;

    if (chatId) {
      const found = chats.find(item => item.id === chatId);
      if (found) {
        setCurrentChat(found);
        setSelectedChatId(chatId);
        loadMessages(found.id);
      }
    }
  }, [location.state]);
  /**
   * 채팅방 선택 처리 함수
   * DirectChatList 에서 목록 중 채팅방 1개를 선택하면 호출됨
   * 선택한 채팅방 ID를 상태에 보관함
   */
  const handleChatSelect = useCallback((chatId: string, nickname?: string) => {
    setSelectedChatId(chatId);
  }, []);

  /**
   * 새로운 채팅 생성 처리 함수
   *
   * DirectChatList 에서 새 채팅 버튼 클릭 시 호출
   */
  const handleCreateChat = () => {
    // 새로운 채팅 방 생성 처리
  };

  /** 모바일에서 채팅 나가기 */
  const handleBack = () => {
    setSelectedChatId(null);
  };

  return (
    <div className="max-w-[1280px] text-center m-auto py-1 px-4 sm:px-6 lg:px-8 xl:px-0">
      {/* 페이지 경로 표시 (lg 이상에서만 표시) */}
      <div className="hidden lg:flex py-[15px]">
        <div
          onClick={() => navigate('/member/profile')}
          className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
        >
          프로필
        </div>
        <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
          <RiArrowRightSLine />
        </div>
        <div className="text-bab-500 text-[17px]">1:1채팅</div>
      </div>
      {/* 메인 채팅 컨테이너 - 사이드바와 메인 영역으로 구성 */}
      <div className="mt-[20px] mb-[20px] lg:mb-[60px] flex flex-col lg:flex-row bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* 📱 모바일: 목록 or 채팅방 한쪽만 표시 */}
        {/* 💻 데스크탑: flex-row 로 양쪽 표시 */}
        {/* 왼쪽 사이드바 */}
        <div
          className={`
            ${selectedChatId ? 'hidden' : 'flex'} 
            lg:flex flex-col w-full lg:w-[400px] border-r border-babgray-100
          `}
        >
          <DirectChatList
            onChatSelect={handleChatSelect}
            onCreateChat={handleCreateChat}
            selectedChatId={selectedChatId || undefined}
          />
        </div>

        {/* 오른쪽 메인 채팅 영역 */}
        <div
          className={`
            ${selectedChatId ? 'flex' : 'hidden'} 
            lg:flex flex-1 flex-col
          `}
        >
          {selectedChatId ? (
            <>
              {/* 실제 채팅방 */}
              <DirectChatRoom chatId={selectedChatId} onExit={() => setSelectedChatId(null)} />
            </>
          ) : (
            // 채팅방이 선택되지 않은 경우
            <div className="chat-room">
              <p className="flex flex-col justify-center items-center flex-1 p-6 text-babgray-500">
                좌측에서 채팅방을 선택하거나
                <br />
                매칭시스템을 통해 채팅을 시작해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
