import { createContext, useContext, useState } from 'react';

type AdminHeaderContextType = {
  title: string;
  subtitle: string;
  setHeader: (title: string, subtitle?: string) => void;
};

const AdminHeaderContext = createContext<AdminHeaderContextType | undefined>(undefined);

export function AdminHeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const setHeader = (t: string, s = '') => {
    setTitle(t);
    setSubtitle(s);
  };

  return (
    <AdminHeaderContext.Provider value={{ title, subtitle, setHeader }}>
      {children}
    </AdminHeaderContext.Provider>
  );
}

export function useAdminHeader() {
  const ctx = useContext(AdminHeaderContext);
  if (!ctx) throw new Error('useAdminHeader must be used within AdminHeaderProvider');
  return ctx;
}
