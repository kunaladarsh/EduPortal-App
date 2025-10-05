import React, { Suspense, lazy, useState, useEffect } from "react";
import { Button } from "../ui/button";

// Ultra-lightweight entry point for mobile app with reasonable timeout protection
const MobileAppMain = lazy(() => 
  Promise.race([
    import("./MobileAppMain").then(m => ({ default: m.MobileAppMain })),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Module load timeout')), 8000)
    )
  ]) as Promise<{ default: React.ComponentType<any> }>
);

interface MobileAppEntryProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  pageHistory: string[];
}

// Fast loading fallback with timeout detection
const QuickLoader: React.FC = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn("QuickLoader timeout after 5 seconds");
      setShowTimeout(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (showTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="font-semibold mb-2">Loading Timeout</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The app is taking longer than expected to load.
          </p>
          <Button onClick={() => window.location.reload()} size="sm">
            Refresh App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

// Error boundary for lazy loading failures
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Lazy load error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-semibold mb-2">Failed to Load</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to load the application. Please refresh.
            </p>
            <Button onClick={() => window.location.reload()} size="sm">
              Refresh App
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const MobileAppEntry: React.FC<MobileAppEntryProps> = ({ currentPage, onPageChange, pageHistory }) => {
  return (
    <LazyLoadErrorBoundary>
      <Suspense fallback={<QuickLoader />}>
        <MobileAppMain currentPage={currentPage} onPageChange={onPageChange} pageHistory={pageHistory} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};