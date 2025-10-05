import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  isLoading: boolean;
}

export class MobileLoadingBoundary extends Component<Props, State> {
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isLoading: true };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('MobileLoadingBoundary caught an error:', error);
    return { hasError: true, isLoading: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MobileLoadingBoundary error details:', error, errorInfo);
  }

  componentDidMount() {
    // Set a timeout to prevent infinite loading
    this.timeoutId = setTimeout(() => {
      if (this.state.isLoading) {
        this.setState({ hasError: true, isLoading: false });
      }
    }, 5000); // 5 second timeout

    // Simulate successful loading after a short delay
    setTimeout(() => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.setState({ isLoading: false });
    }, 100);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, isLoading: true });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    // Reset the timeout
    this.timeoutId = setTimeout(() => {
      if (this.state.isLoading) {
        this.setState({ hasError: true, isLoading: false });
      }
    }, 5000);

    setTimeout(() => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.setState({ isLoading: false });
    }, 100);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
          <Card className="w-full max-w-sm mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="font-semibold mb-2">Loading Dashboard</h3>
              <p className="text-muted-foreground text-sm">Please wait...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-6">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="font-semibold mb-2">Something went wrong</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We're having trouble loading your dashboard. Please try again.
              </p>
              <Button onClick={this.handleRetry} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default MobileLoadingBoundary;