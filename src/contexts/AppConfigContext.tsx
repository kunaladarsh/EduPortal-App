import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppConfig, defaultAppConfig, fetchAppConfig, applyThemeColors } from '../services/appConfigService';

interface AppConfigContextType {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};

interface AppConfigProviderProps {
  children: React.ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedConfig = await fetchAppConfig();
      setConfig(fetchedConfig);
      
      // Apply the theme colors to CSS custom properties
      applyThemeColors(fetchedConfig);
      
      // Update the page title
      document.title = fetchedConfig.appName;
      
      // Update favicon if logoUrl is provided
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon && fetchedConfig.logoUrl) {
        favicon.href = fetchedConfig.logoUrl;
      }
      
    } catch (err) {
      console.error('Failed to load app configuration:', err);
      setError('Failed to load app configuration');
      // Still apply default theme
      applyThemeColors(defaultAppConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConfig = async () => {
    await loadConfig();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const value: AppConfigContextType = {
    config,
    isLoading,
    error,
    refreshConfig,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};