import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Award,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Eye,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface AttendanceAnalyticsHubProps {
  onBack: () => void;
  onPageChange?: (page: string) => void;
}

interface AttendanceMetrics {
  totalStudents: number;
  averageAttendance: number;
  presentToday: number;
  absentToday: number;
  weeklyTrend: number;
  monthlyTrend: number;
  highestAttendance: number;
  lowestAttendance: number;
}

interface ClassAttendance {
  className: string;
  subject: string;
  attendance: number;
  total: number;
  trend: number;
}

interface StudentPerformance {
  id: string;
  name: string;
  attendance: number;
  trend: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export const AttendanceAnalyticsHub: React.FC<AttendanceAnalyticsHubProps> = ({
  onBack,
  onPageChange,
}) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual data fetching
  const metrics: AttendanceMetrics = {
    totalStudents: 156,
    averageAttendance: 87.3,
    presentToday: 142,
    absentToday: 14,
    weeklyTrend: 2.1,
    monthlyTrend: -0.8,
    highestAttendance: 96.5,
    lowestAttendance: 72.1,
  };

  const dailyAttendanceData = [
    { day: 'Mon', present: 142, absent: 14, late: 8 },
    { day: 'Tue', present: 138, absent: 18, late: 6 },
    { day: 'Wed', present: 145, absent: 11, late: 4 },
    { day: 'Thu', present: 140, absent: 16, late: 7 },
    { day: 'Fri', present: 139, absent: 17, late: 5 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', attendance: 85.2 },
    { month: 'Feb', attendance: 87.1 },
    { month: 'Mar', attendance: 89.3 },
    { month: 'Apr', attendance: 86.7 },
    { month: 'May', attendance: 88.9 },
    { month: 'Jun', attendance: 87.3 },
  ];

  const classAttendanceData: ClassAttendance[] = [
    { className: 'Mathematics 101', subject: 'Math', attendance: 89.2, total: 32, trend: 2.1 },
    { className: 'Physics 201', subject: 'Physics', attendance: 86.5, total: 28, trend: -1.2 },
    { className: 'Chemistry 301', subject: 'Chemistry', attendance: 91.3, total: 25, trend: 3.4 },
    { className: 'Biology 102', subject: 'Biology', attendance: 84.7, total: 30, trend: -0.8 },
    { className: 'English 201', subject: 'English', attendance: 88.9, total: 35, trend: 1.5 },
  ];

  const attendanceDistribution = [
    { name: 'Excellent (90-100%)', value: 45, color: '#10B981' },
    { name: 'Good (80-89%)', value: 38, color: '#3B82F6' },
    { name: 'Average (70-79%)', value: 25, color: '#F59E0B' },
    { name: 'Poor (<70%)', value: 12, color: '#EF4444' },
  ];

  const topPerformers: StudentPerformance[] = [
    { id: '1', name: 'Alice Johnson', attendance: 98.5, trend: 1.2, status: 'excellent' },
    { id: '2', name: 'Bob Smith', attendance: 96.8, trend: 0.8, status: 'excellent' },
    { id: '3', name: 'Carol Williams', attendance: 95.2, trend: 2.1, status: 'excellent' },
  ];

  const lowPerformers: StudentPerformance[] = [
    { id: '4', name: 'David Brown', attendance: 65.3, trend: -2.1, status: 'poor' },
    { id: '5', name: 'Eva Davis', attendance: 68.7, trend: -1.5, status: 'poor' },
    { id: '6', name: 'Frank Miller', attendance: 72.1, trend: -0.8, status: 'average' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'good':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'average':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'poor':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Attendance Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Insights and trends for {user?.role === 'admin' ? 'all classes' : 'your classes'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">Semester</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.averageAttendance}%</p>
                <p className="text-xs text-muted-foreground">Average Attendance</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon(metrics.weeklyTrend)}
              <span className={`text-xs ${metrics.weeklyTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(metrics.weeklyTrend)}% vs last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.presentToday}</p>
                <p className="text-xs text-muted-foreground">Present Today</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                of {metrics.totalStudents} students
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.highestAttendance}%</p>
                <p className="text-xs text-muted-foreground">Highest Class</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">Chemistry 301</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-chart-4/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.lowestAttendance}%</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-xs text-red-600">Biology 102</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Attendance Chart */}
              <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Daily Attendance (This Week)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyAttendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="present" fill="var(--chart-1)" radius={4} />
                      <Bar dataKey="absent" fill="var(--chart-3)" radius={4} />
                      <Bar dataKey="late" fill="var(--chart-5)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance Distribution */}
              <Card className="bg-gradient-to-br from-card via-card/95 to-secondary/5 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-secondary" />
                    Attendance Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={attendanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${value}%`}
                      >
                        {attendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-gradient-to-br from-card via-card/95 to-accent/5 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Monthly Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="var(--primary)" 
                      fill="var(--primary)" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Class Performance</h3>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>

              <div className="space-y-3">
                {classAttendanceData.map((classData, index) => (
                  <motion.div
                    key={classData.className}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-card via-card/95 to-card/90 border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{classData.className}</h4>
                              <p className="text-sm text-muted-foreground">
                                {classData.subject} • {classData.total} students
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold">{classData.attendance}%</p>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(classData.trend)}
                                <span className={`text-xs ${classData.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {Math.abs(classData.trend)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-16">
                              <Progress value={classData.attendance} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card className="bg-gradient-to-br from-card via-card/95 to-green-500/5 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topPerformers.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-sm font-bold text-green-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">+{student.trend}%</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        {student.attendance}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Low Performers */}
              <Card className="bg-gradient-to-br from-card via-card/95 to-red-500/5 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lowPerformers.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="w-3 h-3 text-red-600" />
                            <span className="text-xs text-red-600">{student.trend}%</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(student.status)}>
                        {student.attendance}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};