import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  TrendingUp, TrendingDown, BarChart3, Calendar, Clock, 
  Users, Target, Award, AlertTriangle, CheckCircle2,
  ArrowUp, ArrowDown, Activity, Zap, BookOpen,
  Filter, Download, Share2, RefreshCw, Eye,
  PieChart, LineChart, BarChart, Layers
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MobilePageContent } from "../shared/MobilePageContent";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, Area, AreaChart } from "recharts";

interface MobileAttendanceAnalyticsProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface AttendanceData {
  month: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface StudentAttendanceRecord {
  studentId: string;
  studentName: string;
  present: number;
  absent: number;
  late: number;
  totalClasses: number;
  attendancePercentage: number;
}

interface SubjectAttendance {
  subject: string;
  totalClasses: number;
  students: StudentAttendanceRecord[];
  color: string;
  averageAttendance: number;
}

interface AttendanceInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const MobileAttendanceAnalytics: React.FC<MobileAttendanceAnalyticsProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  // Role-based data filtering
  const getFilteredData = (fullData: any) => {
    if (isStudent) {
      // Students only see their own attendance data
      return fullData.filter((record: any) => record.studentId === user?.id);
    }
    
    if (isTeacher) {
      // Teachers only see data from their assigned classes
      const teacherClasses = ['Math 101', 'Math 201', 'Physics 101']; // Mock teacher assignments
      return fullData.filter((record: any) => teacherClasses.includes(record.className));
    }
    
    // Admins see all data
    return fullData;
  };

  // Mock data with privacy boundaries
  const monthlyData: AttendanceData[] = [
    { month: 'Sep', present: 22, absent: 3, late: 2, percentage: 81.5 },
    { month: 'Oct', present: 25, absent: 2, late: 1, percentage: 89.3 },
    { month: 'Nov', present: 20, absent: 4, late: 3, percentage: 74.1 },
    { month: 'Dec', present: 18, absent: 2, late: 1, percentage: 85.7 },
    { month: 'Jan', present: 24, absent: 1, late: 2, percentage: 88.9 },
  ];

  const subjectData: SubjectAttendance[] = getFilteredData([
    {
      subject: 'Mathematics',
      totalClasses: 45,
      averageAttendance: 85.2,
      color: '#7C3AED',
      students: isStudent ? [] : [
        { studentId: '1', studentName: 'Alice Johnson', present: 38, absent: 5, late: 2, totalClasses: 45, attendancePercentage: 84.4 },
        { studentId: '2', studentName: 'Bob Smith', present: 40, absent: 3, late: 2, totalClasses: 45, attendancePercentage: 88.9 },
        { studentId: '3', studentName: 'Carol Davis', present: 35, absent: 7, late: 3, totalClasses: 45, attendancePercentage: 77.8 },
      ]
    },
    {
      subject: 'Physics',
      totalClasses: 40,
      averageAttendance: 78.5,
      color: '#0EA5E9',
      students: isStudent ? [] : [
        { studentId: '1', studentName: 'Alice Johnson', present: 32, absent: 6, late: 2, totalClasses: 40, attendancePercentage: 80.0 },
        { studentId: '2', studentName: 'Bob Smith', present: 35, absent: 3, late: 2, totalClasses: 40, attendancePercentage: 87.5 },
        { studentId: '4', studentName: 'David Wilson', present: 28, absent: 9, late: 3, totalClasses: 40, attendancePercentage: 70.0 },
      ]
    },
    {
      subject: 'English',
      totalClasses: 38,
      averageAttendance: 92.1,
      color: '#FB7185',
      students: isStudent ? [] : [
        { studentId: '1', studentName: 'Alice Johnson', present: 36, absent: 1, late: 1, totalClasses: 38, attendancePercentage: 94.7 },
        { studentId: '2', studentName: 'Bob Smith', present: 34, absent: 2, late: 2, totalClasses: 38, attendancePercentage: 89.5 },
        { studentId: '3', studentName: 'Carol Davis', present: 35, absent: 2, late: 1, totalClasses: 38, attendancePercentage: 92.1 },
      ]
    }
  ]);

  const attendanceInsights: AttendanceInsight[] = [
    {
      type: 'success',
      title: isStudent ? 'Excellent Attendance!' : 'Class Performance Strong',
      description: isStudent 
        ? 'Your attendance has improved by 12% this month' 
        : 'Average class attendance is above 85% target',
      icon: <CheckCircle2 className="h-4 w-4" />
    },
    {
      type: 'warning',
      title: isStudent ? 'Watch Your Absences' : 'Monitor At-Risk Students',
      description: isStudent 
        ? 'You have 3 absences this week in Physics' 
        : '4 students are below 75% attendance threshold',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      type: 'info',
      title: 'Attendance Trends',
      description: isStudent 
        ? 'Morning classes have better attendance than afternoon ones'
        : 'Friday attendance is consistently lower across all classes',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  const pieData = subjectData.map(subject => ({
    name: subject.subject,
    value: subject.averageAttendance,
    fill: subject.color
  }));

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const getInsightColor = (type: AttendanceInsight['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 text-green-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <MobilePageContent
      title="Attendance Analytics"
      showBack
      onBack={onBack}
      className="space-y-4"
      actions={
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshData}
          disabled={loading}
          className="p-2 w-9 h-9"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      }
    >
      {/* Period Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['week', 'month', 'semester'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {isStudent ? 'Your Rate' : 'Overall Rate'}
              </span>
            </div>
            <div className="text-2xl font-bold text-primary">87.3%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <span>+5.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">
                {isStudent ? 'Classes' : 'Active Students'}
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary">
              {isStudent ? '6' : '127'}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>{isStudent ? 'Enrolled' : 'This semester'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Attendance Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                {isStudent ? 'Your Attendance by Subject' : 'Attendance by Subject'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-4">
                {subjectData.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-sm font-medium">{subject.subject}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {subject.averageAttendance.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          {!isStudent && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {subjectData.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-xs text-muted-foreground">
                        {subject.students.length} students
                      </span>
                    </div>
                    <Progress value={subject.averageAttendance} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{subject.averageAttendance.toFixed(1)}% average</span>
                      <span>{subject.totalClasses} total classes</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          {/* Monthly Trend */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Monthly Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#7C3AED" 
                      strokeWidth={2}
                      dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Patterns */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Weekly Attendance Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                  const values = [92, 89, 87, 85, 78];
                  return (
                    <div key={day} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{day}</span>
                        <span className="font-medium">{values[index]}%</span>
                      </div>
                      <Progress value={values[index]} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          {/* AI Insights */}
          <div className="space-y-3">
            {attendanceInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {insight.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs opacity-90">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recommendations */}
          <Card className="border-0 bg-gradient-to-r from-accent/5 to-chart-4/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3 text-sm">
                {isStudent ? (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Focus on attending Physics classes to improve your overall rate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Your morning class attendance is excellent - keep it up!</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Consider setting reminders for Friday afternoon classes</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Implement attendance incentives for Friday classes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Contact parents of students below 75% attendance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Consider flexible makeup options for absent students</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MobilePageContent>
  );
};