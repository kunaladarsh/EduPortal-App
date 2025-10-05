import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  Target,
  Award,
  Activity,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Import centralized data service
import { getDashboardStats } from "../../services/mockData";

interface UsageMetrics {
  totalUsers: number;
  activeUsers: number;
  totalClasses: number;
  totalAssignments: number;
  attendanceRate: number;
  engagementScore: number;
  averageGrade: number;
  completionRate: number;
}

interface ActivityData {
  date: string;
  logins: number;
  assignments: number;
  attendance: number;
  messages: number;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  growth: number;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use centralized data service
  const [metrics, setMetrics] = useState<UsageMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalClasses: 0,
    totalAssignments: 0,
    attendanceRate: 0,
    engagementScore: 0,
    averageGrade: 0,
    completionRate: 0
  });

  // Load data from centralized service
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardStats = await getDashboardStats(user?.role || 'admin', user?.id);
      
      // Transform dashboard stats to analytics metrics
      setMetrics({
        totalUsers: dashboardStats.totalStudents + dashboardStats.totalTeachers,
        activeUsers: Math.floor((dashboardStats.totalStudents + dashboardStats.totalTeachers) * 0.8),
        totalClasses: dashboardStats.totalClasses,
        totalAssignments: dashboardStats.pendingAssignments * 4, // Estimate total
        attendanceRate: dashboardStats.attendanceRate,
        engagementScore: dashboardStats.averageGrade / 10,
        averageGrade: dashboardStats.averageGrade,
        completionRate: Math.min(dashboardStats.attendanceRate + 5, 100)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [user, timeRange]);

  // Generate sample activity data based on real metrics
  const activityData: ActivityData[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      logins: Math.floor(Math.random() * 100) + metrics.activeUsers / 7,
      assignments: Math.floor(Math.random() * 20) + 10,
      attendance: Math.floor(Math.random() * 30) + metrics.attendanceRate,
      messages: Math.floor(Math.random() * 50) + 20
    };
  });

  const featureUsageData: FeatureUsage[] = [
    { feature: 'Attendance', usage: metrics.attendanceRate, growth: 12, color: '#3B82F6' },
    { feature: 'Grades', usage: 78, growth: -2, color: '#10B981' },
    { feature: 'Messages', usage: 65, growth: 8, color: '#F59E0B' },
    { feature: 'Calendar', usage: 72, growth: 15, color: '#8B5CF6' },
    { feature: 'Library', usage: 45, growth: 5, color: '#EF4444' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Analytics</h3>
          <p className="text-muted-foreground">Gathering insights from your data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Insights and metrics for your school management system
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalyticsData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border rounded-lg bg-background text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Total Users', 
            value: metrics.totalUsers, 
            icon: Users, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            title: 'Active Classes', 
            value: metrics.totalClasses, 
            icon: BookOpen, 
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          { 
            title: 'Attendance Rate', 
            value: `${metrics.attendanceRate}%`, 
            icon: Clock, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          { 
            title: 'Average Grade', 
            value: `${metrics.averageGrade}%`, 
            icon: Award, 
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="logins" 
                    stackId="1"
                    stroke="var(--chart-1)" 
                    fill="var(--chart-1)" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="assignments" 
                    stackId="1"
                    stroke="var(--chart-2)" 
                    fill="var(--chart-2)" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completion Rate</span>
                    <Badge variant="outline">{metrics.completionRate}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Engagement Score</span>
                    <Badge variant="outline">{metrics.engagementScore}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Users</span>
                    <Badge variant="outline">{metrics.activeUsers}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureUsageData.map((feature) => (
                    <div key={feature.feature} className="flex items-center justify-between">
                      <span className="text-sm">{feature.feature}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{feature.usage}%</span>
                        <div className={`flex items-center text-xs ${
                          feature.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {feature.growth > 0 ? '+' : ''}{feature.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;