import { createContext, useContext, useEffect, useState } from 'react';
import type { Menus, MenusInsert, MenusUpdate } from '../types/bobType';
import { useRestaurant } from './PartnerRestaurantContext';
import {
  createMenu,
  deleteMenu,
  getMenus,
  getMenusById,
  updateMenu,
} from '../services/menusService';

interface MenusContextValue {
  menus: Menus[];
  loading: boolean;
  selectedMenu: Menus | null;
  refreshMenus: () => Promise<void>;
  fetchMenuById: (id: number) => Promise<void>;
  createMenuItem: (newMenu: MenusInsert) => Promise<void>;
  updateMenuItem: (id: number, updated: MenusUpdate) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;
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
    } catch (error) {
      console.log('refreshMenus 에러', error);
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
