import React, { useState } from 'react';

const CATS = ['전체', '피자', '사이드', '음료'] as const;
type Cat = (typeof CATS)[number];

function MenuCategory({
  value,
  onChange,
  className = '',
}: {
  value?: Cat;
  onChange?: (c: Cat) => void;
  className?: string;
}) {
  const [inner, setInner] = useState<Cat>(value ?? '전체');
  const current = value ?? inner;

  const handle = (c: Cat) => {
    setInner(c);
    onChange?.(c);
  };

  return (
    <div
      className={['w-full rounded-xl border border-gray-100 bg-white', 'px-3 py-2', className].join(
        ' ',
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {CATS.map(c => {
          const active = c === current;
          return (
            <button
              key={c}
              type="button"
              onClick={() => handle(c)}
              className={[
                'h-8 px-3 rounded-full text-sm font-medium transition-colors',
                active ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]/40',
              ].join(' ')}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MenuCategory;
