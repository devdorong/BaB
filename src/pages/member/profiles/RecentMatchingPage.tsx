function RecentMatchingPage() {
  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">최근 매칭 기록</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div>
                  <p className="text-[16px] font-bold">매칭 통계</p>
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#DCFCE7]">
                      <div className="text-[22px] font-bold text-babbutton-green">12</div>
                      <div className="text-[13px] text-babgray-500">총 매칭</div>
                    </div>
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#DBEAFE]">
                      <div className="text-[22px] font-bold text-babbutton-blue">9</div>
                      <div className="text-[13px] text-babgray-500">성공한 매칭</div>
                    </div>
                    <div className="flex flex-col rounded-[12px] w-[200px] py-[16px] justify-center items-center bg-[#FFF2EE]">
                      <div className="text-[22px] font-bold text-bab-500">75%</div>
                      <div className="text-[13px] text-babgray-500">성공률</div>
                    </div>
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

export default RecentMatchingPage;
