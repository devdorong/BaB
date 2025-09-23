import { RiAlarmWarningLine, RiChat3Line, RiEyeLine, RiHeart3Line } from 'react-icons/ri';
import { BlueTag } from '../../../ui/tag';

function CommunityDetailPage() {
  return (
    <div>
      <p>게시글</p>
      <div>
        <div>
          {/* write page 에서 선택한 카테고리 적용 */}
          <BlueTag>자유 게시판</BlueTag>
          {/* dayjs사용 시간변화 적용 */}
          <p>2시간 전</p>
        </div>
        {/* write page title 받아오기 */}
        <div>
          <p>강남역 근처 맛집 친구 구해요!</p>
        </div>
        <div>
          {/* write page 작성자 닉네임 */}
          <p>도로롱</p>
          {/* 이 게시글 읽은 회원 수 */}
          <span>
            <RiEyeLine />
            <p>156</p>
          </span>
          {/* 이 게시글 좋아요 수 */}
          <span>
            <RiHeart3Line />
            <p>23</p>
          </span>
          {/* 이 게시글에 달린 댓글 수 */}
          <span>
            <RiChat3Line />
            <p>3</p>
          </span>
        </div>
        {/* write page content 받아오기 */}
        <div>
          <p>
            이번 주말에 강남역 근처에서 맛있는 음식 먹으면서 친구들과 즐거운 시간 보내고 싶어요.
            함께 하실 분 계신가요? 강남역 주변에는 정말 맛있는 곳들이 많잖아요. 특히 고기구이나
            한식, 일식 등 다양한 음식들을 즐길 수 있는 곳들이 많아서 선택의 폭이 넓어요. 강남역
            주변에는 정말 맛있는 곳들이 많잖아요. 특히 고기구이나 한식, 일식 등 다양한 음식들을 즐길
            수 있는 곳들이 많아서 선택의 폭이 넓어요. 강남역 주변에는 정말 맛있는 곳들이 많잖아요.
            특히 고기구이나 한식, 일식 등 다양한 음식들을 즐길 수 있는 곳들이 많아서 선택의 폭이
            넓어요. 강남역 주변에는 정말 맛있는 곳들이 많잖아요. 특히 고기구이나 한식, 일식 등
            다양한 음식들을 즐길 수 있는 곳들이 많아서 선택의 폭이 넓어요.
          </p>
        </div>
        <div>
          <div>
            {/* 좋아요 누른 게시글에는 하트색 바뀌도록, 한번더 누르면 원상복구 */}
            <RiHeart3Line />
            <p>좋아요</p>
            {/* 이 게시글 좋아요 수 */}
            <div>23</div>
          </div>
          <div>
            <RiAlarmWarningLine />
            <p>게시글 신고</p>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default CommunityDetailPage;
