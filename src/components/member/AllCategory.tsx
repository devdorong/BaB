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
      placeholder="카테고리"
      className="bab-select w-[120px] h-[50px]"
      classNames={{
        popup: {
          root: 'bab-select-dropdown',
        },
      }}
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
