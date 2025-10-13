import { createContext, useContext, useState, useEffect } from 'react';
import type { Database } from '../types/bobType';
import { getMyRestaurant } from '../services/restaurants';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface PartnerRestaurantContextType {
  restaurant: Restaurant | null;
  refreshRestaurant: () => Promise<void>;
}

const PartnerRestaurantContext = createContext<PartnerRestaurantContextType | undefined>(undefined);

export const PartnerRestaurantProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const refreshRestaurant = async () => {
    const data = await getMyRestaurant();
    setRestaurant(data);
  };

  useEffect(() => {
    refreshRestaurant();
  }, []);

  return (
    <PartnerRestaurantContext.Provider value={{ restaurant, refreshRestaurant }}>
      {children}
    </PartnerRestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const ctx = useContext(PartnerRestaurantContext);
  if (!ctx) throw new Error('파트너 레스토랑 컨텍스트가 없어요');
  return ctx;
};
