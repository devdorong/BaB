import { useMemo, useState } from 'react';
import AddMenuModal from '../../components/partner/AddMenuModal';
import MenuCategory from '../../components/partner/MenuCategory';
import MenusList, { CATEGORY_TABS, type CategoryTab } from '../../components/partner/MenusList';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { useMenus } from '../../contexts/MenuContext';
import { ButtonFillLG } from '../../ui/button';
import EditMenuModal from '../../components/partner/EditMenuModal';

function MenusPage() {
  // 선택된 탭
  const [selected, setSelected] = useState<CategoryTab>('전체');
  const [writeOpen, setWriteOpen] = useState(false);
  const { menus, updateMenuActive } = useMenus();

  // 선택된 탭에 맞는 필터링
  const filtered = useMemo(() => {
    if (selected === '전체') {
      return menus;
    }
    return menus.filter(item => item.category === selected);
  }, [selected, menus]);

  const handleMenuToggle = async (id: number, newToggle: boolean) => {
    await updateMenuActive(id, newToggle);
  };

  return (
    <>
      <PartnerBoardHeader
        title="메뉴 관리"
        subtitle="레스토랑 메뉴를 추가, 수정, 삭제할 수 있습니다."
        button={<ButtonFillLG onClick={() => setWriteOpen(true)}>새 메뉴 추가</ButtonFillLG>}
      />
      <div id="root" className="flex flex-col min-h-screen">
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
      </div>
    </>
  );
}

export default MenusPage;
