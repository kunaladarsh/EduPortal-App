import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar } from '../ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Target,
  Award,
  Activity,
  ArrowLeft,
  Download,
  Eye,
  User,
  GraduationCap,
  Users,
} from 'lucide-react';

interface StudentAttendanceHubProps {
  onBack: () => void;
  studentId?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  subject: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  teacher: string;
  time: string;
}

interface SubjectAttendance {
  subject: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  trend: number;
}

interface AttendanceStats {
  overall: number;
  thisWeek: number;
  thisMonth: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  lateClasses: number;
}

export const StudentAttendanceHub: React.FC<StudentAttendanceHubProps> = ({
  onBack,
  studentId,
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
  const [showCalendar, setShowCalendar] = useState(false);

  // Mock data - replace with actual data fetching
  const stats: AttendanceStats = {
    overall: 87.3,
    thisWeek: 85.0,
    thisMonth: 89.2,
    totalClasses: 120,
    attendedClasses: 105,
    missedClasses: 12,
    lateClasses: 3,
  };

  const weeklyData = [
    { week: 'Week 1', attendance: 90 },
    { week: 'Week 2', attendance: 85 },
    { week: 'Week 3', attendance: 88 },
    { week: 'Week 4', attendance: 92 },
    { week: 'Week 5', attendance: 87 },
  ];

  const subjectAttendance: SubjectAttendance[] = [
    {
      subject: 'Mathematics',
      className: 'Math 101',
      total: 24,
      present: 22,
      absent: 2,
      late: 0,
      percentage: 91.7,
      trend: 2.3,
    },
    {
      subject: 'Physics',
      className: 'Physics 201',
      total: 20,
      present: 17,
      absent: 2,
      late: 1,
      percentage: 85.0,
      trend: -1.5,
    },
    {
      subject: 'Chemistry',
      className: 'Chem 301',
      total: 22,
      present: 20,
      absent: 1,
      late: 1,
      percentage: 90.9,
      trend: 3.1,
    },
    {
      subject: 'English',
      className: 'English 201',
      total: 18,
      present: 15,
      absent: 3,
      late: 0,
      percentage: 83.3,
      trend: -2.1,
    },
  ];

  const recentAttendance: AttendanceRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      className: 'Mathematics 101',
      subject: 'Math',
      status: 'present',
      teacher: 'Dr. Johnson',
      time: '09:00 AM',
    },
    {
      id: '2',
      date: '2024-01-15',
      className: 'Physics 201',
      subject: 'Physics',
      status: 'late',
      teacher: 'Prof. Smith',
      time: '11:00 AM',
    },
    {
      id: '3',
      date: '2024-01-14',
      className: 'Chemistry 301',
      subject: 'Chemistry',
      status: 'present',
      teacher: 'Dr. Wilson',
      time: '02:00 PM',
    },
    {
      id: '4',
      date: '2024-01-14',
      className: 'English 201',
      subject: 'English',
      status: 'absent',
      teacher: 'Ms. Brown',
      time: '10:00 AM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'absent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'late':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'excused':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getAttendanceGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-orange-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const attendanceGrade = getAttendanceGrade(stats.overall);

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
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
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">My Attendance</h1>
              <p className="text-sm text-muted-foreground">
                Track your class attendance and progress
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowCalendar(!showCalendar)}>
            <CalendarIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Overall Stats */}
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
                <p className="text-2xl font-bold">{stats.overall}%</p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <Badge className={`${attendanceGrade.color} bg-transparent border-current`}>
                Grade: {attendanceGrade.grade}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.attendedClasses}</p>
                <p className="text-xs text-muted-foreground">Classes Attended</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                of {stats.totalClasses} total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.missedClasses}</p>
                <p className="text-xs text-muted-foreground">Classes Missed</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {((stats.missedClasses / stats.totalClasses) * 100).toFixed(1)}% missed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-chart-4/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.thisMonth}%</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-chart-4" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">+2.3% vs last month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Attendance Progress
              </span>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.overall}%</p>
                <p className="text-xs text-muted-foreground">Current Average</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{stats.attendedClasses} of {stats.totalClasses} classes</span>
              </div>
              <Progress value={stats.overall} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-600">{stats.attendedClasses}</div>
                <p className="text-xs text-green-600">Present</p>
              </div>
              
              <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-lg font-bold text-red-600">{stats.missedClasses}</div>
                <p className="text-xs text-red-600">Absent</p>
              </div>
              
              <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-bold text-orange-600">{stats.lateClasses}</div>
                <p className="text-xs text-orange-600">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-card via-card/95 to-secondary/5 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Weekly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="var(--chart-2)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject-wise Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-card via-card/95 to-accent/5 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjectAttendance.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-3 bg-card/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-xs text-muted-foreground">{subject.className}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{subject.percentage}%</span>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {subject.present}/{subject.total} classes
                      </p>
                    </div>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Attendance</h2>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentAttendance.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="bg-gradient-to-r from-card via-card/95 to-card/90 border-border/50 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{record.className}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.teacher} • {record.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{record.subject}</p>
                      </div>
                      <Badge className={`${getStatusColor(record.status)} border`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};