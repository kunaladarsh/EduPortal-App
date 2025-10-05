import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Area, AreaChart, Tooltip, Legend
} from 'recharts';
import {
  Users, Calendar, TrendingUp, TrendingDown, Clock, Target,
  Award, AlertCircle, CheckCircle, XCircle, BookOpen, Settings,
  Download, Filter, Search, ArrowLeft, ArrowRight, MoreVertical,
  PlayCircle, PauseCircle, SkipForward, RotateCcw, Send, Zap,
  Eye, EyeOff, Smartphone, Star, Coffee, Moon, Sun
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
import { OptimizedAttendanceSystem } from './OptimizedAttendanceSystem';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  totalStudents: number;
  averageAttendance: number;
  trend: 'up' | 'down' | 'stable';
  recentSessions: number;
  nextSession?: string;
}

interface AttendanceStats {
  totalClasses: number;
  averageAttendance: number;
  perfectAttendanceDays: number; 
  improvementRate: number;
  peakAttendanceTime: string;
  lowestAttendanceDay: string;
}

interface StudentInsight {
  id: string;
  name: string;
  attendanceRate: number;
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  lastSeen: string;
  streak: number;
  totalClasses: number;
  insights: string[];
}

export const AttendanceDashboardPro: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'take-attendance' | 'insights' | 'reports'>('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsView, setShowDetailsView] = useState(false);

  // Mock data
  const [classes] = useState<ClassData[]>([
    {
      id: 'math-101',
      name: 'Advanced Mathematics',
      subject: 'Calculus & Linear Algebra',
      totalStudents: 32,
      averageAttendance: 89.5,
      trend: 'up',
      recentSessions: 15,
      nextSession: '10:00 AM Tomorrow'
    },
    {
      id: 'physics-201', 
      name: 'Physics Advanced',
      subject: 'Quantum Mechanics',
      totalStudents: 28,
      averageAttendance: 92.1,
      trend: 'stable',
      recentSessions: 12,
      nextSession: '2:00 PM Today'
    },
    {
      id: 'chem-150',
      name: 'Organic Chemistry',
      subject: 'Organic Compounds',
      totalStudents: 25,
      averageAttendance: 78.3,
      trend: 'down',
      recentSessions: 18,
      nextSession: '11:30 AM Tomorrow'
    }
  ]);

  const [overallStats] = useState<AttendanceStats>({
    totalClasses: 145,
    averageAttendance: 86.3,
    perfectAttendanceDays: 23,
    improvementRate: 12.5,
    peakAttendanceTime: '10:00 AM',
    lowestAttendanceDay: 'Friday'
  });

  const [studentInsights] = useState<StudentInsight[]>([
    {
      id: '1',
      name: 'Emma Thompson',
      attendanceRate: 95.2,
      trend: 'stable',
      riskLevel: 'low',
      lastSeen: '2 hours ago',
      streak: 15,
      totalClasses: 42,
      insights: ['Consistent performer', 'Perfect morning attendance']
    },
    {
      id: '2',
      name: 'Liam Rodriguez',
      attendanceRate: 73.5,
      trend: 'improving',
      riskLevel: 'medium',
      lastSeen: '1 day ago',
      streak: 3,
      totalClasses: 38,
      insights: ['Recent improvement', 'Responds well to engagement']
    },
    {
      id: '3',
      name: 'Isabella Martinez',
      attendanceRate: 62.1,
      trend: 'declining',
      riskLevel: 'high',
      lastSeen: '3 days ago',
      streak: 0,
      totalClasses: 35,
      insights: ['Needs immediate attention', 'Pattern of Friday absences']
    }
  ]);

  // Mock chart data
  const weeklyAttendanceData = [
    { day: 'Mon', attendance: 92, target: 85 },
    { day: 'Tue', attendance: 88, target: 85 },
    { day: 'Wed', attendance: 91, target: 85 },
    { day: 'Thu', attendance: 85, target: 85 },
    { day: 'Fri', attendance: 79, target: 85 },
    { day: 'Sat', attendance: 94, target: 85 },
    { day: 'Sun', attendance: 96, target: 85 }
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 432, color: '#10B981' },
    { name: 'Late', value: 67, color: '#F59E0B' },
    { name: 'Absent', value: 45, color: '#EF4444' },
    { name: 'Excused', value: 23, color: '#6366F1' }
  ];

  const monthlyTrend = [
    { month: 'Jan', attendance: 82 },
    { month: 'Feb', attendance: 85 },
    { month: 'Mar', attendance: 88 },
    { month: 'Apr', attendance: 86 },
    { month: 'May', attendance: 91 },
    { month: 'Jun', attendance: 89 }
  ];

  const filteredClasses = useMemo(() => {
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  const renderQuickStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3 mb-6"
    >
      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Rate</p>
              <p className="text-2xl font-bold text-green-700">
                {overallStats.averageAttendance}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+{overallStats.improvementRate}%</span>
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold text-blue-700">
                {overallStats.totalClasses}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600">This semester</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderClassCards = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Active Classes</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('take-attendance')}
          className="h-8 px-3"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>

      {filteredClasses.map((cls) => (
        <Card key={cls.id} className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base mb-1">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{cls.subject}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{cls.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{cls.nextSession}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`
                    ${cls.trend === 'up' ? 'bg-green-500/10 text-green-700' : 
                      cls.trend === 'down' ? 'bg-red-500/10 text-red-700' : 
                      'bg-blue-500/10 text-blue-700'} text-xs
                  `}>
                    {cls.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                     cls.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
                     <Target className="w-3 h-3 mr-1" />}
                    {cls.averageAttendance}%
                  </Badge>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedClass(cls.id);
                    setCurrentView('take-attendance');
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Take Attendance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );

  const renderAnalyticsCharts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mb-6"
    >
      {/* Weekly Attendance Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Weekly Attendance Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAttendanceData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="var(--muted)" radius={[4, 4, 0, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Distribution */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="var(--primary)" 
                    fill="var(--primary)" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderStudentInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Student Insights</h2>
        <Button variant="outline" size="sm" className="h-8 px-3">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      {studentInsights.map((student) => (
        <Card key={student.id} className="hover:shadow-sm transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{student.name}</h3>
                  <Badge className={`
                    ${student.riskLevel === 'low' ? 'bg-green-500/10 text-green-700' :
                      student.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-700' :
                      'bg-red-500/10 text-red-700'} text-xs px-2 py-0.5
                  `}>
                    {student.riskLevel} risk
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span>{student.attendanceRate}% attendance</span>
                  <span>•</span>
                  <span>{student.streak} day streak</span>
                  <span>•</span>
                  <span>Last seen {student.lastSeen}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {student.insights.slice(0, 2).map((insight, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {student.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {student.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                {student.trend === 'stable' && <Target className="w-4 h-4 text-blue-600" />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      <div>
        <h1 className="text-xl font-bold">Attendance Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive attendance management & insights
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 px-3">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );

  const renderTabNavigation = () => (
    <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)} className="mb-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
        <TabsTrigger value="take-attendance" className="text-xs">Take</TabsTrigger>
        <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
        <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9"
        />
      </div>
      
      <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
        <SelectTrigger className="w-24 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">7 days</SelectItem>
          <SelectItem value="30d">30 days</SelectItem>
          <SelectItem value="90d">90 days</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === 'take-attendance' ? (
          <OptimizedAttendanceSystem
            key="take-attendance"
            onBack={() => setCurrentView('dashboard')}
            onComplete={() => {
              toast.success('Attendance submitted successfully!');
              setCurrentView('dashboard');
            }}
          />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            {renderHeader()}
            {renderTabNavigation()}
            
            <TabsContent value="dashboard" className="mt-0">
              {renderControls()}
              {renderQuickStats()}
              {renderClassCards()}
              {renderAnalyticsCharts()}
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0">
              {renderControls()}
              {renderStudentInsights()}
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Advanced Reports</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed analytics and downloadable reports coming soon
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Request Beta Access
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};