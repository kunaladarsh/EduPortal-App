import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, Clock, Users, Plus, Edit, BarChart3, FileText, 
  Activity, CheckCircle, XCircle, Timer, AlertCircle, 
  BookOpen, MapPin, TrendingUp, ArrowRight, RefreshCw,
  Target, Star, Bell, Eye, Settings, Zap, Sparkles,
  Award, Heart, Flame, Coffee, Sun, Moon
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MobilePageContent } from "../shared/MobilePageContent";
import { MobileAttendanceAnalytics } from "./MobileAttendanceAnalytics";
import { MobileAttendanceReports } from "./MobileAttendanceReports";
import { MobileAttendanceTracker } from "./MobileAttendanceTracker";
import { MobileTakeAttendanceBeautiful } from "./MobileTakeAttendanceBeautiful";
import { MobileTeacherAttendanceEdit } from "./MobileTeacherAttendanceEdit";
import { MobileAttendanceDetails } from "./MobileAttendanceDetails";
import { toast } from "sonner@2.0.3";

interface TodayClass {
  id: string;
  name: string;
  subject: string;
  time: string;
  endTime: string;
  duration: string;
  location: string;
  studentsCount: number;
  status: "upcoming" | "ongoing" | "completed" | "missed";
  attendanceStatus: "not_taken" | "in_progress" | "completed";
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  isNext: boolean;
  minutesUntil?: number;
  lastUpdated?: string;
  color?: string;
}

interface AttendanceStats {
  totalClasses: number;
  completedClasses: number;
  totalStudents: number;
  overallAttendanceRate: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  weeklyTrend: number;
}

interface MobileTeacherAttendanceBeautifulProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileTeacherAttendanceBeautiful: React.FC<MobileTeacherAttendanceBeautifulProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"main" | "analytics" | "reports" | "tracker" | "take-attendance" | "edit" | "view-details">("main");
  const [selectedClass, setSelectedClass] = useState<TodayClass | null>(null);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [currentTime]);

  // Mock today's classes data with colors
  useEffect(() => {
    const mockClasses: TodayClass[] = [
      {
        id: "class_001",
        name: "Class 10A",
        subject: "Mathematics",
        time: "09:00 AM",
        endTime: "09:50 AM",
        duration: "50 min",
        location: "Room 101",
        studentsCount: 32,
        status: "completed",
        attendanceStatus: "completed",
        presentCount: 29,
        absentCount: 2,
        lateCount: 1,
        attendanceRate: 90.6,
        isNext: false,
        lastUpdated: "2 hours ago",
        color: "from-emerald-500 to-green-500"
      },
      {
        id: "class_002",
        name: "Class 10B",
        subject: "Mathematics",
        time: "11:00 AM",
        endTime: "11:50 AM",
        duration: "50 min",
        location: "Room 102",
        studentsCount: 28,
        status: "ongoing",
        attendanceStatus: "in_progress",
        presentCount: 24,
        absentCount: 1,
        lateCount: 2,
        attendanceRate: 85.7,
        isNext: true,
        minutesUntil: 15,
        lastUpdated: "15 minutes ago",
        color: "from-blue-500 to-cyan-500"
      },
      {
        id: "class_003",
        name: "Class 9A",
        subject: "Mathematics",
        time: "02:00 PM",
        endTime: "02:50 PM",
        duration: "50 min",
        location: "Room 103",
        studentsCount: 30,
        status: "upcoming",
        attendanceStatus: "not_taken",
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        attendanceRate: 0,
        isNext: false,
        minutesUntil: 180,
        color: "from-purple-500 to-violet-500"
      },
      {
        id: "class_004",
        name: "Class 11A",
        subject: "Advanced Mathematics",
        time: "03:30 PM",
        endTime: "04:20 PM",
        duration: "50 min",
        location: "Room 104",
        studentsCount: 25,
        status: "upcoming",
        attendanceStatus: "not_taken",
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        attendanceRate: 0,
        isNext: false,
        minutesUntil: 270,
        color: "from-orange-500 to-red-500"
      }
    ];
    setTodayClasses(mockClasses);
  }, []);

  const stats: AttendanceStats = {
    totalClasses: todayClasses.length,
    completedClasses: todayClasses.filter(c => c.attendanceStatus === "completed").length,
    totalStudents: todayClasses.reduce((acc, c) => acc + c.studentsCount, 0),
    overallAttendanceRate: todayClasses.length > 0 
      ? todayClasses.reduce((acc, c) => acc + c.attendanceRate, 0) / todayClasses.length 
      : 0,
    presentToday: todayClasses.reduce((acc, c) => acc + c.presentCount, 0),
    absentToday: todayClasses.reduce((acc, c) => acc + c.absentCount, 0),
    lateToday: todayClasses.reduce((acc, c) => acc + c.lateCount, 0),
    weeklyTrend: 5.2
  };

  const handleTakeAttendance = (classItem: TodayClass) => {
    setSelectedClass(classItem);
    setCurrentView("take-attendance");
  };

  const handleEditAttendance = () => {
    setCurrentView("edit");
  };

  const handleViewAnalytics = () => {
    setCurrentView("analytics");
  };

  const handleViewReports = () => {
    setCurrentView("reports");
  };

  const handleViewTracker = () => {
    setCurrentView("tracker");
  };

  const handleViewAttendanceDetails = (classItem: TodayClass) => {
    setSelectedClass(classItem);
    setCurrentView("view-details");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Data refreshed", {
      icon: "🔄",
    });
  };

  const handleAttendanceComplete = (attendanceData: any) => {
    setTodayClasses(prev => prev.map(cls => 
      cls.id === selectedClass?.id 
        ? { 
            ...cls, 
            attendanceStatus: "completed" as const,
            status: "completed" as const,
            lastUpdated: "just now",
            attendanceRate: (attendanceData.students.filter((s: any) => s.status === "present").length / attendanceData.students.length) * 100
          }
        : cls
    ));
    
    setCurrentView("main");
    setSelectedClass(null);
    toast.success("Attendance completed successfully!", {
      icon: "🎉",
    });
  };

  const getStatusColor = (status: TodayClass['status']) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "ongoing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "upcoming": return "bg-gray-100 text-gray-700 border-gray-200";
      case "missed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: TodayClass['status']) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "ongoing": return <Timer className="w-4 h-4" />;
      case "upcoming": return <Clock className="w-4 h-4" />;
      case "missed": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAttendanceStatusColor = (status: TodayClass['attendanceStatus']) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "not_taken": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 6 || hour >= 22) return <Moon className="w-4 h-4" />;
    if (hour < 12) return <Sun className="w-4 h-4" />;
    if (hour < 17) return <Sun className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

  // Render different views
  if (currentView === "analytics") {
    return (
      <MobileAttendanceAnalytics
        onPageChange={onPageChange}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  if (currentView === "reports") {
    return (
      <MobileAttendanceReports
        onPageChange={onPageChange}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  if (currentView === "tracker") {
    return (
      <MobileAttendanceTracker
        onPageChange={onPageChange}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  if (currentView === "take-attendance" && selectedClass) {
    return (
      <MobileTakeAttendanceBeautiful
        classSession={{
          id: selectedClass.id,
          name: selectedClass.name,
          subject: selectedClass.subject,
          time: selectedClass.time,
          duration: selectedClass.duration,
          location: selectedClass.location,
          studentsCount: selectedClass.studentsCount
        }}
        onBack={() => setCurrentView("main")}
        onComplete={handleAttendanceComplete}
      />
    );
  }

  if (currentView === "edit") {
    return (
      <MobileTeacherAttendanceEdit
        onBack={() => setCurrentView("main")}
        onPageChange={onPageChange}
      />
    );
  }

  if (currentView === "view-details" && selectedClass) {
    return (
      <MobileAttendanceDetails
        classId={selectedClass.id}
        onBack={() => setCurrentView("main")}
        onEdit={() => setCurrentView("edit")}
        onPageChange={onPageChange}
      />
    );
  }

  // Main attendance view
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
            <motion.button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-primary" />
            </motion.button>
            <div>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getTimeIcon()}
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {greeting}, {user?.name?.split(' ')[0] || 'Teacher'}!
                </h1>
              </motion.div>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ready to take attendance? ✨
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditAttendance}
              className="text-xs px-3 h-8 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 border-primary/20"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-chart-4/10 hover:from-accent/20 hover:to-chart-4/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 text-accent ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {/* Time & Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <motion.div 
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </motion.div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {stats.completedClasses}/{stats.totalClasses}
                  </div>
                  <div className="text-sm text-muted-foreground">Classes Done</div>
                  <motion.div 
                    className="flex items-center gap-1 text-xs text-chart-4 mt-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="w-3 h-3" />
                    <span>On Fire!</span>
                  </motion.div>
                </div>
              </div>

              {todayClasses.find(c => c.isNext) && (
                <motion.div 
                  className="p-3 bg-gradient-to-r from-accent/10 to-chart-4/10 rounded-xl"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Timer className="h-4 w-4 text-accent" />
                      </motion.div>
                      <span className="font-medium">
                        Next: {todayClasses.find(c => c.isNext)?.name}
                      </span>
                    </div>
                    <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {todayClasses.find(c => c.isNext)?.minutesUntil}min
                    </Badge>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-100 dark:bg-green-800/30 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </motion.div>
                <div className="text-xl font-bold text-green-600">{stats.overallAttendanceRate.toFixed(1)}%</div>
                <div className="text-xs text-green-600">Avg. Rate</div>
                <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>+{stats.weeklyTrend}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-5 h-5 text-blue-600" />
                </motion.div>
                <div className="text-xl font-bold text-blue-600">{stats.presentToday}</div>
                <div className="text-xs text-blue-600">Present Today</div>
                <div className="text-xs text-blue-600 mt-1">
                  {stats.totalStudents} total
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                </motion.div>
                <div className="text-xl font-bold text-purple-600">{stats.absentToday + stats.lateToday}</div>
                <div className="text-xs text-purple-600">Absent + Late</div>
                <div className="text-xs text-purple-600 mt-1">
                  {stats.absentToday}A / {stats.lateToday}L
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleViewAnalytics}
            className="h-16 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 text-primary hover:from-primary/20 hover:to-primary/30 transition-all duration-300 flex flex-col items-center justify-center space-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-medium">Analytics</span>
          </motion.button>
          
          <motion.button
            onClick={handleViewReports}
            className="h-16 p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/20 border border-secondary/20 text-secondary hover:from-secondary/20 hover:to-secondary/30 transition-all duration-300 flex flex-col items-center justify-center space-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Reports</span>
          </motion.button>
          
          <motion.button
            onClick={handleViewTracker}
            className="h-16 p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/20 border border-accent/20 text-accent hover:from-accent/20 hover:to-accent/30 transition-all duration-300 flex flex-col items-center justify-center space-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs font-medium">Live Tracker</span>
          </motion.button>
        </motion.div>

        {/* Beautiful Today's Classes */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Today's Classes
            </h3>
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              {todayClasses.length} classes
            </Badge>
          </div>

          <AnimatePresence>
            {todayClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  classItem.isNext ? 'ring-2 ring-accent/30 bg-gradient-to-r from-accent/5 to-chart-4/5' : 'bg-gradient-to-r from-card to-card/80'
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <motion.div 
                          className={`p-3 rounded-xl bg-gradient-to-br ${classItem.color || 'from-primary/20 to-secondary/20'}`}
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <BookOpen className="h-5 w-5 text-white drop-shadow-sm" />
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-base">{classItem.name}</h4>
                            {classItem.isNext && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Next
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {classItem.subject} • {classItem.studentsCount} students
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{classItem.time} - {classItem.endTime}</span>
                            <MapPin className="h-3 w-3" />
                            <span>{classItem.location}</span>
                          </div>
                          {classItem.lastUpdated && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              Last updated: {classItem.lastUpdated}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <Badge className={`text-xs border ${getStatusColor(classItem.status)}`}>
                          {getStatusIcon(classItem.status)}
                          <span className="ml-1 capitalize">{classItem.status}</span>
                        </Badge>
                        <div className={`text-xs ${getAttendanceStatusColor(classItem.attendanceStatus)}`}>
                          {classItem.attendanceStatus === "completed" ? "✅ Done" :
                           classItem.attendanceStatus === "in_progress" ? "⏳ In Progress" : "⏰ Pending"}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Attendance Rate Progress */}
                    {classItem.attendanceStatus !== "not_taken" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-medium">Attendance Rate</span>
                          <span className="font-bold text-primary">{classItem.attendanceRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={classItem.attendanceRate} className="h-2" />
                      </div>
                    )}

                    {/* Beautiful Attendance Summary */}
                    {classItem.attendanceStatus !== "not_taken" && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-lg">
                          <div className="text-sm font-bold text-green-600">{classItem.presentCount}</div>
                          <div className="text-xs text-green-600">Present</div>
                        </div>
                        <div className="text-center p-2 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-lg">
                          <div className="text-sm font-bold text-yellow-600">{classItem.lateCount}</div>
                          <div className="text-xs text-yellow-600">Late</div>
                        </div>
                        <div className="text-center p-2 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 rounded-lg">
                          <div className="text-sm font-bold text-red-600">{classItem.absentCount}</div>
                          <div className="text-xs text-red-600">Absent</div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-2">
                      {classItem.attendanceStatus === "not_taken" ? (
                        <motion.button
                          onClick={() => handleTakeAttendance(classItem)}
                          className="flex-1 h-9 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className="h-3 w-3" />
                          Take Attendance
                        </motion.button>
                      ) : classItem.attendanceStatus === "in_progress" ? (
                        <motion.button
                          onClick={() => handleTakeAttendance(classItem)}
                          className="flex-1 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Timer className="h-3 w-3" />
                          Continue
                        </motion.button>
                      ) : (
                        <>
                          <motion.button
                            onClick={() => handleViewAttendanceDetails(classItem)}
                            className="flex-1 h-9 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary border border-secondary/20 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:from-secondary/20 hover:to-primary/20 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </motion.button>
                          <motion.button
                            onClick={handleEditAttendance}
                            className="flex-1 h-9 bg-gradient-to-r from-accent/10 to-chart-4/10 text-accent border border-accent/20 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:from-accent/20 hover:to-chart-4/20 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </motion.button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {todayClasses.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground">No classes scheduled for today</p>
              <p className="text-sm text-muted-foreground mt-1">Enjoy your free time! 🌟</p>
            </motion.div>
          )}
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-green-100/50 dark:from-chart-4/20 dark:to-green-900/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">Great job today!</span>
                <Heart className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-xs text-muted-foreground">
                You're making a difference in your students' lives ✨
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};