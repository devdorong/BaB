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
      getPopupContainer={trigger => trigger.parentElement || document.body}
      styles={{
        popup: {
          root: {
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
          },
        },
      }}
      classNames={{
        popup: {
          root: 'bab-select-dropdown', // ✅ 객체 안에 root 키로 전달해야 함
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
