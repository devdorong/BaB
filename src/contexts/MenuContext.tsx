import { createContext, useContext, useEffect, useState } from 'react';
import type { Menus, MenusInsert, MenusUpdate } from '../types/bobType';
import { useRestaurant } from './PartnerRestaurantContext';
import {
  createMenu,
  deleteMenu,
  getMenus,
  getMenusById,
  updateMenu,
  updateMenuToggle,
} from '../services/menusService';

interface MenusContextValue {
  menus: Menus[];
  loading: boolean;
  selectedMenu: Menus | null;
  refreshMenus: () => Promise<Menus[] | undefined>;
  fetchMenuById: (id: number) => Promise<void>;
  createMenuItem: (newMenu: MenusInsert) => Promise<void>;
  updateMenuItem: (id: number, updated: MenusUpdate) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;
  updateMenuActive: (id: number, newToggle: boolean) => Promise<void>;
}

const MenusContext = createContext<MenusContextValue | undefined>(undefined);

interface MenusProviderProps {
  children: React.ReactNode;
}
export const MenusProvider = ({ children }: MenusProviderProps) => {
  const { restaurant } = useRestaurant();
  const [menus, setMenus] = useState<Menus[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menus | null>(null);
  const [loading, setLoading] = useState(false);

  // 전체 메뉴 조회
  const refreshMenus = async () => {
    if (!restaurant?.id) return;

    setLoading(true);
    try {
      const data = await getMenus(restaurant.id);
      setMenus(data);
      return data;
    } catch (error) {
      console.log('refreshMenus 에러', error);

      return [];
    } finally {
      setLoading(false);
    }
  };

  // 단일 메뉴 조회
  const fetchMenuById = async (id: number) => {
    if (!restaurant?.id) return;
    setLoading(true);
    try {
      const menu = await getMenusById(restaurant.id, id);
      setSelectedMenu(menu);
    } catch (error) {
      console.log('fetchMenuById 에러', error);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 생성
  const createMenuItem = async (newMenu: MenusInsert) => {
    if (!restaurant?.id) return;
    setLoading(true);

    try {
      await createMenu(restaurant.id, newMenu);
      await refreshMenus();
    } catch (error) {
      console.log('createMenuItem 에러 : ', error);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 수정
  const updateMenuItem = async (id: number, updated: MenusUpdate) => {
    if (!restaurant?.id) return;
    setLoading(true);
    try {
      await updateMenu(restaurant.id, id, updated);
      await refreshMenus();
    } catch (error) {
      console.log('updateMenuItem 에러', error);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 활성화 여부
  // const updateMenuActive = async (id: number, newToggle: boolean) => {
  //   if (!restaurant?.id) return;
  //   setLoading(true);
  //   try {
  //     await updateMenuToggle(restaurant.id, id, newToggle);
  //     await refreshMenus();
  //   } catch (error) {
  //     console.log('updateMenuActive 에러', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // 낙관적업데이트 참고
  const updateMenuActive = async (id: number, newToggle: boolean) => {
    if (!restaurant?.id) return;

    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
    setMenus(prevMenus =>
      prevMenus.map(menu => (menu.id === id ? { ...menu, is_active: newToggle } : menu)),
    );

    // 2. 서버에 업데이트 요청
    try {
      await updateMenuToggle(restaurant.id, id, newToggle);

      // 3. 서버 업데이트 성공 후 최신 데이터로 동기화
      await refreshMenus();
    } catch (error) {
      console.log('updateMenuActive 에러', error);

      // 4. 실패 시 롤백 (이전 상태로 되돌림)
      setMenus(prevMenus =>
        prevMenus.map(menu => (menu.id === id ? { ...menu, is_active: !newToggle } : menu)),
      );
    }
  };

  // 메뉴 삭제
  const deleteMenuItem = async (id: number) => {
    if (!restaurant?.id) return;
    setLoading(true);

    try {
      await deleteMenu(restaurant.id, id);
      await refreshMenus();
    } catch (error) {
      console.log('deleteMenuItem', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant?.id) {
      refreshMenus();
    }
  }, [restaurant?.id]);

  const value = {
    refreshMenus,
    fetchMenuById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    menus,
    loading,
    selectedMenu,
    updateMenuActive,
  };

  return <MenusContext.Provider value={value}>{children}</MenusContext.Provider>;
};

export const useMenus = () => {
  const ctx = useContext(MenusContext);
  if (!ctx) {
    throw new Error('메뉴 컨텍스트 없어요');
  }
  return ctx;
};
