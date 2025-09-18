export type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  roadAddress?: string;
  phone?: string;
  url?: string;
  distance?: number;
  category?: string;
  thumbnail?: string;
};
