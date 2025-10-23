type MenuCardProps = {
  name: string;
  description?: string | null;
  price: number;
  category?: string; // 예: "메인 요리"
  image_url?: string | null;
  is_active: boolean | null;
  onToggle?: (newToggle: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  modal: any;
  openModal: (...args: any[]) => void;
  closeModal: () => void;
};

function formatPrice(krw: number) {
  return krw.toLocaleString('ko-KR') + '원';
}

export default function MenuCard({
  name,
  description,
  price,
  category,
  image_url,
  is_active,
  onToggle,
  onEdit,
  onDelete,
  modal,
  openModal,
  closeModal,
}: MenuCardProps) {
  return (
    <article className="w-full rounded-lg border border-babgray-150 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* 이미지 영역 */}
      <div className="p-3">
        <div className="w-full aspect-[5/3] rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
              onError={e => {
                const el = e.currentTarget;
                el.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-500 text-sm">이미지 없음</div>
          )}
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="px-4">
        {/* 타이틀 + 토글 */}
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-gray-900 truncate">{name}</h3>

          {/* 토글 스위치 */}
          <button
            type="button"
            aria-label={is_active ? '메뉴 비활성화' : '메뉴 활성화'}
            onClick={() => onToggle?.(!is_active)}
            className={[
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
              is_active ? 'bg-[#FF5722]' : 'bg-gray-300',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                is_active ? 'translate-x-[18px]' : 'translate-x-[2px]',
              ].join(' ')}
            />
          </button>
        </div>

        {/* 설명 */}

        <p className="h-[40px] mt-1 text-[13px] text-gray-600 line-clamp-2">{description || ''}</p>

        {/* 가격 + 태그 */}
        <div className="mt-2 flex items-center justify-between">
          <strong className="text-[16px] font-extrabold text-[#FF5722]">
            {formatPrice(price)}
          </strong>
          {category && (
            <span className="shrink-0 rounded-full border border-gray-150 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-700">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div className="mt-1 grid grid-cols-2 gap-3 p-3">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-babgray-150 text-gray-600 text-[14px] hover:bg-gray-300 transition-colors"
        >
          수정
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-bab-500 text-white text-[14px] hover:bg-bab-600 transition-colors"
        >
          삭제
        </button>
      </div>
    </article>
  );
}
