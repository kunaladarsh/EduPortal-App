import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  FeatureProvider,
  useFeatures,
} from "./contexts/FeatureContext";
import {
  AppConfigProvider,
  useAppConfig,
} from "./contexts/AppConfigContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationProvider, useNavigation } from "./contexts/NavigationContext";
import { AuthPage } from "./components/auth/AuthPage";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";

// Lazy load components for production
import { MobileAppEntry } from "./components/shared/MobileAppEntry";
const PWAInstallPrompt = lazy(() => import("./components/pwa/PWAInstallPrompt").then(m => ({ default: m.PWAInstallPrompt })));
const AccessibilityEnhancements = lazy(() => import("./components/accessibility/AccessibilityEnhancements"));


// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
    // check the state
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
            <div className="text-center p-6 max-w-sm w-full">
              <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-xl xs:text-2xl">⚠️</span>
              </div>
              <h3 className="text-base xs:text-lg font-semibold mb-2">
                Something went wrong
              </h3>
              <p className="text-sm xs:text-base text-muted-foreground mb-4">
                Please refresh the app to try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full xs:w-auto"
                size="sm"
              >
                Refresh App
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Mobile-optimized loading fallback component with reasonable timeout
const LoadingFallback: React.FC<{
  message?: string;
  timeout?: number;
}> = ({ message = "Loading...", timeout = 8000 }) => {
  const [showError, setShowError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show progress indicator with controlled updates
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 15, 90);
        return newProgress;
      });
    }, 200);

    // Show error after timeout with cleanup
    const errorTimer = setTimeout(() => {
      console.warn(`LoadingFallback timeout after ${timeout}ms for: ${message}`);
      setShowError(true);
      clearInterval(progressTimer);
    }, timeout);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(errorTimer);
    };
  }, [timeout, message]);

  if (showError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
        <div className="text-center p-6 max-w-sm w-full">
          <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-xl xs:text-2xl">⚠️</span>
          </div>
          <h3 className="text-base xs:text-lg font-semibold mb-2">
            Loading Timeout
          </h3>
          <p className="text-sm xs:text-base text-muted-foreground mb-4">
            The app is taking longer than expected to load.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full xs:w-auto"
            size="sm"
          >
            Refresh App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <motion.div
        className="text-center max-w-sm w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-4 xs:mb-6">
          <div className="absolute inset-0 border-3 xs:border-4 border-primary/20 rounded-full"></div>
          <motion.div
            className="absolute inset-0 border-3 xs:border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        <p className="text-muted-foreground text-base xs:text-lg mb-2">
          {message}
        </p>
        <div className="w-full bg-muted rounded-full h-1.5">
          <motion.div
            className="bg-primary h-1.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const AppContent: React.FC = () => {
  // ========== ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY EARLY RETURNS ==========
  // Mobile-only app - no desktop detection needed
  const { user, isLoading: authLoading } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const { config: appConfig, isLoading: configLoading } = useAppConfig();
  const { currentPage, pageHistory, navigateTo } = useNavigation();
  const [pageTransition, setPageTransition] = useState(false);

  // Feature access is handled within MobileAppMain

  const handlePageChange = useCallback(
    (newPage: string) => {
      if (newPage !== currentPage && !pageTransition) {
        try {
          setPageTransition(true);
          
          // Reasonable timeout for page transitions
          const timeoutId = setTimeout(() => {
            console.warn(`Page transition timeout for ${newPage}, forcing completion`);
            setPageTransition(false);
          }, 2000);
          
          // Use requestAnimationFrame for smooth transitions
          requestAnimationFrame(() => {
            try {
              navigateTo(newPage);
              clearTimeout(timeoutId);
              setPageTransition(false);
            } catch (navError) {
              console.error("Navigation error:", navError);
              clearTimeout(timeoutId);
              setPageTransition(false);
            }
          });
        } catch (error) {
          console.error("Error changing page:", error);
          setPageTransition(false);
        }
      }
    },
    [currentPage, pageTransition, navigateTo],
  );

  // Memoized components - MUST be defined before early returns
  // Mobile-only app doesn't need these components as all logic is handled in MobileAppMain

  // Memoized page variants and wrapper - optimized for performance
  const pageVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    [],
  );

  const PageWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </motion.div>
    ),
    [currentPage, pageVariants],
  );

  // Mobile app initialization with reasonable safety timeouts
  useEffect(() => {
    if (!authLoading && !configLoading && user) {
      // App is ready - production mode
      console.log("App initialized successfully");
    }
    
    // Safety timeout to prevent stuck page transitions
    const pageTransitionTimeout = setTimeout(() => {
      if (pageTransition) {
        console.warn("Page transition stuck, forcing completion");
        setPageTransition(false);
      }
    }, 3000);
    
    return () => {
      clearTimeout(pageTransitionTimeout);
    };
  }, [authLoading, configLoading, user, pageTransition]);

  // ========== COMPUTED VALUES (NOT HOOKS) ==========
  const isLoading = authLoading || configLoading;

  // ========== EARLY RETURNS AFTER ALL HOOKS ==========
  if (isLoading) {
    return (
      <LoadingFallback
        message={
          configLoading
            ? "Initializing your classroom..."
            : "Loading your classroom..."
        }
        timeout={8000}
      />
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    // Mobile-only app - always use lightweight entry point
    // Wrap in try-catch to prevent render crashes
    try {
      return (
        <PageWrapper>
          <Suspense
            fallback={
              <LoadingFallback 
                message={`Loading ${currentPage} page...`}
                timeout={6000}
              />
            }
          >
            <MobileAppEntry
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageHistory={pageHistory}
            />
          </Suspense>
        </PageWrapper>
      );
    } catch (error) {
      console.error("Render error:", error);
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-semibold mb-2">Render Error</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to render the page. Please refresh.
            </p>
            <Button onClick={() => window.location.reload()} size="sm">
              Refresh App
            </Button>
          </div>
        </div>
      );
    }
  };

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 safe-area-top safe-area-bottom">
      <main className="overflow-hidden">
        <AnimatePresence 
          mode="wait" 
          initial={false} 
          onExitComplete={() => {
            setPageTransition(false);
            console.log("Page transition completed");
          }}
        >
          {renderPage()}
        </AnimatePresence>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [pwaReady, setPwaReady] = useState(false);

  // PWA and Mobile-first optimizations
  useEffect(() => {
    // Set PWA ready immediately to prevent blocking
    setPwaReady(true);

    // Register service worker asynchronously (non-blocking) - deferred
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost' && !window.location.hostname.includes('edu')) {
      // Defer service worker registration to not block initial load
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('PWA: Service Worker registered successfully:', registration.scope);
            })
            .catch(() => {
              console.log('PWA: Service Worker registration failed, continuing without PWA features');
            });
        });
      } else {
        setTimeout(() => {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }, 500);
      }
    }

    // Add PWA manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      manifestLink.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifestLink);
    }

    // Set mobile viewport meta tag if not already set
    let viewport = document.querySelector(
      'meta[name="viewport"]',
    );
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
    );

    // Add mobile web app capabilities
    let appleMobileCapable = document.querySelector(
      'meta[name="apple-mobile-web-app-capable"]',
    );
    if (!appleMobileCapable) {
      appleMobileCapable = document.createElement("meta");
      appleMobileCapable.setAttribute(
        "name",
        "apple-mobile-web-app-capable",
      );
      appleMobileCapable.setAttribute("content", "yes");
      document.head.appendChild(appleMobileCapable);
    }

    let appleStatusBarStyle = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    );
    if (!appleStatusBarStyle) {
      appleStatusBarStyle = document.createElement("meta");
      appleStatusBarStyle.setAttribute(
        "name",
        "apple-mobile-web-app-status-bar-style",
      );
      appleStatusBarStyle.setAttribute("content", "default");
      document.head.appendChild(appleStatusBarStyle);
    }

    // Add theme color meta tags
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      themeColor.setAttribute('content', '#3B82F6');
      document.head.appendChild(themeColor);
    }

    // Prevent selection on mobile
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.webkitTouchCallout = "none";

    // Add mobile-specific classes
    document.body.classList.add("mobile-app");

    // Performance optimization: Preload critical resources (deferred)
    const preloadCriticalResources = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const criticalUrls = [
            '/icons/icon-192x192.png',
            '/icons/icon-512x512.png'
          ];

          criticalUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'image';
            document.head.appendChild(link);
          });
        });
      }
    };

    preloadCriticalResources();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <FeatureProvider>
          <AppConfigProvider>
            <ThemeProvider>
              <NavigationProvider initialPage="dashboard">
                <AppContent />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "var(--card)",
                      color: "var(--card-foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "14px",
                      fontWeight: "500",
                      maxWidth: "320px",
                      margin: "8px",
                    },
                  }}
                />
                
                {/* PWA Components - Non-blocking with error boundary */}
                {pwaReady && (
                  <ErrorBoundary fallback={null}>
                    <Suspense fallback={null}>
                      <PWAInstallPrompt />
                    </Suspense>
                  </ErrorBoundary>
                )}
                
                {/* Accessibility Enhancements - Non-blocking */}
                <ErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <AccessibilityEnhancements />
                  </Suspense>
                </ErrorBoundary>
              </NavigationProvider>
            </ThemeProvider>
          </AppConfigProvider>
        </FeatureProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;