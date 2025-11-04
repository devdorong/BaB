export const RecentMatchingRecordSkeleton = () => {
  return (
    <section className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] animate-pulse">
      <div className="flex gap-5 items-start">
        {/* 프로필 */}
        <div className="hidden lg:flex w-14 h-14 rounded-full bg-gray-200" />

        {/* 오른쪽 내용 */}
        <div className="flex flex-col flex-1 gap-4">
          {/* 이름 + 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-24 h-5 bg-gray-200 rounded" />
              <div className="w-10 h-5 bg-gray-200 rounded-full" />
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>

          {/* 장소 + 시간 */}
          <div className="flex flex-col gap-2">
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
            <div className="w-1/3 h-4 bg-gray-200 rounded" />
          </div>

          {/* 태그 */}
          <div className="flex gap-2 mt-1">
            <div className="w-12 h-5 bg-gray-200 rounded-full" />
          </div>

          {/* 참가자 정보 */}
          <div className="bg-gray-50 rounded-xl p-4 mt-2 flex flex-col gap-3">
            <div className="w-20 h-4 bg-gray-200 rounded" />
            <div className="flex gap-3 mt-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
