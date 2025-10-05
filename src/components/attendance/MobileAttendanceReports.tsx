import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  FileText, Download, Share2, Filter, Calendar, 
  TrendingUp, TrendingDown, Users, Clock, Target,
  BarChart3, PieChart, LineChart, Award, AlertTriangle,
  CheckCircle2, XCircle, Timer, Star, BookOpen,
  ArrowUp, ArrowDown, Eye, Settings, RefreshCw
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MobilePageContent } from "../shared/MobilePageContent";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, RadialBarChart, RadialBar } from "recharts";
import { toast } from "sonner@2.0.3";

interface MobileAttendanceReportsProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface ReportData {
  id: string;
  title: string;
  type: "class" | "subject" | "student" | "monthly";
  period: string;
  generated: string;
  attendanceRate: number;
  totalSessions: number;
  attendedSessions: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface ClassReport {
  className: string;
  subject: string;
  teacher: string;
  studentsTotal: number;
  averageAttendance: number;
  lastSession: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  topPerformers: string[];
  atRiskStudents: string[];
}

interface SubjectPerformance {
  subject: string;
  totalClasses: number;
  attendanceRate: number;
  averageScore: number;
  missedClasses: number;
  color: string;
}

export const MobileAttendanceReports: React.FC<MobileAttendanceReportsProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data
  const recentReports: ReportData[] = [
    {
      id: "1",
      title: "November 2024 - Class 10A Math",
      type: "class",
      period: "November 2024",
      generated: "2 hours ago",
      attendanceRate: 92.5,
      totalSessions: 20,
      attendedSessions: 18,
      trend: "up",
      trendValue: 3.2
    },
    {
      id: "2",
      title: "Physics - All Classes",
      type: "subject",
      period: "Last 30 days",
      generated: "1 day ago",
      attendanceRate: 88.7,
      totalSessions: 15,
      attendedSessions: 13,
      trend: "down",
      trendValue: 1.8
    },
    {
      id: "3",
      title: "John Smith - Attendance Record",
      type: "student",
      period: "Semester 1",
      generated: "3 days ago",
      attendanceRate: 95.2,
      totalSessions: 84,
      attendedSessions: 80,
      trend: "stable",
      trendValue: 0.5
    },
    {
      id: "4",
      title: "Monthly Report - October",
      type: "monthly",
      period: "October 2024",
      generated: "1 week ago",
      attendanceRate: 89.3,
      totalSessions: 95,
      attendedSessions: 85,
      trend: "up",
      trendValue: 2.7
    }
  ];

  const classReports: ClassReport[] = [
    {
      className: "Class 10A",
      subject: "Mathematics",
      teacher: "Ms. Sarah Johnson",
      studentsTotal: 30,
      averageAttendance: 92.5,
      lastSession: "2 hours ago",
      trend: "up",
      trendValue: 3.2,
      topPerformers: ["Alice Chen", "Bob Wilson", "Carol Davis"],
      atRiskStudents: ["David Brown", "Emma Wilson"]
    },
    {
      className: "Class 10B",
      subject: "Physics",
      teacher: "Mr. Robert Chen",
      studentsTotal: 28,
      averageAttendance: 88.7,
      lastSession: "1 day ago",
      trend: "down",
      trendValue: 1.8,
      topPerformers: ["Frank Miller", "Grace Lee", "Henry Taylor"],
      atRiskStudents: ["Ivy Johnson", "Jack Smith", "Kate Anderson"]
    },
    {
      className: "Class 9A",
      subject: "Chemistry",
      teacher: "Dr. Emily Davis",
      studentsTotal: 25,
      averageAttendance: 90.8,
      lastSession: "3 hours ago",
      trend: "stable",
      trendValue: 0.5,
      topPerformers: ["Liam Wilson", "Mia Brown", "Noah Davis"],
      atRiskStudents: ["Olivia Miller"]
    }
  ];

  const subjectPerformance: SubjectPerformance[] = [
    {
      subject: "Mathematics",
      totalClasses: 48,
      attendanceRate: 94.2,
      averageScore: 87,
      missedClasses: 3,
      color: "#7C3AED"
    },
    {
      subject: "Physics",
      totalClasses: 42,
      attendanceRate: 91.8,
      averageScore: 84,
      missedClasses: 3,
      color: "#0EA5E9"
    },
    {
      subject: "Chemistry",
      totalClasses: 40,
      attendanceRate: 88.5,
      averageScore: 81,
      missedClasses: 5,
      color: "#FB7185"
    },
    {
      subject: "English",
      totalClasses: 36,
      attendanceRate: 96.1,
      averageScore: 89,
      missedClasses: 1,
      color: "#10B981"
    },
    {
      subject: "History",
      totalClasses: 32,
      attendanceRate: 89.7,
      averageScore: 83,
      missedClasses: 3,
      color: "#F59E0B"
    }
  ];

