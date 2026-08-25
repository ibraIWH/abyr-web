import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const SettingsContext = createContext();

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    hero: null,
    newsText: '',
    newsActive: true,
    offers: [],
    collections: [],
    loading: true,
  });

  const fetchAll = async () => {
    try {
      const [settingsRes, offersRes, collectionsRes] = await Promise.all([
        api.get('/settings'),
        api.get('/offers'),
        api.get('/collections'),
      ]);

      setSettings({
        hero: settingsRes.data.hero,
        newsText: settingsRes.data.newsText,
        newsActive: settingsRes.data.newsActive,
        offers: offersRes.data,
        collections: collectionsRes.data,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      setSettings(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};