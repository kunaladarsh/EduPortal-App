import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  UserCheck,
  BarChart3,
  AlertTriangle,
  Filter,
  Search,
  ArrowLeft,
  Target,
  Star,
  Award,
  Heart,
  Flame,
  Trophy,
  Zap,
  Sun,
  Moon,
  Coffee,
  Sparkles,
  Activity,
  Eye
} from "lucide-react";
import { getAttendanceByStudent, mockClasses } from "../../services/mockData";

interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string;
}

interface MobileStudentAttendanceBeautifulProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileStudentAttendanceBeautiful: React.FC<MobileStudentAttendanceBeautifulProps> = ({ 
  onPageChange,
  onBack 
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"overview" | "calendar" | "history">("overview");
  const [filterPeriod, setFilterPeriod] = useState<"week" | "month" | "all">("month");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streak, setStreak] = useState(12);
  const [rank, setRank] = useState(3);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const myClass = mockClasses.find(cls => cls.id === user?.classId);
  const myAttendance = getAttendanceByStudent(user?.id || "");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "text-green-600 bg-green-50 border-green-200";
      case "absent": return "text-red-600 bg-red-50 border-red-200";
      case "late": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "excused": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="h-3 w-3" />;
      case "absent": return <XCircle className="h-3 w-3" />;
      case "late": return <Clock className="h-3 w-3" />;
      case "excused": return <UserCheck className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 6 || hour >= 22) return <Moon className="w-4 h-4" />;
    if (hour < 12) return <Sun className="w-4 h-4" />;
    if (hour < 17) return <Sun className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate attendance statistics
  const totalDays = myAttendance.length;
  const presentDays = myAttendance.filter(r => r.status === "present").length;
  const absentDays = myAttendance.filter(r => r.status === "absent").length;
  const lateDays = myAttendance.filter(r => r.status === "late").length;
  const excusedDays = myAttendance.filter(r => r.status === "excused").length;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;

  // Filter records based on period
  const filteredRecords = myAttendance.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    
    switch (filterPeriod) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return recordDate >= monthAgo;
      default:
        return true;
    }
  });

  // Get recent attendance trend
  const recentRecords = myAttendance.slice(-7);
  const recentPresentRate = recentRecords.length > 0 
    ? (recentRecords.filter(r => r.status === "present").length / recentRecords.length) * 100 
    : 0;
  const previousRate = attendanceRate;
  const trendDirection = recentPresentRate > previousRate ? "up" : "down";

  const getAttendanceLevel = () => {
    if (attendanceRate >= 95) return { level: "Excellent", icon: "🌟", color: "from-yellow-400 to-orange-400" };
    if (attendanceRate >= 85) return { level: "Great", icon: "⭐", color: "from-green-400 to-emerald-400" };
    if (attendanceRate >= 75) return { level: "Good", icon: "👍", color: "from-blue-400 to-cyan-400" };
    return { level: "Needs Improvement", icon: "📚", color: "from-red-400 to-pink-400" };
  };

  const attendanceLevel = getAttendanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Beautiful Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </motion.button>
            )}
            <div>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getTimeIcon()}
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}!
                </h1>
              </motion.div>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {myClass?.name || "Your attendance journey"} ✨
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewMode(viewMode === "calendar" ? "overview" : "calendar")}
              className="p-2 w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-chart-4/10 hover:from-accent/20 hover:to-chart-4/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {viewMode === "calendar" ? 
                <BarChart3 className="h-4 w-4 text-accent" /> : 
                <CalendarIcon className="h-4 w-4 text-accent" />
              }
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {viewMode === "overview" && (
          <>
            {/* Hero Attendance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`p-3 rounded-xl bg-gradient-to-br ${attendanceLevel.color}`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BarChart3 className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-bold">Your Attendance</h2>
                        <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.div 
                        className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {attendanceRate.toFixed(1)}%
                      </motion.div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {trendDirection === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span>{Math.abs(recentPresentRate - previousRate).toFixed(1)}% vs last week</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Overall Progress</span>
                      <span className="flex items-center gap-1">
                        <span className="font-bold">{attendanceLevel.level}</span>
                        <span>{attendanceLevel.icon}</span>
                      </span>
                    </div>
                    <Progress value={attendanceRate} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <motion.div 
                      className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xl font-bold text-green-600">{presentDays}</div>
                      <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Present
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xl font-bold text-yellow-600">{lateDays}</div>
                      <div className="text-xs text-yellow-600 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        Late
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xl font-bold text-red-600">{absentDays}</div>
                      <div className="text-xs text-red-600 flex items-center justify-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Absent
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-800/20 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xl font-bold text-blue-600">{excusedDays}</div>
                      <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Excused
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Row */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Flame className="w-6 h-6 text-orange-600" />
                    </motion.div>
                    <div className="text-2xl font-bold text-orange-600">{streak}</div>
                    <div className="text-xs text-orange-600">Day Streak</div>
                    <div className="text-xs text-orange-600/80 mt-1">🔥 On fire!</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center"
                      animate={{ 
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Trophy className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <div className="text-2xl font-bold text-purple-600">#{rank}</div>
                    <div className="text-xs text-purple-600">Class Rank</div>
                    <div className="text-xs text-purple-600/80 mt-1">🏆 Top performer</div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Alert if attendance is low */}
            {attendanceRate < 75 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-red-800 flex items-center gap-2">
                          Low Attendance Warning 
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ⚠️
                          </motion.span>
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                          Your attendance is below the required 75%. Please attend classes regularly to avoid academic issues.
                        </p>
                        <motion.div 
                          className="mt-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                            <Target className="w-3 h-3 mr-1" />
                            Improve Now
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Period Filter */}
            <motion.div 
              className="flex gap-2 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {([["week", "Last Week"], ["month", "Last Month"], ["all", "All Time"]] as const).map(([period, label]) => (
                <motion.button
                  key={period}
                  onClick={() => setFilterPeriod(period)}
                  className={`whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4 py-2 font-medium transition-all duration-300 ${
                    filterPeriod === period
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 hover:from-primary/20 hover:to-secondary/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>

            {/* Recent Records */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Attendance
                </h3>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <Eye className="w-3 h-3 mr-1" />
                  {filteredRecords.length} records
                </Badge>
              </div>

              <AnimatePresence>
                {filteredRecords.slice(0, 10).map((record, index) => {
                  const classInfo = mockClasses.find(cls => cls.id === record.classId);
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <motion.div 
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                                whileHover={{ rotate: 5 }}
                                transition={{ duration: 0.3 }}
                              >
                                {getStatusIcon(record.status)}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1">
                                  {classInfo?.name || "Unknown Class"}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>{formatDate(new Date(record.date))}</span>
                                  <span>•</span>
                                  <span>by {record.markedBy}</span>
                                </div>
                              </div>
                            </div>
                            
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge className={`text-xs border ${getStatusColor(record.status)} flex-shrink-0`}>
                                {getStatusIcon(record.status)}
                                <span className="ml-1 capitalize">{record.status}</span>
                              </Badge>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredRecords.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground">No attendance records found for this period</p>
                  <p className="text-sm text-muted-foreground mt-1">Try selecting a different time period 📅</p>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Weekly Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 bg-gradient-to-br from-chart-2/10 to-chart-3/10 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-chart-2" />
                    This Week Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-bold text-chart-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {recentRecords.filter(r => r.status === "present").length}/{recentRecords.length}
                      </motion.div>
                      <div className="text-xs text-muted-foreground">Days Present</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-chart-2 mt-1">
                        <Star className="w-3 h-3" />
                        Excellent!
                      </div>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        className="text-3xl font-bold text-chart-3"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        {recentPresentRate.toFixed(0)}%
                      </motion.div>
                      <div className="text-xs text-muted-foreground">Weekly Rate</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-chart-3 mt-1">
                        <Heart className="w-3 h-3" />
                        Amazing!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {viewMode === "calendar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Attendance Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    present: myAttendance.filter(r => r.status === "present").map(r => new Date(r.date)),
                    absent: myAttendance.filter(r => r.status === "absent").map(r => new Date(r.date)),
                    late: myAttendance.filter(r => r.status === "late").map(r => new Date(r.date)),
                    excused: myAttendance.filter(r => r.status === "excused").map(r => new Date(r.date))
                  }}
                  modifiersStyles={{
                    present: { backgroundColor: 'rgb(34, 197, 94)', color: 'white' },
                    absent: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' },
                    late: { backgroundColor: 'rgb(245, 158, 11)', color: 'white' },
                    excused: { backgroundColor: 'rgb(59, 130, 246)', color: 'white' }
                  }}
                />
                
                {selectedDate && (
                  <motion.div 
                    className="mt-4 p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-medium mb-2">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    {(() => {
                      const dayRecord = myAttendance.find(r => 
                        new Date(r.date).toDateString() === selectedDate.toDateString()
                      );
                      
                      if (dayRecord) {
                        const classInfo = mockClasses.find(cls => cls.id === dayRecord.classId);
                        return (
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs border ${getStatusColor(dayRecord.status)}`}>
                              {getStatusIcon(dayRecord.status)}
                              <span className="ml-1 capitalize">{dayRecord.status}</span>
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {classInfo?.name || "Unknown Class"}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Coffee className="w-4 h-4" />
                            No class scheduled - Enjoy your free time! 😊
                          </p>
                        );
                      }
                    })()}
                  </motion.div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Excused</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Motivational Footer */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-green-100/50 dark:from-chart-4/20 dark:to-green-900/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">Keep up the amazing work!</span>
                <Heart className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-xs text-muted-foreground">
                Every day you attend is a step towards your bright future ✨
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};