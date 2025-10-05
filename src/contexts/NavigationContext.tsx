import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAndroidBackButton } from '../hooks/useAndroidBackButton';

interface NavigationState {
  currentPage: string;
  pageHistory: string[];
  canGoBack: boolean;
}

interface NavigationContextType extends NavigationState {
  navigateTo: (page: string) => void;
  goBack: () => boolean;
  clearHistory: () => void;
  setInitialPage: (page: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationProviderProps {
  children: React.ReactNode;
  initialPage?: string;
  onPageChange?: (page: string) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialPage = 'dashboard',
  onPageChange 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageHistory, setPageHistory] = useState<string[]>([initialPage]);

  // Handle Android back button
  const handleAndroidBackPress = useCallback((): boolean => {
    if (pageHistory.length > 1) {
      // Go back to previous page
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
      
      // Update browser history without adding new entry
      if (window.history.state?.page !== previousPage) {
        window.history.replaceState({ page: previousPage }, '', window.location.pathname);
      }
      
      onPageChange?.(previousPage);
      return true; // Indicate that we handled the back press
    }
    
    // If we're at the root page, allow default behavior (exit app)
    return false;
  }, [pageHistory, onPageChange]);

  useAndroidBackButton({ onBackPress: handleAndroidBackPress });

  // Handle browser popstate for web environments
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.page && state.page !== currentPage) {
        // Sync with browser history
        setCurrentPage(state.page);
        setPageHistory(prev => {
          const newHistory = [...prev];
          // If this page is already in history, trim to that point
          const existingIndex = newHistory.findIndex(page => page === state.page);
          if (existingIndex >= 0) {
            return newHistory.slice(0, existingIndex + 1);
          }
          // Otherwise add to history
          if (newHistory[newHistory.length - 1] !== state.page) {
            newHistory.push(state.page);
          }
          return newHistory;
        });
        onPageChange?.(state.page);
      }
    };

    // Only listen to popstate in browser environments, not in Android apps
    const isAndroidApp = (window as any).cordova || (window as any).Capacitor || (window as any).ReactNativeWebView;
    if (!isAndroidApp) {
      window.addEventListener('popstate', handlePopState);
      
      // Set initial browser history state
      if (window.history.state === null) {
        window.history.replaceState({ page: currentPage }, '', window.location.pathname);
      }
    }

    return () => {
      if (!isAndroidApp) {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [currentPage, onPageChange]);

  const navigateTo = useCallback((page: string) => {
    if (page === currentPage) return;

    const newHistory = [...pageHistory, page];
    
    // Keep history manageable
    if (newHistory.length > 10) {
      newHistory.shift();
    }
    
    setPageHistory(newHistory);
    setCurrentPage(page);
    
    // Update browser history for web environments
    const isAndroidApp = (window as any).cordova || (window as any).Capacitor || (window as any).ReactNativeWebView;
    if (!isAndroidApp) {
      window.history.pushState({ page }, '', window.location.pathname);
    }
    
    onPageChange?.(page);
  }, [currentPage, pageHistory, onPageChange]);

  const goBack = useCallback((): boolean => {
    return handleAndroidBackPress();
  }, [handleAndroidBackPress]);

  const clearHistory = useCallback(() => {
    setPageHistory([currentPage]);
  }, [currentPage]);

  const setInitialPage = useCallback((page: string) => {
    setCurrentPage(page);
    setPageHistory([page]);
    
    const isAndroidApp = (window as any).cordova || (window as any).Capacitor || (window as any).ReactNativeWebView;
    if (!isAndroidApp) {
      window.history.replaceState({ page }, '', window.location.pathname);
    }
    
    onPageChange?.(page);
  }, [onPageChange]);

  const value: NavigationContextType = {
    currentPage,
    pageHistory,
    canGoBack: pageHistory.length > 1,
    navigateTo,
    goBack,
    clearHistory,
    setInitialPage
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};