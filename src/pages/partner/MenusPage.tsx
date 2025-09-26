import { useMemo, useState } from 'react';
import MenuCategory from '../../components/partner/MenuCategory';
import MenusList, {
  CATEGORY_TABS,
  dororongpizza,
  type Category,
  type CategoryTab,
  type MenuItem,
} from '../../components/partner/MenusList';
import AddMenuModal from '../../components/partner/AddMenuModal';

type Interest = {
  id: number;
  name: string; // 예: "매운맛", "치즈", "단짠"
};

type AddMenuProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    title: string;
    description?: string;
    price: number;
    tag: Category;
    interestIs: number[];
    enabled?: boolean;
    files: File[]; // 업로드용 파일
  }) => void;
};


function MenusPage() {
  // 선택된 탭
  const [selected, setSelected] = useState<CategoryTab>('전체');
  const [menuToggle, setMenuToggle] = useState<MenuItem[]>(dororongpizza);
  const [writeOpen, setWriteOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  // 관심사
  const interests: Interest[] = [
    { id: 1, name: '매운맛' },
    { id: 2, name: '치즈' },
    { id: 3, name: '단짠' },
  ]; // ✅ 실제로는 Supabase에서 불러와야
  const toggleInterest = (id: number) => {
    setSelectedInterests(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  // 선택된 탭에 맞는 필터링
  const filtered = useMemo(() => {
    if (selected === '전체') {
      return dororongpizza;
    }
    return menuToggle.filter(item => item.tag === selected);
  }, [selected, menuToggle]);

  const handleMenuToggle = (id: number, newToggle: boolean) => {
    setMenuToggle(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: newToggle } : item)),
    );
  };

  return (
    <div className="flex flex-col gap-[25px]">
      <div>
        <MenuCategory categories={CATEGORY_TABS} value={selected} onChange={setSelected} />
      </div>
      <div>
        <MenusList filtered={filtered} onToggle={handleMenuToggle} />
      </div>
      {/* <AddMenuModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        onSubmit={data => {
          console.log('새 메뉴 추가 제출', data);
        }}
      /> */}
    </div>
  );
}

export default MenusPage;
