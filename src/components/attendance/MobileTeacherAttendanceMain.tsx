import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, Clock, Users, Plus, Edit, BarChart3, FileText, 
  Activity, CheckCircle, XCircle, Timer, AlertCircle, 
  BookOpen, MapPin, TrendingUp, ArrowRight, RefreshCw,
  Target, Star, Bell, Eye, Settings
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
import { MobileSimpleTakeAttendance } from "./MobileSimpleTakeAttendance";
import { MobileTeacherAttendanceEdit } from "./MobileTeacherAttendanceEdit";
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

interface MobileTeacherAttendanceMainProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileTeacherAttendanceMain: React.FC<MobileTeacherAttendanceMainProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"main" | "analytics" | "reports" | "tracker" | "take-attendance" | "edit">("main");
  const [selectedClass, setSelectedClass] = useState<TodayClass | null>(null);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock today's classes data
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
        lastUpdated: "2 hours ago"
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
        lastUpdated: "15 minutes ago"
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
        minutesUntil: 180
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
        minutesUntil: 270
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  const handleAttendanceComplete = (attendanceData: any) => {
    // Update the class with completed attendance
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
    toast.success("Attendance completed successfully!");
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
      <MobileSimpleTakeAttendance
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

  // Main attendance view
  return (
    <MobilePageContent
      title="Attendance"
      subtitle={`Welcome, ${user?.name?.split(' ')[0] || 'Teacher'}`}
      showBack
      onBack={onBack}
      className="space-y-4"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditAttendance}
            className="text-xs px-3 h-8"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit Attendance
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 w-8 h-8"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      }
    >
      {/* Current Time & Today's Overview */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {stats.completedClasses}/{stats.totalClasses}
              </div>
              <div className="text-sm text-muted-foreground">Classes Done</div>
            </div>
          </div>

          {todayClasses.find(c => c.isNext) && (
            <div className="p-2 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-accent" />
                  <span className="font-medium">
                    Next: {todayClasses.find(c => c.isNext)?.name}
                  </span>
                </div>
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                  {todayClasses.find(c => c.isNext)?.minutesUntil}min
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-600">{stats.overallAttendanceRate.toFixed(1)}%</div>
            <div className="text-xs text-green-600">Avg. Rate</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.weeklyTrend}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{stats.presentToday}</div>
            <div className="text-xs text-blue-600">Present Today</div>
            <div className="text-xs text-blue-600 mt-1">
              {stats.totalStudents} total
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{stats.absentToday + stats.lateToday}</div>
            <div className="text-xs text-purple-600">Absent + Late</div>
            <div className="text-xs text-purple-600 mt-1">
              {stats.absentToday}A / {stats.lateToday}L
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={handleViewAnalytics}
          className="h-16 flex-col space-y-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
          variant="outline"
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </Button>
        <Button
          onClick={handleViewReports}
          className="h-16 flex-col space-y-1 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20"
          variant="outline"
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs">Reports</span>
        </Button>
        <Button
          onClick={handleViewTracker}
          className="h-16 flex-col space-y-1 bg-accent/10 border-accent/20 text-accent hover:bg-accent/20"
          variant="outline"
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs">Live Tracker</span>
        </Button>
      </div>

      {/* Today's Classes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Today's Classes</h3>
          <Badge variant="outline" className="text-xs">
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
            >
              <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
                classItem.isNext ? 'ring-2 ring-accent/20 bg-accent/5' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${classItem.isNext ? 'bg-accent/20' : 'bg-primary/10'}`}>
                        <BookOpen className={`h-4 w-4 ${classItem.isNext ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{classItem.name}</h4>
                          {classItem.isNext && (
                            <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">
                              Next
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {classItem.subject} • {classItem.studentsCount} students
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{classItem.time} - {classItem.endTime}</span>
                          <MapPin className="h-3 w-3" />
                          <span>{classItem.location}</span>
                        </div>
                        {classItem.lastUpdated && (
                          <div className="text-xs text-muted-foreground mt-1">
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
                        {classItem.attendanceStatus === "completed" ? "Attendance Done" :
                         classItem.attendanceStatus === "in_progress" ? "In Progress" : "Pending"}
                      </div>
                    </div>
                  </div>

                  {/* Attendance Rate Progress */}
                  {classItem.attendanceStatus !== "not_taken" && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Attendance Rate</span>
                        <span className="font-medium">{classItem.attendanceRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={classItem.attendanceRate} className="h-2" />
                    </div>
                  )}

                  {/* Attendance Summary */}
                  {classItem.attendanceStatus !== "not_taken" && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-sm font-semibold text-green-600">{classItem.presentCount}</div>
                        <div className="text-xs text-green-600">Present</div>
                      </div>
                      <div className="text-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <div className="text-sm font-semibold text-yellow-600">{classItem.lateCount}</div>
                        <div className="text-xs text-yellow-600">Late</div>
                      </div>
                      <div className="text-center p-1 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="text-sm font-semibold text-red-600">{classItem.absentCount}</div>
                        <div className="text-xs text-red-600">Absent</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {classItem.attendanceStatus === "not_taken" ? (
                      <Button
                        size="sm"
                        onClick={() => handleTakeAttendance(classItem)}
                        className="flex-1 text-xs h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Take Attendance
                      </Button>
                    ) : classItem.attendanceStatus === "in_progress" ? (
                      <Button
                        size="sm"
                        onClick={() => handleTakeAttendance(classItem)}
                        className="flex-1 text-xs h-8"
                        variant="default"
                      >
                        <Timer className="h-3 w-3 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Viewing class details...")}
                          className="flex-1 text-xs h-8"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditAttendance}
                          className="flex-1 text-xs h-8"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {todayClasses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No classes scheduled for today</p>
          </div>
        )}
      </div>
    </MobilePageContent>
  );
};