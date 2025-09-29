import { useRef, useState } from 'react';
import {
  RiArrowDownBoxLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiChat3Fill,
  RiEditLine,
  RiHeartLine,
  RiImage2Line,
  RiQuestionAnswerLine,
  RiShareForward2Line,
  RiShareForwardLine,
  RiStarFill,
  RiStarLine,
  RiTimeLine,
  RiUser2Line,
  RiUserFill,
  RiUserLine,
} from 'react-icons/ri';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { MoneyDollarCircleFill, StarFill, TimeLine } from '../../ui/Icon';

function ReviewPage() {
  return (
    <>
      <PartnerBoardHeader title="고객 리뷰" subtitle="고객 리뷰를 확인하고 답변을 관리하세요." />
      <div className="flex flex-col gap-6">
        {/* 상단 */}
        <div className="flex gap-6">
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between items-center">
            <div className="flex flex-col gap-2 justify-start">
              <p className="text-babgray-600">평균 별점</p>
              {/* 하루 매출 값 출력(최근 주문 영역의 금액내역 추출) */}
              <p className="text-2xl font-semibold">4.4점</p>
              <p className="flex text-babbutton-yellow">
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarLine />
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-yellow rounded-lg flex items-center justify-center">
              <RiStarFill size={20} color="#fff" />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">총 리뷰 수</p>
              {/* 대기 중인 주문 출력 (최근주문 영역의 조리중,주문접수만 체크) */}
              <p className="text-2xl font-semibold">5개</p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-blue rounded-lg flex items-center justify-center">
              <RiChat3Fill color="#fff" size={20} />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">답변 대기</p>
              {/* 새로운 리뷰 출력 (고객리뷰 탭의 하루? 최근일주일? 동안의 등록글 카운팅 출력) */}
              <p className="text-2xl font-semibold">2개</p>
              <p className="flex items-center justify-center text-babbutton-yellow">
                <RiTimeLine size={16} />
                답변 필요
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-bab rounded-lg flex items-center justify-center">
              <RiQuestionAnswerLine color="#fff" size={20} />
            </div>
          </div>
        </div>
        {/* 중단 */}
        <div className="self-stretch p-6 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border border-babgray-150 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch inline-flex  items-center justify-between ">
            <div className="w-28 inline-flex flex-col justify-start items-start gap-[3px]">
              <div className="self-stretch justify-start text-black text-base font-medium ">
                평점
              </div>
              <div className="self-stretch h-10 pl-3.5 pr-1.5 py-2.5 rounded-lg border border-babgray-150 inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-babgray-800 text-base font-medium ">
                  전체 평점
                </div>
                <div className="w-4 h-4 relative overflow-hidden">
                  <RiArrowDownSLine />
                </div>
              </div>
            </div>
            <div className=" text-babgray-600 text-base font-medium ">총 5개의 리뷰</div>
          </div>
        </div>
        {/* 하단 */}
        <div className="w-full flex flex-col gap-6">
          {[...Array(3)].map((_, index) => (
            <>
              <div className="self-stretch w-full px-6 pt-7 pb-2 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border border-babgray-150 inline-flex flex-col justify-start items-start gap-2.5">
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-5">
                    <div className="w-full flex flex-col justify-start items-start gap-5">
                      <div className="inline-flex justify-start items-center gap-3">
                        <div className="w-10 h-10 p-2.5 bg-babgray-150 rounded-[20px] flex justify-center items-center gap-2.5">
                          <div className="w-4 h-4 relative overflow-hidden">
                            <RiUserLine />
                          </div>
                        </div>
                        <div className="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                          <div className="self-stretch justify-start text-black text-base font-normal ">
                            김미영
                          </div>
                          <div className="self-stretch inline-flex justify-start items-center gap-1.5">
                            <div className="flex items-center text-babbutton-yellow">
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarLine />
                            </div>
                            <div className="justify-start">
                              <span className="text-babgray-500 text-base font-normal ">
                                · 2024-01-15 ·
                              </span>
                              <span className="text-bab text-base font-normal "> ORD-034</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-babgray-700 text-base font-normal ">
                        정말 맛있었어요! 연어구이가 특히 훌륭했습니다. 직원분들도 너무 친절하시고
                        분위기도 좋았어요. 다음에 또 방문하겠습니다.
                      </div>
                    </div>
                    <div className="self-stretch px-5 py-4 bg-bab-100 border-l-4 border-bab-500 flex flex-col justify-start items-start gap-2.5">
                      <div className="self-stretch inline-flex justify-start items-center gap-2 text-bab">
                        <RiShareForwardLine className="flex transform scale-x-[-1]" />
                        <div className="w-full inline-flex flex-col justify-center items-center gap-1.5">
                          <div className="self-stretch justify-start text-bab-700 text-base font-normal ">
                            사장님 답글
                          </div>
                          <div className="self-stretch justify-start text-babgray-700 text-base font-normal ">
                            소중한 리뷰 감사합니다! 다음에도 더욱 맛있는 요리로 보답하겠습니다.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch pl-2 py-4 border-t border-babgray-100 inline-flex justify-between items-center">
                    <div className="w-4 h-4 relative overflow-hidden text-babgray-300">
                      <RiHeartLine />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiEditLine className="flex" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          답글 수정
                        </div>
                      </div>
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiShareForwardLine className="flex transform scale-x-[-1]" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          리뷰 삭제 요청하기
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-속성-1="false"
                className="self-stretch px-6 pt-7 pb-2 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]  inline-flex flex-col justify-start items-start gap-2.5"
              >
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-5">
                    <div className="w-full flex flex-col justify-start items-start gap-5">
                      <div className="inline-flex justify-start items-center gap-3">
                        <div className="w-10 h-10 p-2.5 bg-babgray-150 rounded-[20px] flex justify-center items-center gap-2.5">
                          <div className="w-4  relative overflow-hidden">
                            <RiUserLine />
                          </div>
                        </div>
                        <div className="w-64 inline-flex flex-col justify-start items-start gap-2.5">
                          <div className="self-stretch justify-start text-black text-base font-normal ">
                            김미영
                          </div>
                          <div className="self-stretch inline-flex justify-start items-center gap-1.5">
                            <div className="flex items-center text-babbutton-yellow">
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarFill />
                              <RiStarFill />
                            </div>
                            <div className="justify-start">
                              <span className="text-babgray-500 text-base font-normal ">
                                · 2024-01-15 ·
                              </span>
                              <span className="text-bab text-base font-normal "> ORD-034</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-babgray-700 text-base font-normal ">
                        정말 맛있었어요! 연어구이가 특히 훌륭했습니다. 직원분들도 너무 친절하시고
                        분위기도 좋았어요. 다음에 또 방문하겠습니다.
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch pl-2 py-4 border-t border-babgray-100 inline-flex justify-between items-center">
                    <div className="w-4 h-4 relative overflow-hidden text-babgray-300">
                      <RiHeartLine />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiEditLine className="flex" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          답글 달기
                        </div>
                      </div>
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiShareForwardLine className="flex transform scale-x-[-1]" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          리뷰 삭제 요청하기
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
