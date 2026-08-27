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
    categories: [],
    collections: [], // kept as an alias of categories so older code keeps working
    loading: true,
  });

  // Retry a request a couple of times before giving up.
  // Two things cause transient failures here: the browser changing network
  // mid-request (ERR_NETWORK_CHANGED), and Render's free tier taking ~30s to
  // wake up. Both fix themselves on a second attempt a moment later.
  const getWithRetry = async (path, tries = 3, delay = 1500) => {
    for (let attempt = 1; attempt <= tries; attempt++) {
      try {
        return await api.get(path);
      } catch (err) {
        if (attempt === tries) throw err;
        await new Promise((r) => setTimeout(r, delay * attempt)); // 1.5s, then 3s
      }
    }
  };

  const fetchAll = async () => {
    // allSettled instead of all: if one endpoint fails (or is still waking up),
    // the others still load. With Promise.all a single failure blanked the
    // whole site — hero, banner and categories all at once.
    const [settingsRes, offersRes, categoriesRes] = await Promise.allSettled([
      getWithRetry('/settings'),
      getWithRetry('/offers'),
      getWithRetry('/categories'),
    ]);

    const settingsData = settingsRes.status === 'fulfilled' ? settingsRes.value.data : {};
    const offers = offersRes.status === 'fulfilled' ? offersRes.value.data : [];
    const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : [];

    if (categoriesRes.status === 'rejected') {
      console.error('Failed to load categories:', categoriesRes.reason?.message);
    }

    setSettings({
      hero: settingsData.hero || null,
      newsText: settingsData.newsText || '',
      newsActive: settingsData.newsActive ?? true,
      offers,
      categories,
      collections: categories,
      loading: false,
    });
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