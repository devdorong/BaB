import type { Menus, MenusInsert, MenusUpdate } from '../types/bobType';
import { supabase } from '../lib/supabase';

export const getMenus = async (restaurantId: number): Promise<Menus[]> => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('category', { ascending: true })
    .order('id', { ascending: true });
  if (error) {
    console.log('getMenus 오류 메시지 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? [];
};

export const getMenusById = async (restaurantId: number, menuId: number): Promise<Menus | null> => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (error) {
    console.log('getMenusById', error.message);
    throw new Error(error.message);
  }
  return data ?? null;
};

export const createMenu = async (restaurantId: number, newMenu: MenusInsert): Promise<void> => {
  const { error } = await supabase
    .from('menus')
    .insert([{ ...newMenu, restaurant_id: restaurantId }]);

  if (error) {
    console.log('createMenus 오류 : ', error.message);
    throw new Error(error.message);
  }
};

export const updateMenu = async (
  restaurantId: number,
  menuId: number,
  updated: MenusUpdate,
): Promise<void> => {
  const { error } = await supabase
    .from('menus')
    .update(updated)
    .eq('id', menuId)
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.log('updateMenu 오류 : ', error.message);
    throw new Error(error.message);
  }
};

export const deleteMenu = async (restaurantId: number, menuId: number): Promise<void> => {
  const { error } = await supabase
    .from('menus')
    .delete()
    .eq('id', menuId)
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.log('deleteMenu 오류 : ', error.message);
    throw new Error(error.message);
  }
};
