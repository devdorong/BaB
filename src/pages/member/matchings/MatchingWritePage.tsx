import { RiAlarmWarningLine, RiCalendarLine, RiMapPinLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';

const MatchingWritePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <p>매칭 등록</p>
        <p>함께 식사할 친구를 찾아보세요.</p>
      </div>
      <div>
        <div>
          <span>
            매칭 제목<p>*</p>
          </span>
          {/* 게시글 제목 */}
          <input type="text" />
          {/* 게시글 제목 글자수 50자 제한 */}
          <p>0/50</p>
        </div>
        <div>
          <p>상세 설명</p>
          {/* 게시글 내용 */}
          <textarea />
          {/* 게시글 내용 글자수 500자 제한 */}
          <p>0/500</p>
        </div>
        <div>
          <div>
            <span>
              날짜<p>*</p>
            </span>
            <div>
              {/* 선택한 날짜만 삽입 */}
              <div>연도-월-일</div>
              <RiCalendarLine />
            </div>
          </div>
          <div>
            <span>
              시간<p>*</p>
            </span>
            <div>
              {/* 선택한 시간만 삽입 */}
              <div>00 : 00</div>
              <RiCalendarLine />
            </div>
          </div>
        </div>
        <div>
          <p>희망 인원수 (본인 포함)</p>
          {/* 선택한 인원수 만큼의 방 만들기 */}
          <div>
            <div>2명</div>
            <div>3명</div>
            <div>4명</div>
            <div>5명</div>
            <div>6명 이상</div>
          </div>
        </div>
        <div>
          <span>
            맛집 선택<p>*</p>
          </span>
          {/* 영역 클릭시 카카오 지도  */}
          <div>
            <RiMapPinLine />
            <p>지도에서 맛집을 선택해주세요</p>
          </div>
        </div>
        <div>
          <div>
            <RiAlarmWarningLine />
            <p>매칭 이용 안내</p>
          </div>
          <ul>
            <li>실제 만남 시 안전을 위해 공공장소에서 만나주세요</li>
            <li>개인정보 보호를 위해 연락처는 매칭 후 공유해주세요</li>
            <li>노쇼나 갑작스러운 취소는 다른 이용자에게 피해가 됩니다</li>
            <li>매너있는 만남 문화를 만들어가요</li>
          </ul>
        </div>
        <div>
          <ButtonLineMd onClick={() => navigate('/member')}>취소</ButtonLineMd>
          <ButtonFillMd onClick={() => navigate('/member/matching/detail')}>
            매칭 등록하기
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
};

export default MatchingWritePage;
