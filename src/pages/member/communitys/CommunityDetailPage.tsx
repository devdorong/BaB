import {
  RiAlarmWarningLine,
  RiChat3Line,
  RiCornerDownRightFill,
  RiEyeLine,
  RiHeart3Line,
  RiShareForwardLine,
} from 'react-icons/ri';
import { BlueTag } from '../../../ui/tag';
import { Navigate, useNavigate } from 'react-router-dom';
import ReportsModal from '../../../ui/sdj/ReportsModal';
import { useState } from 'react';
import { ButtonFillMd, ButtonFillSm } from '../../../ui/button';

function CommunityDetailPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(false);

  return (
    <div className="w-[746px] h-full flex flex-col gap-10 py-[100px] mx-auto">
      <p className="font-bold text-3xl text-babgray-900">게시글</p>
      {/* 게시글 영역 */}
      <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          {/* write page 에서 선택한 카테고리 적용 */}
          <BlueTag>자유 게시판</BlueTag>
          {/* dayjs사용 시간변화 적용 */}
          <p className="font-medium text-babgray-500">2시간 전</p>
        </div>
        {/* write page title 받아오기 */}
        <div>
          <p className="font-bold text-2xl">강남역 근처 맛집 친구 구해요!</p>
        </div>
        <div className="flex items-center gap-4 text-babgray-700 text-sm">
          {/* write page 작성자 닉네임 */}
          <p className="font-bold text-lg">도로롱</p>
          {/* 이 게시글 읽은 회원 수 */}
          <span className="flex items-center gap-1 text-babgray-600">
            <RiEyeLine /> <p>156</p>
          </span>
          {/* 이 게시글 좋아요 수 */}
          <span className="flex items-center gap-1 text-babgray-600">
            <RiHeart3Line /> <p>23</p>
          </span>
          {/* 이 게시글에 달린 댓글 수 */}
          <span className="flex items-center gap-1 text-babgray-600">
            <RiChat3Line /> <p>3</p>
          </span>
        </div>
        {/* write page content 받아오기 */}
        <div className="flex border-y border-color-grayscale-g-150 py-4 text-babgray-700 leading-relaxed">
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
        <div className="flex justify-center items-center gap-10 py-2">
          <div className="flex items-center gap-2 text-babgray-700 cursor-pointer">
            {/* 좋아요 누른 게시글에는 하트색 바뀌도록, 한번더 누르면 원상복구 */}
            <RiHeart3Line />
            <p>좋아요</p>
            {/* 이 게시글 좋아요 수 */}
            <div>23</div>
          </div>
          {/* 신고 버튼 클릭시 reports modal 출력 */}
          <div
            onClick={() => setReports(true)}
            className="flex items-center gap-2 text-babbutton-red cursor-pointer"
          >
            <RiAlarmWarningLine />
            <p>게시글 신고</p>
          </div>
          {reports && <ReportsModal />}
        </div>
      </div>
      {/* 댓글 영역 */}
      <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xl font-bold gap-2">
            <RiChat3Line className="text-black" />
            <span className="flex items-center gap-1">
              댓글
              {/* 해당 게시글 댓글 갯수 */}
              <div className="font-bold">3</div>개
            </span>
          </div>
          {/* 댓글등록 클릭시 확인모달 출력 */}
          <div>
            <ButtonFillMd>댓글 등록</ButtonFillMd>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {/* 댓글등록 클릭시 작성될 내용 */}
          <textarea
            placeholder="댓글을 작성해주세요"
            className="w-full h-24 px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray text-babgray-800 resize-none focus:outline-none focus:ring-1 focus:ring-bab"
          />
          {/* textarea 에 작성된 글자수 제한,실시간 연동 500자 제한*/}
          <p className="self-stretch text-right text-babgray-500 text-xs">0/500</p>
        </div>
        <div>
          {/* 기본버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-start">
              {/* 댓글작성자 닉네임 */}
              <span className="text-babgray-800 font-bold">도로롱</span>
              {/* 댓글 작성시간 */}
              <span className="text-babgray-700">1시간 전</span>
            </div>
            {/* 등록한 댓글 내용 */}
            <p className="text-babgray-700">
              고기 구이 맛집이라면 저도 참여하고 싶어요. 어떤 곳을 생각하고 계신가요? 계신가요?
              계신가요? 계신가요? 계신가요? 계신가요? 계신가요? 계신가요?
            </p>
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-5 text-babgray-700">
                {/* 눌렀을때 색바뀌면서 활성화 되며 개수 증가, 한번더 누르면 원상복구 후 좋아요 개수 감소 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiHeart3Line />
                  <p>5</p>
                </div>
                {/* 눌렀을때 답글버전으로 변경 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiShareForwardLine />
                  <p>답글</p>
                </div>
              </div>
              {/* 눌렀을때 reports 모달 */}
              <div className="flex items-center gap-1 text-babbutton-red cursor-pointer">
                <RiAlarmWarningLine />
                <p>신고하기</p>
              </div>
            </div>
          </div>
          {/* 답글 달렸을때 버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-center gap-2 text-babgray-500">
              <div className="flex items-center gap-2">
                <RiCornerDownRightFill className="text-babgray-600" />
                {/* 답글 단 회원의 닉네임 */}
                <p className="text-babgray-800 font-bold">도현</p>
              </div>
              {/* 답글 단 시간 */}
              <p className="text-babgray-700">50분 전</p>
            </div>
            <div>
              {/* 답글 내용 */}
              <p className="text-color-grayscale-g700 text-base">반가워요!</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-5 text-color-grayscale-g700">
                <div className="flex items-center gap-1 cursor-pointer">
                  {/* 눌렀을때 색바뀌면서 활성화 되며 개수 증가, 한번더 누르면 원상복구 후 좋아요 개수 감소 */}
                  <RiHeart3Line />
                  <p>5</p>
                </div>
                {/* 눌렀을때 답글버전으로 변경 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiShareForwardLine />
                  <p>답글</p>
                </div>
              </div>
              {/* 눌렀을때 reports 모달 */}
              <div className="flex items-center gap-1 text-babbutton-red cursor-pointer">
                <RiAlarmWarningLine />
                <p>신고하기</p>
              </div>
            </div>
          </div>
          {/* 답글버튼 눌렀을때 버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-center">
              {/* 답글 작성자 닉네임 */}
              <p className="font-bold">도롱</p>
              {/* 답글 작성 시간 */}
              <p>2시간 전</p>
            </div>
            {/* 답글을 달 댓글 내용 */}
            <p>저도 강남역 근처 맛집 탐방 좋아해요! 함께 할 수 있을까요?</p>
            {/* 답글 내용 */}
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full h-24 px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray text-babgray-800 resize-none focus:outline-none focus:ring-1 focus:ring-bab"
                placeholder="답글을 입력해주세요"
              />
              <p className="self-stretch text-right text-babgray-500 text-xs">0/500</p>
            </div>
            <div className="flex justify-end">
              {/* 등록하기 버튼 */}
              <ButtonFillSm style={{ width: 'auto', fontWeight: 400 }}>등록하기</ButtonFillSm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
