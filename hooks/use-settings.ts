'use client';

import { useState, useEffect } from 'react';

export interface Settings {
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('json-formatter-settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return;

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme, isLoaded]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem('json-formatter-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return {
    settings,
    isLoaded,
    updateSettings,
    toggleTheme,
  };
} 