  const monthlyData = [
    { month: "Jul", attendance: 88.5, target: 90 },
    { month: "Aug", attendance: 91.2, target: 90 },
    { month: "Sep", attendance: 89.8, target: 90 },
    { month: "Oct", attendance: 93.1, target: 90 },
    { month: "Nov", attendance: 94.7, target: 90 },
    { month: "Dec", attendance: 92.3, target: 90 }
  ];

  const overallStats = {
    totalClasses: 198,
    attendedClasses: 182,
    missedClasses: 16,
    averageAttendance: 91.9,
    improvement: 2.4,
    consistencyScore: 87,
    rank: 12,
    totalStudents: 150
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Timer className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600 bg-green-100";
      case "down": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${type} report generated successfully!`);
    setIsGenerating(false);
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success("Report downloaded successfully!");
  };

  const handleShareReport = (reportId: string) => {
    toast.success("Report shared successfully!");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">
                <ArrowUp className="w-3 h-3 mr-1" />
                +{overallStats.improvement}%
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{overallStats.averageAttendance}%</p>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Score: {overallStats.consistencyScore}
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">#{overallStats.rank}</p>
              <p className="text-sm text-muted-foreground">Class Ranking</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Attendance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">
                  {overallStats.attendedClasses}/{overallStats.totalClasses}
                </span>
              </div>
              <Progress value={overallStats.averageAttendance} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-green-50">
                <div className="text-xl font-bold text-green-600">{overallStats.attendedClasses}</div>
                <div className="text-xs text-green-600">Attended</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-red-50">
                <div className="text-xl font-bold text-red-600">{overallStats.missedClasses}</div>
                <div className="text-xs text-red-600">Missed</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-50">
                <div className="text-xl font-bold text-blue-600">{overallStats.totalClasses}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    domain={[80, 100]}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#E2E8F0"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button 
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => handleGenerateReport("Monthly")}
          disabled={isGenerating}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">Generate Report</span>
        </Button>
        <Button 
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => onPageChange("attendance-analytics")}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">View Analytics</span>
        </Button>
      </motion.div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          className="h-16 bg-gradient-to-br from-primary to-purple-600"
          onClick={() => handleGenerateReport("Custom")}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center space-y-1">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Generating...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <FileText className="w-5 h-5" />
              <span className="text-xs">New Report</span>
            </div>
          )}
        </Button>
        <Button 
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => setSelectedPeriod("custom")}
        >
          <Filter className="w-5 h-5" />
          <span className="text-xs">Filter</span>
        </Button>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="font-semibold">Recent Reports</h3>
        {recentReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="bg-card rounded-xl p-4 border border-border/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{report.title}</h4>
                <p className="text-sm text-muted-foreground">{report.period}</p>
                <p className="text-xs text-muted-foreground">Generated {report.generated}</p>
              </div>
              <Badge className={`${getTrendColor(report.trend)} border-0 ml-2`}>
                {getTrendIcon(report.trend)}
                <span className="ml-1">{report.trendValue}%</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">
                <span className="font-medium">{report.attendanceRate}%</span>
                <span className="text-muted-foreground ml-1">attendance</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {report.attendedSessions}/{report.totalSessions} sessions
              </div>
            </div>

            <Progress value={report.attendanceRate} className="h-2 mb-3" />

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDownloadReport(report.id)}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleShareReport(report.id)}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReport(report)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const renderClassPerformance = () => (
    <div className="space-y-6">
      {/* Class Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Class Performance</h3>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {classReports.map((classReport, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card rounded-xl p-4 border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">{classReport.className} - {classReport.subject}</h4>
                <p className="text-sm text-muted-foreground">{classReport.teacher}</p>
              </div>
              <div className="text-right">
                <Badge className={`${getTrendColor(classReport.trend)} border-0`}>
                  {getTrendIcon(classReport.trend)}
                  <span className="ml-1">{classReport.trendValue}%</span>
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Last: {classReport.lastSession}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Attendance</span>
                <span className="font-medium">{classReport.averageAttendance}%</span>
              </div>
              <Progress value={classReport.averageAttendance} className="h-2" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Top Performers</p>
                  {classReport.topPerformers.slice(0, 2).map((student, i) => (
                    <div key={i} className="flex items-center space-x-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="truncate">{student}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">At Risk</p>
                  {classReport.atRiskStudents.slice(0, 2).map((student, i) => (
                    <div key={i} className="flex items-center space-x-1 mb-1">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="truncate">{student}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Subject Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="subject" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    domain={[80, 100]}
                  />
                  <Bar
                    dataKey="attendanceRate"
                    radius={[4, 4, 0, 0]}
                    fill="#7C3AED"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const getRightAction = () => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
        <Filter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <MobilePageContent
      title="Attendance Reports"
      onBack={onBack}
      rightAction={getRightAction()}
    >
      <div className="p-4 space-y-6">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="overview" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-sm">
                <FileText className="w-4 h-4 mr-1" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="classes" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                Classes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              {renderOverview()}
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              {renderReports()}
            </TabsContent>
            
            <TabsContent value="classes" className="mt-6">
              {renderClassPerformance()}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MobilePageContent>
  );
};