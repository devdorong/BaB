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
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { ButtonFillLG } from '../../ui/button';

function MenusPage() {
  // 선택된 탭
  const [selected, setSelected] = useState<CategoryTab>('전체');
  const [menuToggle, setMenuToggle] = useState<MenuItem[]>(dororongpizza);
  const [writeOpen, setWriteOpen] = useState(false);

  // 선택된 탭에 맞는 필터링
  const filtered = useMemo(() => {
    if (selected === '전체') {
      return menuToggle;
    }
    return menuToggle.filter(item => item.tag === selected);
  }, [selected, menuToggle]);

  const handleMenuToggle = (id: number, newToggle: boolean) => {
    setMenuToggle(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: newToggle } : item)),
    );
  };

  return (
    <>
      <PartnerBoardHeader
        title="메뉴 관리"
        subtitle="레스토랑 메뉴를 추가, 수정, 삭제할 수 있습니다."
        button={<ButtonFillLG onClick={() => setWriteOpen(true)}>새 메뉴 추가</ButtonFillLG>}
      />
      <div className="flex flex-col gap-[25px]">
        <div>
          <MenuCategory categories={CATEGORY_TABS} value={selected} onChange={setSelected} />
        </div>
        <div>
          <MenusList filtered={filtered} onToggle={handleMenuToggle} />
        </div>

        <AddMenuModal
          open={writeOpen}
          onClose={() => setWriteOpen(false)}
          onSubmit={data => {
            console.log('새 메뉴 추가 제출', data);
          }}
        />
      </div>
    </>
  );
}

export default MenusPage;
