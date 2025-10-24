// EventCardSkeleton.tsx

export default function EventCardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="w-full h-[400px] bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]
          flex flex-col justify-between animate-pulse overflow-hidden"
        >
          {/* 이미지 영역 */}
          <div className="w-full h-[200px] bg-gray-200" />

          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-3 p-4">
            <div className="h-5 w-full bg-gray-200 rounded-md" />
            <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
            <div className="h-4 w-1/3 bg-gray-200 rounded-md" />

            {/* 버튼 모양 */}
            <div className="mt-2 h-9 w-full bg-gray-200 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
