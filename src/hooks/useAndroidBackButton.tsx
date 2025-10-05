import { useEffect, useCallback } from 'react';

interface UseAndroidBackButtonProps {
  onBackPress: () => boolean; // Return true if back press was handled, false to allow default behavior
}

export const useAndroidBackButton = ({ onBackPress }: UseAndroidBackButtonProps) => {
  const handleBackButton = useCallback((e: Event) => {
    e.preventDefault();
    const handled = onBackPress();
    if (!handled) {
      // If not handled by the app, allow default behavior
      return false;
    }
    return true;
  }, [onBackPress]);

  useEffect(() => {
    // Check if we're in a mobile app environment
    const isAndroidApp = () => {
      return (
        // Cordova/PhoneGap
        (window as any).cordova ||
        // Capacitor
        (window as any).Capacitor ||
        // React Native WebView
        (window as any).ReactNativeWebView ||
        // Generic WebView detection
        navigator.userAgent.includes('wv') ||
        // Check for Android and app-like environment
        (navigator.userAgent.includes('Android') && !window.location.hostname.includes('.'))
      );
    };

    if (isAndroidApp()) {
      // For Cordova/PhoneGap
      if ((window as any).cordova) {
        document.addEventListener('deviceready', () => {
          document.addEventListener('backbutton', handleBackButton, false);
        });
      }
      
      // For Capacitor
      if ((window as any).Capacitor && (window as any).Capacitor.Plugins?.App) {
        const { App } = (window as any).Capacitor.Plugins;
        App.addListener('backButton', handleBackButton);
      }

      // For React Native WebView
      if ((window as any).ReactNativeWebView) {
        document.addEventListener('message', (event: any) => {
          if (event.data === 'ANDROID_BACK_PRESSED') {
            handleBackButton(event);
          }
        });
      }

      // Fallback: Listen for Android back button through custom event
      document.addEventListener('android-back-button', handleBackButton);
      
      // Also listen for browser back button as fallback
      window.addEventListener('popstate', handleBackButton);
    } else {
      // For regular web browsers, just use popstate
      window.addEventListener('popstate', handleBackButton);
    }

    return () => {
      // Cleanup
      document.removeEventListener('backbutton', handleBackButton);
      document.removeEventListener('android-back-button', handleBackButton);
      window.removeEventListener('popstate', handleBackButton);
      
      // Capacitor cleanup
      if ((window as any).Capacitor && (window as any).Capacitor.Plugins?.App) {
        const { App } = (window as any).Capacitor.Plugins;
        App.removeAllListeners();
      }
    };
  }, [handleBackButton]);
};

// Helper function to trigger Android back button programmatically
export const triggerAndroidBack = () => {
  // Try different methods to go back
  if (window.history.length > 1) {
    window.history.back();
  } else if ((window as any).Capacitor && (window as any).Capacitor.Plugins?.App) {
    // For Capacitor apps, we can exit the app if we're at root
    const { App } = (window as any).Capacitor.Plugins;
    App.exitApp();
  } else if ((window as any).cordova && (window as any).navigator?.app) {
    // For Cordova apps
    (window as any).navigator.app.exitApp();
  } else {
    // Fallback: trigger custom event
    const event = new CustomEvent('android-back-button');
    document.dispatchEvent(event);
  }
};