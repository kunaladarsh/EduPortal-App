import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Area, AreaChart, Tooltip, Legend, RadialBarChart, RadialBar
} from 'recharts';
import {
  Users, Calendar, TrendingUp, TrendingDown, Clock, Target,
  Award, AlertCircle, CheckCircle, XCircle, BookOpen, Settings,
  Download, Filter, Search, ArrowLeft, ArrowRight, MoreVertical,
  PlayCircle, PauseCircle, SkipForward, RotateCcw, Send, Zap,
  Eye, EyeOff, Smartphone, Star, Coffee, Moon, Sun, Timer,
  Bell, Heart, Sparkles, Crown, Gift, Flame, Lightning,
  TrendingUpIcon, MapPin, Calendar as CalendarIcon, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { BeautifulAttendanceUI } from './BeautifulAttendanceUI';

interface ClassOverview {
  id: string;
  name: string;
  subject: string;
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  trend: 'up' | 'down' | 'stable';
  nextSession: string;
  location: string;
  color: string;
}

interface AttendanceInsight {
  type: 'achievement' | 'concern' | 'trend' | 'milestone';
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  action?: string;
}

interface WeeklyPattern {
  day: string;
  rate: number;
  students: number;
  target: number;
}

export const AttendanceMasterDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'take-attendance' | 'analytics' | 'settings'>('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data
  const [classOverviews] = useState<ClassOverview[]>([
    {
      id: 'math-101',
      name: 'Advanced Mathematics',
      subject: 'Calculus & Linear Algebra',
      totalStudents: 32,
      presentToday: 28,
      attendanceRate: 89.5,
      trend: 'up',
      nextSession: '10:00 AM',
      location: 'Room 204A',
      color: 'from-blue-500/20 to-cyan-500/10'
    },
    {
      id: 'physics-201',
      name: 'Physics Advanced',
      subject: 'Quantum Mechanics',
      totalStudents: 28,
      presentToday: 26,
      attendanceRate: 92.1,
      trend: 'stable',
      nextSession: '2:00 PM',
      location: 'Lab 301B',
      color: 'from-emerald-500/20 to-green-500/10'
    },
    {
      id: 'chem-150',
      name: 'Organic Chemistry',
      subject: 'Organic Compounds',
      totalStudents: 25,
      presentToday: 19,
      attendanceRate: 78.3,
      trend: 'down',
      nextSession: '11:30 AM',
      location: 'Lab 205C',
      color: 'from-amber-500/20 to-yellow-500/10'
    }
  ]);

  const [attendanceInsights] = useState<AttendanceInsight[]>([
    {
      type: 'achievement',
      title: 'Perfect Week!',
      description: 'Mathematics class achieved 100% attendance',
      value: '5 days',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-amber-500/20 to-yellow-500/10',
      action: 'Celebrate'
    },
    {
      type: 'milestone',
      title: 'Class Streak',
      description: 'Physics class maintained >90% for 2 weeks',
      value: '14 days',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-orange-500/20 to-red-500/10'
    },
    {
      type: 'concern',
      title: 'Attention Needed',
      description: 'Chemistry attendance dropped below target',
      value: '78%',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-red-500/20 to-pink-500/10',
      action: 'Review'
    },
    {
      type: 'trend',
      title: 'Improving',
      description: 'Overall attendance trending upward',
      value: '+5.2%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-emerald-500/20 to-green-500/10'
    }
  ]);

  const weeklyPattern: WeeklyPattern[] = [
    { day: 'Mon', rate: 92, students: 85, target: 85 },
    { day: 'Tue', rate: 88, students: 81, target: 85 },
    { day: 'Wed', rate: 91, students: 84, target: 85 },
    { day: 'Thu', rate: 87, students: 80, target: 85 },
    { day: 'Fri', rate: 82, students: 76, target: 85 },
    { day: 'Sat', rate: 94, students: 87, target: 85 },
    { day: 'Sun', rate: 96, students: 89, target: 85 }
  ];

  const monthlyTrend = [
    { month: 'Jan', rate: 82, improvement: 5 },
    { month: 'Feb', rate: 85, improvement: 3 },
    { month: 'Mar', rate: 88, improvement: 7 },
    { month: 'Apr', rate: 86, improvement: -2 },
    { month: 'May', rate: 91, improvement: 12 },
    { month: 'Jun', rate: 89, improvement: 8 }
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 432, color: '#10B981', percentage: 76 },
    { name: 'Late', value: 67, color: '#F59E0B', percentage: 12 },
    { name: 'Absent', value: 45, color: '#EF4444', percentage: 8 },
    { name: 'Excused', value: 23, color: '#6366F1', percentage: 4 }
  ];

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Computed values
  const overallStats = useMemo(() => {
    const totalStudents = classOverviews.reduce((sum, cls) => sum + cls.totalStudents, 0);
    const totalPresent = classOverviews.reduce((sum, cls) => sum + cls.presentToday, 0);
    const overallRate = totalStudents > 0 ? (totalPresent / totalStudents * 100) : 0;
    const averageRate = classOverviews.reduce((sum, cls) => sum + cls.attendanceRate, 0) / classOverviews.length;
    
    return {
      totalStudents,
      totalPresent,
      overallRate,
      averageRate,
      totalClasses: classOverviews.length,
      activeStreaks: 3
    };
  }, [classOverviews]);

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Attendance Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Live
          </Badge>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold text-primary">{overallStats.totalStudents}</p>
                <p className="text-xs text-primary/80">Total Students</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <p className="text-lg font-bold text-emerald-700">{overallStats.totalPresent}</p>
                <p className="text-xs text-emerald-600">Present Today</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold text-blue-700">{overallStats.averageRate.toFixed(1)}%</p>
                <p className="text-xs text-blue-600">Avg Rate</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Flame className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                <p className="text-lg font-bold text-amber-700">{overallStats.activeStreaks}</p>
                <p className="text-xs text-amber-600">Active Streaks</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderQuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="default"
          onClick={() => setCurrentView('take-attendance')}
          className="h-14 gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <PlayCircle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium text-sm">Take Attendance</div>
            <div className="text-xs opacity-90">Start new session</div>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setCurrentView('analytics')}
          className="h-14 gap-3 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20 hover:bg-blue-500/10"
        >
          <BarChart className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium text-sm">View Analytics</div>
            <div className="text-xs text-muted-foreground">Reports & insights</div>
          </div>
        </Button>
      </div>
    </motion.div>
  );

  const renderClassOverviews = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Today's Classes</h2>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {classOverviews.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className={`bg-gradient-to-r ${cls.color} border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => {
                    setSelectedClass(cls.id);
                    setCurrentView('take-attendance');
                  }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-white/50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{cls.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{cls.subject}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{cls.presentToday}/{cls.totalStudents}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{cls.nextSession}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{cls.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`
                        ${cls.trend === 'up' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 
                          cls.trend === 'down' ? 'bg-red-500/10 text-red-700 border-red-500/20' : 
                          'bg-blue-500/10 text-blue-700 border-blue-500/20'} text-xs
                      `}>
                        {cls.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                         cls.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
                         <Target className="w-3 h-3 mr-1" />}
                        {cls.attendanceRate.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                    >
                      Take Attendance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderInsightsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold mb-3">Insights & Alerts</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        {attendanceInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className={`bg-gradient-to-r ${insight.color} border-border/50 hover:shadow-sm transition-all duration-200`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/50 rounded-lg shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {insight.value}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    {insight.action && (
                      <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderAnalyticsPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Analytics Preview</h2>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-24 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="term">Term</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        {/* Weekly Pattern Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Weekly Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPattern}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="rate" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="target" fill="var(--muted)" radius={[2, 2, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={45}
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}`, 'Students']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
              {attendanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      {renderHeader()}
      {renderQuickActions()}
      {renderClassOverviews()}
      {renderInsightsCards()}
      {renderAnalyticsPreview()}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-accent/5">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && renderDashboard()}
        
        {currentView === 'take-attendance' && (
          <BeautifulAttendanceUI key="take-attendance" />
        )}
        
        {currentView === 'analytics' && (
          <div className="p-4">
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed attendance analytics and reports coming soon
                </p>
                <Button variant="outline" size="sm" onClick={() => setCurrentView('dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50"
      >
        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="dashboard" className="flex flex-col gap-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="take-attendance" className="flex flex-col gap-1">
              <PlayCircle className="w-4 h-4" />
              <span className="text-xs">Take</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-1">
              <BarChart className="w-4 h-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
    </div>
  );
};