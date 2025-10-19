import {
  RiCalendarLine,
  RiCloseFill,
  RiEditLine,
  RiErrorWarningLine,
  RiGroupLine,
  RiMapPinLine,
  RiPhoneLine,
  RiStarHalfSFill,
  RiStarSFill,
  RiTimeLine,
} from 'react-icons/ri';
import { useKakaoLoader } from '../../../hooks/useKakaoLoader';
import TagBadge from '../../../ui/TagBadge';
import { ButtonFillLG, ButtonLineLg, ButtonLineMd } from '../../../ui/button';
import KkoMapDetail from '../../../ui/jy/Kakaomapdummy';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMatchingById } from '../../../services/matchingService';
import type { Matchings } from '../../../types/bobType';

const MatchingDetailPage = () => {
  const navigate = useNavigate();
  const isMapLoaded = useKakaoLoader();
  const { id } = useParams<{ id: string }>();
  const matchingId = parseInt(id || '0', 10);
  const [matchingData, setMatchingData] = useState<Matchings | null>(null);

  useEffect(() => {
    const fetchMatching = async () => {
      const matching = await getMatchingById(matchingId);
      // ...
      console.log(matching);
      setMatchingData(matching);
    };
    fetchMatching();
    console.log('매칭 데이터 : ', matchingData);
  }, [matchingId]);

  return (
    <div className="flex bg-bg-bg ">
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[15px]">
                  {/* 음식태그 */}
                  <div className="flex justify-between">
                    <div className="flex gap-[10px]">
                      <TagBadge bgColor="bg-[#F1F8E9]" textColor="text-[#33691E]">
                        양식
                      </TagBadge>
                      <TagBadge bgColor="bg-[#FCE4EC]" textColor="text-[#AD1457]">
                        실내
                      </TagBadge>
                    </div>
                    {/* 글 작성 시간 */}
                    <div className="text-[14px] text-babgray-500">30분 전</div>
                  </div>
                  {/* 제목 */}
                  <div className="text-[32px] font-bold">게시글 제목</div>
                </div>
                {/* 글 작성자 프로필 및 닉네임 */}
                <div className="flex my-[20px] gap-[20px] items-center">
                  {/* 프로필 사진 */}
                  <div className="flex w-[60px] h-[60px] rounded-full overflow-hidden ">
                    <img
                      src="https://i.namu.wiki/i/6oaSnC5nakWcmlgWXeNsU0vGH6XtsL3ulvZhuYrCLmzZMwGjofEuQUxsqM_VpbJIm8i7uSGyu6MWdumTaJnmEQ.webp"
                      alt="도도롱 사진"
                    />
                  </div>
                  {/* 닉네임 */}
                  <div className="text-[20px] font-semibold text-babgray-800">도도롱</div>
                </div>
                {/* 모임일시 및 인원 */}
                <div className="bg-bg-bg rounded-[16px]">
                  <div className="flex justify-between p-6">
                    {/* 모임 일시 */}
                    <div className="flex flex-1 items-center gap-[15px]">
                      <div className="flex items-center rounded-[32px] justify-center w-[50px] h-[50px] bg-[#DBEAFE]">
                        <RiCalendarLine className="text-[#256AEC]" />
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-babgray-500 ">모임 일시</p>
                        <p className="text-[16px] font-semibold text-babgray-800  ">
                          10월 04일 (토) 오후 7시
                        </p>
                      </div>
                    </div>
                    {/* 모집 인원 */}
                    <div className="flex flex-1 items-center gap-[15px]">
                      <div className="flex items-center rounded-[32px] justify-center w-[50px] h-[50px] bg-[#DCFCE7]">
                        <RiGroupLine className="text-[#16A34A]" />
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-babgray-500 ">모집 인원</p>
                        <p className="text-[16px] font-semibold text-babgray-800  ">2명 / 4명</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 상세설명 */}
                <div className="flex py-10 px-2">
                  <p className="text-babgray-600 leading-7">
                    안녕하세요! 이태원에 정말 맛있는 스테이크 맛집을 발견했는데, 혼자 가기엔 너무
                    아쉬워서 함께 가실 분들을 찾고 있어요.
                    <br />
                    <br />
                    이 식당은 미디움 레어로 구워주는 스테이크가 정말 일품이고, 와인 페어링도
                    훌륭해요. 분위기도 좋아서 즐거운 대화를 나누며 식사하기에 완벽한 곳입니다.
                    <br />
                    <br />
                    20-30대 직장인분들 환영하며, 맛있는 음식과 함께 좋은 인연도 만들어가요! 참여하고
                    싶으신 분들은 댓글이나 채팅 으로 연락 주세요.
                  </p>
                </div>
              </div>
              {/* 식당 정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[25px] font-bold">식당 정보</div>
                  {/* 식당 프로필 */}
                  <div className="flex gap-[30px] ">
                    {/* 식당 이미지 */}
                    <img
                      className="rounded-[20px] w-[140px] h-[140px] object-cover "
                      src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                    />
                    {/* 텍스트 정보 */}
                    <div className="flex-1 items-center">
                      {/* 식당명 */}
                      <h3 className="text-[18px] md:text-[20px] font-semibold text-babgray-900 leading-tight">
                        더 스테이크 하우스
                      </h3>

                      {/* 평점 */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          {/* 별 5개 중 4개만 강조, 마지막은 투명도로 처리 */}
                          <RiStarSFill className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                          <RiStarSFill className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                          <RiStarSFill className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                          <RiStarSFill className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                          <RiStarHalfSFill className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">4.6</span>{' '}
                          <span className="text-gray-500">(324개 리뷰)</span>
                        </p>
                      </div>

                      {/* 주소 */}
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiMapPinLine className="mt-[2px] w-4 h-4 text-[#FF5722] flex-shrink-0" />
                        서울 용산구 이태원로 154
                      </p>

                      {/* 전화번호 */}
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiPhoneLine className="mt-[2px] w-4 h-4 text-babbutton-green flex-shrink-0" />
                        02-797-8888
                      </p>

                      {/* 영업시간 */}
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiTimeLine className="mt-[2px] w-4 h-4 text-babbutton-blue flex-shrink-0" />
                        17:00 - 23:00
                        <span className="text-gray-500 ml-1">(라스트 오더 22:00)</span>
                      </p>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <ButtonLineLg style={{ fontWeight: 600, marginTop: 30 }}>
                    식당 상세정보 보기
                  </ButtonLineLg>
                </div>
              </div>
              {/* 인원 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 참여자 정보 */}
                <div className="flex flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[25px] font-bold">
                    참여자 (2/4명)
                  </div>
                  {/* 리스트 */}
                  <div className="flex flex-col gap-[20px]">
                    <ul className="space-y-3 ">
                      <li className="flex items-center gap-3">
                        {/* 프로필 사진 */}
                        <div className="flex w-[60px] h-[60px] rounded-full overflow-hidden ">
                          <img
                            src="https://i.namu.wiki/i/6oaSnC5nakWcmlgWXeNsU0vGH6XtsL3ulvZhuYrCLmzZMwGjofEuQUxsqM_VpbJIm8i7uSGyu6MWdumTaJnmEQ.webp"
                            alt="도도롱 사진"
                          />
                        </div>

                        {/* 텍스트 영역 */}
                        <div>
                          <div className="flex items-center gap-1">
                            {/* 닉네임 */}
                            <div className="text-[16px] font-semibold text-babgray-800">도도롱</div>
                            {/* <RiErrorWarningLine className="w-4 h-4 text-[#FF4D4F] flex-shrink-0" /> */}
                          </div>
                          <p className="text-gray-500 text-[13px] leading-6">모집자</p>
                        </div>
                      </li>
                    </ul>
                    <ul className="space-y-3 ">
                      <li className="flex items-center gap-3">
                        {/* 프로필 사진 */}
                        <div className="flex w-[60px] h-[60px] rounded-full overflow-hidden ">
                          <img
                            src="https://i.namu.wiki/i/Zx1CeetT0kkr1GFJCYzoHpxlG2BjllrZCjXOYz_OIHAVnSmKPq5c1nDF3R_3K0h0NyBkMdzXy35QFx-XmxWHEw.webp"
                            alt="도로롱 사진"
                          />
                        </div>

                        {/* 텍스트 영역 */}
                        <div>
                          <div className="flex items-center gap-1">
                            {/* 닉네임 */}
                            <div className="text-[16px] font-semibold text-babbutton-red">
                              도로롱
                            </div>
                            <RiErrorWarningLine className="w-4 h-4 text-babbutton-red flex-shrink-0" />
                          </div>
                          <p className="text-gray-500 text-[13px] leading-6">참여자</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* 남은 자리 안내 바 */}
                <div className="mt-5 rounded-xl bg-gray-50 text-gray-600 text-sm text-center py-4">
                  아직 2자리가 남아있어요!
                </div>
              </div>
            </div>
            {/* 오른쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              {/* 상태 배지 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <section className="w-full space-y-3">
                  <ButtonFillLG
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                  >
                    모집종료
                  </ButtonFillLG>

                  {/* 글 수정하기 버튼 */}

                  <ButtonLineLg
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                    onClick={() => navigate(`/member/matching/edit/${id}`)}
                  >
                    <div className="flex gap-[5px] justify-center items-center">
                      수정하기
                      <RiEditLine className="w-4 h-4 shrink-0  relative top-[1px]" />
                    </div>
                  </ButtonLineLg>

                  {/* 글 삭제하기 버튼 */}
                  <ButtonLineLg
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                  >
                    <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none">
                      삭제하기
                      <RiCloseFill className="w-4 h-4 shrink-0  relative top-[1px]" />
                    </div>
                  </ButtonLineLg>
                </section>
              </div>

              {/* 지도 프리뷰 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 지도 타이틀 */}
                <div className="flex w-full flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[10px] font-bold">지도</div>
                  {/* 지도 프리뷰 */}
                  <div className="h-[200px] rounded-2xl overflow-hidden ">
                    {isMapLoaded ? <KkoMapDetail /> : <div>지도를 불러오는 중입니다...</div>}
                  </div>
                  {/* 주소 */}
                  <p className="text-gray-600 text-[15px] mb-5">서울 용산구 이태원로 154</p>

                  <ButtonLineMd style={{ fontWeight: 600 }}>길찾기</ButtonLineMd>
                </div>
              </div>

              {/* 비슷한 모집글 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 지도 타이틀 */}
                <div className="flex w-full flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[10px] font-bold">
                    비슷한 모집글
                  </div>
                  {/* 모집글 */}
                  <ul className="space-y-3">
                    {/* 아이템 1 */}
                    <li className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
                      {/* 태그들 */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-[10px]">
                          <TagBadge bgColor="bg-[#F1F8E9]" textColor="text-[#33691E]">
                            양식
                          </TagBadge>
                          <TagBadge bgColor="bg-[#FCE4EC]" textColor="text-[#AD1457]">
                            실내
                          </TagBadge>
                        </div>
                      </div>

                      {/* 제목 */}
                      <p className="mt-2 text-[15px] font-semibold text-gray-900">
                        강남 오마카세 같이 가요
                      </p>

                      {/* 메타: 거리 · 시간 */}
                      <p className="mt-1 text-sm text-gray-500">1.5km · 2시간 전</p>
                    </li>

                    {/* 아이템 2 */}
                    <li className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-[10px]">
                          <TagBadge bgColor="bg-[#F1F8E9]" textColor="text-[#33691E]">
                            양식
                          </TagBadge>
                          <TagBadge bgColor="bg-[#FCE4EC]" textColor="text-[#AD1457]">
                            실내
                          </TagBadge>
                        </div>
                      </div>
                      <p className="mt-2 text-[15px] font-semibold text-gray-900">
                        이탈리안 레스토랑 모집
                      </p>
                      <p className="mt-1 text-sm text-gray-500">2.1km · 3시간 전</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingDetailPage;
