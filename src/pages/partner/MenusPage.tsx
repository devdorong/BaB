import { useEffect, useMemo, useState } from 'react';
import AddMenuModal from '../../components/partner/AddMenuModal';
import MenuCategory from '../../components/partner/MenuCategory';
import MenusList, { CATEGORY_TABS, type CategoryTab } from '../../components/partner/MenusList';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { useMenus } from '../../contexts/MenuContext';
import { ButtonFillLG } from '../../ui/button';
import EditMenuModal from '../../components/partner/EditMenuModal';
import type { Menus } from '../../types/bobType';

function MenusPage() {
  // 선택된 탭
  const { menus, updateMenuActive, deleteMenuItem } = useMenus();
  const [selected, setSelected] = useState<CategoryTab>('전체');
  const [writeOpen, setWriteOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<Menus | null>(null);
  const [isEdit, setIsEdit] = useState(false);

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

  const handleMenuDelete = async (menu: Menus) => {
    const confirmDelete = window.confirm(
      `'${menu.name}' 메뉴를 삭제하시겠습니까?\n삭제된 메뉴는 복구할 수 없습니다.`,
    );

    if (confirmDelete) {
      try {
        await deleteMenuItem(menu.id);
        alert('메뉴가 삭제되었습니다.');
      } catch (error) {
        console.error('메뉴 삭제 실패:', error);
        alert('메뉴 삭제에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    console.log(editMenu);
  }, [editMenu]);

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
            <MenusList
              filtered={filtered}
              onToggle={handleMenuToggle}
              onEdit={setEditMenu}
              onDelete={handleMenuDelete}
            />
          </div>

          <AddMenuModal
            open={writeOpen}
            onClose={() => setWriteOpen(false)}
            onSubmit={data => {
              console.log('새 메뉴 추가 제출', data);
            }}
          />
          {editMenu && (
            <EditMenuModal open={true} onClose={() => setEditMenu(null)} menu={editMenu} />
          )}
        </div>
      </div>
    </>
  );
}

export default MenusPage;
