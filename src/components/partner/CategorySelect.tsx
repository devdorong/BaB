import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchInterests } from '../../lib/interests';

const { Option } = Select;

// const categories = [
//   '한식',
//   '양식',
//   '중식',
//   '일식',
//   '샐러드',
//   '카페·디저트',
//   '돈까스·일식',
//   '피자',
//   '패스트푸드',
//   '분식',
//   '치킨',
//   '고기',
//   '도시락·죽',
// ];

export default function CategorySelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
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
    <div className="flex flex-col gap-2">
      <Select
        value={value || undefined}
        onChange={onChange}
        placeholder="카테고리"
        className="bab-select w-[530px] h-[50px]"
        classNames={{
          popup: {
            root: 'bab-select-dropdown',
          },
        }}
      >
        {categories.map(cat => (
          <Option key={cat.id} value={cat.id}>
            {cat.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
