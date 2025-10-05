import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
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
  Line
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Calendar,
  Download,
  Filter,
  Eye,
  Share,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Clock,
  Target,
  ArrowLeft,
  FileText,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Import centralized reports hook
import { useReports } from "../../hooks/useSchoolData";

interface MobileReportsProps {
  onPageChange?: (page: string) => void;
}

// Generate dynamic chart data based on centralized data
const generateChartData = (reports: any[]) => {
  const attendanceData = [
    { name: "Mon", present: 85 + Math.floor(Math.random() * 10), absent: 15 - Math.floor(Math.random() * 5) },
    { name: "Tue", present: 92 + Math.floor(Math.random() * 8), absent: 8 - Math.floor(Math.random() * 3) },
    { name: "Wed", present: 78 + Math.floor(Math.random() * 15), absent: 22 - Math.floor(Math.random() * 10) },
    { name: "Thu", present: 88 + Math.floor(Math.random() * 12), absent: 12 - Math.floor(Math.random() * 6) },
    { name: "Fri", present: 95 + Math.floor(Math.random() * 5), absent: 5 - Math.floor(Math.random() * 2) },
  ];

  const gradeDistribution = [
    { name: "A", value: 35 + Math.floor(Math.random() * 10), color: "#10B981" },
    { name: "B", value: 28 + Math.floor(Math.random() * 10), color: "#3B82F6" },
    { name: "C", value: 22 + Math.floor(Math.random() * 8), color: "#F59E0B" },
    { name: "D", value: 10 + Math.floor(Math.random() * 5), color: "#EF4444" },
    { name: "F", value: 5 + Math.floor(Math.random() * 3), color: "#6B7280" },
  ];

  const performanceData = [
    { subject: "Math", score: 85 + Math.floor(Math.random() * 10) },
    { subject: "Science", score: 92 + Math.floor(Math.random() * 8) },
    { subject: "English", score: 78 + Math.floor(Math.random() * 15) },
    { subject: "History", score: 88 + Math.floor(Math.random() * 12) },
    { subject: "Art", score: 95 + Math.floor(Math.random() * 5) },
  ];

  const monthlyProgress = [
    { month: "Jan", score: 75 + Math.floor(Math.random() * 5) },
    { month: "Feb", score: 78 + Math.floor(Math.random() * 5) },
    { month: "Mar", score: 82 + Math.floor(Math.random() * 5) },
    { month: "Apr", score: 85 + Math.floor(Math.random() * 5) },
    { month: "May", score: 88 + Math.floor(Math.random() * 5) },
    { month: "Jun", score: 91 + Math.floor(Math.random() * 5) },
  ];

  return { attendanceData, gradeDistribution, performanceData, monthlyProgress };
};

