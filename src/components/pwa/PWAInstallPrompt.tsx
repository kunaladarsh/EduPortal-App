import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { X, Smartphone, Download, Star } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Check if we're in a PWA-compatible environment
  const isPWAEnvironment = typeof window !== 'undefined' && 
                           !window.location.hostname.includes('edu') && 
                           window.location.protocol === 'https:';

  // Don't render in non-PWA environments
  if (!isPWAEnvironment) {
    return null;
  }

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const fullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const webApp = (window.navigator as any).standalone;
      
      setIsStandalone(standalone || fullscreen || webApp);
      setIsInstalled(standalone || fullscreen || webApp);
    };

    checkInstallation();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        setShowPrompt(false);
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA: Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 xs:bottom-6 xs:left-6 xs:right-6"
      >
        <Card className="bg-gradient-to-r from-primary to-secondary text-white border-none shadow-lg">
          <div className="p-4 xs:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 xs:w-6 xs:h-6" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm xs:text-base mb-1">
                  Install Classroom App
                </h3>
                <p className="text-xs xs:text-sm opacity-90 mb-3">
                  Get quick access to your classroom with one tap. Works offline too!
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                  <span className="text-xs opacity-75">Native app experience</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-white text-primary hover:bg-white/90 flex-1 xs:flex-none"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                  
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

// PWA Status Component
export const PWAStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Don't render in non-PWA environments
  if (typeof window === 'undefined' || window.location.hostname.includes('edu')) {
    return null;
  }

  useEffect(() => {
    // Check installation status
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const fullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const webApp = (window.navigator as any).standalone;
    
    setIsInstalled(standalone || fullscreen || webApp);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
      
      {isInstalled && (
        <>
          <span>•</span>
          <span className="text-primary">PWA Installed</span>
        </>
      )}
      
      {updateAvailable && (
        <>
          <span>•</span>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            variant="ghost"
            className="h-auto p-0 text-xs text-accent hover:text-accent/80"
          >
            Update Available
          </Button>
        </>
      )}
    </div>
  );
};