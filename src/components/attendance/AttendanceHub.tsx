import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatures } from '../../contexts/FeatureContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Eye,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Timer,
  BookOpen,
  GraduationCap,
  Activity,
  Target,
  Zap,
  Award,
  Filter,
  Search,
  Download,
  History,
  CalendarDays,
} from 'lucide-react';

interface AttendanceHubProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface AttendanceSession {
  id: string;
  className: string;
  subject: string;
  time: string;
  date: string;
  studentsTotal: number;
  studentsPresent: number;
  studentsAbsent: number;
  studentsLate: number;
  status: 'not-started' | 'in-progress' | 'completed';
  teacher: string;
}

interface AttendanceStats {
  todayPresent: number;
  todayTotal: number;
  weeklyAverage: number;
  monthlyTrend: number;
  totalClasses: number;
  activeClasses: number;
}

export const AttendanceHub: React.FC<AttendanceHubProps> = ({
  onPageChange,
  onBack,
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual data fetching
  const stats: AttendanceStats = {
    todayPresent: 234,
    todayTotal: 267,
    weeklyAverage: 87.5,
    monthlyTrend: 2.3,
    totalClasses: 12,
    activeClasses: 8,
  };

  const summaryData = {
    totalPresent: 1847,
    totalAbsent: 253,
    totalLate: 89,
    totalStudents: 2189,
    presentPercentage: 84.4,
    absentPercentage: 11.6,
    latePercentage: 4.1,
  };

  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'phy201', name: 'Physics 201' },
    { id: 'chem301', name: 'Chemistry 301' },
    { id: 'bio102', name: 'Biology 102' },
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'science', name: 'Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'arts', name: 'Arts' },
  ];

  const todaysSessions: AttendanceSession[] = [
    {
      id: '1',
      className: 'Mathematics 101',
      subject: 'Algebra',
      time: '09:00 AM',
      date: new Date().toISOString().split('T')[0],
      studentsTotal: 28,
      studentsPresent: 26,
      studentsAbsent: 2,
      studentsLate: 0,
      status: 'completed',
      teacher: user?.role === 'teacher' ? user.name : 'Dr. Sarah Johnson',
    },
    {
      id: '2',
      className: 'Physics 201',
      subject: 'Mechanics',
      time: '11:30 AM',
      date: new Date().toISOString().split('T')[0],
      studentsTotal: 32,
      studentsPresent: 30,
      studentsAbsent: 1,
      studentsLate: 1,
      status: 'in-progress',
      teacher: user?.role === 'teacher' ? user.name : 'Prof. Mike Chen',
    },
    {
      id: '3',
      className: 'Chemistry 301',
      subject: 'Organic Chemistry',
      time: '02:00 PM',
      date: new Date().toISOString().split('T')[0],
      studentsTotal: 25,
      studentsPresent: 0,
      studentsAbsent: 0,
      studentsLate: 0,
      status: 'not-started',
      teacher: user?.role === 'teacher' ? user.name : 'Dr. Lisa Wang',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'not-started':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Timer className="w-4 h-4" />;
      case 'not-started':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const attendancePercentage = (stats.todayPresent / stats.todayTotal) * 100;

  const quickActions = [
    {
      id: 'attendance-history',
      title: 'Attendance History',
      icon: <History className="w-5 h-5" />,
      gradient: 'from-secondary to-secondary/80',
      enabled: true,
      action: () => onPageChange('attendance-history'),
    },
    {
      id: 'calendar-view',
      title: 'Calendar View',
      icon: <CalendarDays className="w-5 h-5" />,
      gradient: 'from-accent to-accent/80',
      enabled: true,
      action: () => onPageChange('attendance-calendar'),
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: 'from-chart-4 to-chart-4/80',
      enabled: user?.role !== 'student',
      action: () => onPageChange('attendance-analytics'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      gradient: 'from-chart-5 to-chart-5/80',
      enabled: user?.role === 'admin',
      action: () => onPageChange('attendance-settings'),
    },
  ];

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
            <div>
              <h1 className="text-xl font-semibold">Attendance Hub</h1>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'student' ? 'View your attendance' : 'Manage class attendance'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setActiveView('overview')}>
            <Target className="w-4 h-4" />
          </Button>
          {user?.role !== 'student' && (
            <Button variant="ghost" size="sm" onClick={() => onPageChange('take-attendance')}>
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Summary Widgets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Total Present */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Present</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{summaryData.totalPresent}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {summaryData.presentPercentage}% of total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Absent */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Absent</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">{summaryData.totalAbsent}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {summaryData.absentPercentage}% of total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Late */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Late</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{summaryData.totalLate}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {summaryData.latePercentage}% of total
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Attendance Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-card via-card/90 to-primary/5 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Today's Attendance
              </span>
              <Badge variant="outline" className="text-sm">
                {attendancePercentage.toFixed(1)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{stats.todayPresent} of {stats.todayTotal} students</span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">{stats.todayPresent}</span>
                </div>
                <p className="text-xs text-green-600">Present</p>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <UserX className="w-4 h-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">{stats.todayTotal - stats.todayPresent}</span>
                </div>
                <p className="text-xs text-red-600">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mark Attendance Action */}
      {user?.role !== 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 border-primary/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mark Attendance</h3>
                  <p className="text-primary-foreground/80">
                    Take attendance for your classes and track student presence
                  </p>
                </div>
                <Button 
                  onClick={() => onPageChange('mark-attendance')}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Mark Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions
            .filter(action => action.enabled)
            .map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-card to-card/50 border-border/50"
                  onClick={action.action}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center text-white`}>
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Today's Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Sessions</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onPageChange('attendance-sessions')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {todaysSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="bg-gradient-to-r from-card via-card/95 to-card/90 border-border/50 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{session.className}</h3>
                        <p className="text-sm text-muted-foreground">{session.subject} • {session.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {session.studentsPresent}/{session.studentsTotal}
                        </p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <Badge className={`${getStatusColor(session.status)} border`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                  </div>

                  {session.status !== 'not-started' && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {session.studentsPresent} Present
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {session.studentsAbsent} Absent
                        </span>
                        {session.studentsLate > 0 && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-3 h-3" />
                            {session.studentsLate} Late
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Actions */}
      {user?.role !== 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 pt-4"
        >
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={() => onPageChange('take-attendance')}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Take Attendance
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onPageChange('attendance-reports')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </motion.div>
      )}
    </div>
  );
};