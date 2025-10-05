import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  WifiOff, 
  Activity,
  Gauge,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface PerformanceMetrics {
  fcpTime: number;
  lcpTime: number;
  clsScore: number;
  fidTime: number;
  memoryUsage: number;
  bundleSize: number;
  networkSpeed: string;
  isOnline: boolean;
  renderTime: number;
  componentCount: number;
}

interface VitalMetric {
  name: string;
  value: number;
  threshold: { good: number; poor: number };
  unit: string;
  icon: React.ReactNode;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // Core Web Vitals thresholds
  const vitalsConfig: { [key: string]: VitalMetric } = {
    fcp: {
      name: "First Contentful Paint",
      value: metrics?.fcpTime || 0,
      threshold: { good: 1800, poor: 3000 },
      unit: "ms",
      icon: <Zap className="w-4 h-4" />
    },
    lcp: {
      name: "Largest Contentful Paint", 
      value: metrics?.lcpTime || 0,
      threshold: { good: 2500, poor: 4000 },
      unit: "ms",
      icon: <Clock className="w-4 h-4" />
    },
    cls: {
      name: "Cumulative Layout Shift",
      value: metrics?.clsScore || 0,
      threshold: { good: 0.1, poor: 0.25 },
      unit: "",
      icon: <Activity className="w-4 h-4" />
    },
    fid: {
      name: "First Input Delay",
      value: metrics?.fidTime || 0,
      threshold: { good: 100, poor: 300 },
      unit: "ms",
      icon: <Gauge className="w-4 h-4" />
    }
  };

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return () => {}; // No-op cleanup function
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      let fcpTime = 0;
      let lcpTime = 0;
      let clsScore = 0;
      let fidTime = 0;

      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              fcpTime = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            lcpTime = entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
            break;
          case 'first-input':
            fidTime = (entry as any).processingStart - entry.startTime;
            break;
        }
      });

      // Get memory usage
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? 
        Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100) : 0;

      // Estimate bundle size (rough calculation)
      const bundleSize = Math.round(
        (document.querySelectorAll('script').length * 50 + 
         document.querySelectorAll('link[rel="stylesheet"]').length * 20) / 1024
      );

      // Get connection info
      const connection = (navigator as any).connection;
      const networkSpeed = connection ? connection.effectiveType : 'unknown';
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

      // Calculate render time
      const renderTime = typeof performance !== 'undefined' ? performance.now() : 0;

      // Count React components (rough estimation)
      const componentCount = document.querySelectorAll('[data-reactroot], [data-react-checksum]').length;

      setMetrics({
        fcpTime: Math.round(fcpTime),
        lcpTime: Math.round(lcpTime),
        clsScore: Math.round(clsScore * 1000) / 1000,
        fidTime: Math.round(fidTime),
        memoryUsage,
        bundleSize,
        networkSpeed,
        isOnline,
        renderTime: Math.round(renderTime),
        componentCount
      });
    });

    // Observe all performance metrics
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
      // Set some default metrics
      setMetrics({
        fcpTime: 0,
        lcpTime: 0,
        clsScore: 0,
        fidTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        networkSpeed: 'unknown',
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        renderTime: 0,
        componentCount: 0
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only show in development or when specifically enabled
    const shouldShow = (process.env.NODE_ENV === 'development' || 
                       (typeof localStorage !== 'undefined' && localStorage.getItem('show-performance-monitor') === 'true')) &&
                       typeof window !== 'undefined' && 
                       !window.location.hostname.includes('edu');
    
    if (shouldShow) {
      setIsVisible(true);
      const cleanup = measurePerformance();
      
      // Update metrics periodically
      const interval = setInterval(() => {
        setRenderCount(prev => prev + 1);
        measurePerformance();
      }, 5000);

      return () => {
        cleanup();
        clearInterval(interval);
      };
    }
  }, [measurePerformance]);

  const getVitalStatus = (metric: VitalMetric) => {
    if (metric.value <= metric.threshold.good) return 'good';
    if (metric.value <= metric.threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'good': return 'default';
      case 'needs-improvement': return 'secondary';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  if (!isVisible || !metrics) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-20 right-4 z-40 max-w-sm"
      >
        <Card className="bg-card/95 backdrop-blur-sm border-2">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Performance</span>
                <div className={`w-2 h-2 rounded-full ${metrics.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? 
                    <ChevronUp className="w-3 h-3" /> : 
                    <ChevronDown className="w-3 h-3" />
                  }
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Quick Status */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {metrics.networkSpeed.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {metrics.memoryUsage}% RAM
              </Badge>
              <Badge variant="outline" className="text-xs">
                {metrics.bundleSize}KB
              </Badge>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Core Web Vitals */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground">Core Web Vitals</h4>
                    {Object.entries(vitalsConfig).map(([key, vital]) => {
                      const status = getVitalStatus(vital);
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {vital.icon}
                            <span className="text-xs">{vital.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono">
                              {vital.value}{vital.unit}
                            </span>
                            <Badge 
                              variant={getStatusBadgeVariant(status)}
                              className="text-xs px-1 py-0"
                            >
                              {status === 'good' ? '✓' : status === 'needs-improvement' ? '!' : '✗'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Memory Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Memory Usage</span>
                      <span className="text-xs font-mono">{metrics.memoryUsage}%</span>
                    </div>
                    <Progress value={metrics.memoryUsage} className="h-1" />
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      <span>Components: {metrics.componentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Render: {metrics.renderTime}ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {metrics.isOnline ? 
                        <Wifi className="w-3 h-3" /> : 
                        <WifiOff className="w-3 h-3" />
                      }
                      <span>{metrics.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Renders: {renderCount}</span>
                    </div>
                  </div>

                  {/* Performance Score */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Performance Score</span>
                      <div className="flex items-center gap-1">
                        {Object.values(vitalsConfig).map((vital, index) => {
                          const status = getVitalStatus(vital);
                          return (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceMonitor;