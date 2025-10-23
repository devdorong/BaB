import { createContext, useContext, useEffect, useState } from 'react';
import { getMyRestaurant } from '../services/restaurants';
import type { Restaurants } from '../types/bobType';
import { useAuth } from './AuthContext';

interface PartnerRestaurantContextType {
  restaurant: Restaurants | null;
  refreshRestaurant: () => Promise<void>;
}

const PartnerRestaurantContext = createContext<PartnerRestaurantContextType | undefined>(undefined);

export const PartnerRestaurantProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurant, setRestaurant] = useState<Restaurants | null>(null);
  const { user } = useAuth();
  const refreshRestaurant = async () => {
    const data = await getMyRestaurant();
    setRestaurant(data);
  };

  useEffect(() => {
    if (!user) return;
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