export const MobileReports: React.FC<MobileReportsProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const { reports, loading, error, generateReport } = useReports();
  
  const [currentView, setCurrentView] = useState<"overview" | "attendance" | "grades" | "performance">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Generate dynamic chart data based on reports
  const chartData = generateChartData(reports);
  const { attendanceData, gradeDistribution, performanceData, monthlyProgress } = chartData;

  const periods = ["This Week", "This Month", "This Quarter", "This Year"];

  // Overview
  if (currentView === "overview") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track progress and performance</p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {period}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-bold text-green-700">92%</span>
              </div>
              <div className="text-xs text-green-600">Overall Performance</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-bold text-blue-700">87%</span>
              </div>
              <div className="text-xs text-blue-600">Attendance Rate</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-bold text-purple-700">A-</span>
              </div>
              <div className="text-xs text-purple-600">Average Grade</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-bold text-orange-700">15</span>
              </div>
              <div className="text-xs text-orange-600">Assignments</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {[
            {
              key: "attendance",
              title: "Attendance Reports",
              subtitle: "Track daily and weekly attendance",
              icon: Users,
              color: "blue",
              value: "87% this week"
            },
            {
              key: "grades",
              title: "Grade Analytics",
              subtitle: "View grade distribution and trends",
              icon: GraduationCap,
              color: "green",
              value: "A- average"
            },
            {
              key: "performance",
              title: "Performance Insights",
              subtitle: "Subject-wise performance analysis",
              icon: BarChart3,
              color: "purple",
              value: "5 subjects tracked"
            }
          ].map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setCurrentView(category.key as any)}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${category.color}-100`}>
                      <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{category.value}</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Charts Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold mb-3">Monthly Progress</h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#7C3AED" 
                      strokeWidth={3}
                      dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#7C3AED', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div>
                  <div className="text-sm font-medium">Current Score</div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">91%</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +3% from last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Attendance Reports
  if (currentView === "attendance") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Attendance Reports</h1>
            <p className="text-sm text-muted-foreground">Track attendance patterns</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Download className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Attendance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold text-green-700">87%</div>
              <div className="text-xs text-green-600">Present</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-3 text-center">
              <AlertCircle className="h-5 w-5 mx-auto mb-1 text-red-600" />
              <div className="text-lg font-bold text-red-700">13%</div>
              <div className="text-xs text-red-600">Absent</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold text-blue-700">18</div>
              <div className="text-xs text-blue-600">Days</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis hide />
                    <Bar dataKey="present" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="absent" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs">Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold mb-3">Attendance Insights</h3>
          <div className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Best Day</span>
                  <Badge className="bg-green-100 text-green-700">Friday</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  95% attendance rate on Fridays
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Improvement Needed</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">Wednesday</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Only 78% attendance on Wednesdays
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Target</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">87/90%</div>
                  </div>
                </div>
                <Progress value={87/90*100} className="mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  3% away from monthly goal
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  // Grade Analytics
  if (currentView === "grades") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Grade Analytics</h1>
            <p className="text-sm text-muted-foreground">Grade distribution and trends</p>
          </div>
        </motion.div>

        {/* Grade Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold text-primary">A-</div>
              <div className="text-xs text-muted-foreground">Current GPA</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-700">+5%</div>
              <div className="text-xs text-green-600">This Month</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {gradeDistribution.map((grade) => (
                  <div key={grade.name} className="text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: grade.color }}
                    ></div>
                    <div className="text-xs font-medium">{grade.name}</div>
                    <div className="text-xs text-muted-foreground">{grade.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold mb-3">Recent Grades</h3>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", grade: "A", score: 92, trend: "up" },
              { subject: "Physics", grade: "B+", score: 87, trend: "up" },
              { subject: "English", grade: "A-", score: 89, trend: "down" },
              { subject: "Chemistry", grade: "B", score: 84, trend: "up" }
            ].map((item, index) => (
              <Card key={item.subject} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.subject}</h4>
                      <div className="text-xs text-muted-foreground">
                        Score: {item.score}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          item.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                          item.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {item.grade}
                      </Badge>
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Performance Insights
  if (currentView === "performance") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Performance Insights</h1>
            <p className="text-sm text-muted-foreground">Subject-wise analysis</p>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      type="category" 
                      dataKey="subject" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                      width={60}
                    />
                    <Bar dataKey="score" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-3">Performance Details</h3>
          <div className="space-y-3">
            {performanceData.map((subject, index) => (
              <Card key={subject.subject} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{subject.subject}</h4>
                    <Badge 
                      className={
                        subject.score >= 90 ? 'bg-green-100 text-green-700' :
                        subject.score >= 80 ? 'bg-blue-100 text-blue-700' :
                        subject.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }
                    >
                      {subject.score}%
                    </Badge>
                  </div>
                  <Progress value={subject.score} className="mb-2" />
                  <div className="text-xs text-muted-foreground">
                    {subject.score >= 90 ? 'Excellent performance' :
                     subject.score >= 80 ? 'Good performance' :
                     subject.score >= 70 ? 'Satisfactory performance' :
                     'Needs improvement'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold mb-3">Recommendations</h3>
          <div className="space-y-3">
            <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Strengths</h4>
                    <p className="text-xs text-muted-foreground">
                      Excellent performance in Art and Science. Keep up the great work!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Focus Areas</h4>
                    <p className="text-xs text-muted-foreground">
                      English needs attention. Consider extra practice in reading comprehension.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};