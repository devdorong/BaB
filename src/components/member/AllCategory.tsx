import { Select } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';
import { fetchInterests } from '../../lib/interests';

const { Option } = Select;

interface AllCategoryProps {
  value: number | string | null;
  onChange: (v: number | string) => void;
}

export default function AllCategory({ value, onChange }: AllCategoryProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const all = await fetchInterests();
      const foodCategories = all.filter(item => item.category === '음식 종류');
      setCategories(foodCategories);
    };
    loadCategories();
  }, []);

  return (
    <Select
  value={value || undefined}
  onChange={onChange}
  suffixIcon={null}
  placeholder="카테고리"
  className="bab-select text-center justify-center items-center w-[121px] h-[50px]"
  // ✅ dropdown을 부모 엘리먼트 안에 렌더링 (필수)
  getPopupContainer={trigger => trigger.parentElement!}
  // ✅ popup 스타일 (모바일 스크롤 안정화)
  styles={{
    popup: {
      root: {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'auto',          // ← pan-y 대신 auto
        pointerEvents: 'auto',        // ← 스크롤 반응 향상
      },
    },
  }}
  // ✅ Tailwind 클래스 적용 (선택)
  classNames={{
    popup: {
      root: 'bab-select-dropdown',
    },
  }}
  listHeight={256}
  virtual={false}
>
  <Option value="전체">전체</Option>
  {categories.map(cat => (
    <Option key={cat.id} value={cat.name}>
      {cat.name}
    </Option>
  ))}
</Select>

  );
}

// <Select
//   value={value || undefined}
//   onChange={onChange}
//   suffixIcon={null}
//   placeholder="카테고리"
//   className="bab-select touch-manipulation text-center justify-center items-center w-[121px] h-[50px]"
//   getPopupContainer={trigger => trigger.parentElement || document.body}
//   styles={{
//     popup: {
//       root: {
//         touchAction: 'pan-y',
//         overscrollBehavior: 'contain',
//       },
//     },
//   }}
//   popupClassName="bab-select-dropdown"
//   listHeight={256}
//   virtual={false}
// >
//   <Option value="전체">전체</Option>

//   {categories.map(cat => (
//     <Option key={cat.id} value={cat.name}>
//       {cat.name}
//     </Option>
//   ))}
// </Select>
