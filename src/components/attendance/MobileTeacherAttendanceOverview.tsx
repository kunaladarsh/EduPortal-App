import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, Clock, Users, TrendingUp, TrendingDown, Target,
  CheckCircle, XCircle, AlertTriangle, Timer, Bell, Star,
  BookOpen, BarChart3, FileText, Settings, Plus, Eye,
  Activity, Award, Zap, Phone, Mail, MapPin, ArrowRight
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface DashboardMetrics {
  totalClasses: number;
  completedToday: number;
  averageAttendance: number;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  weeklyTrend: number;
  monthlyGoalProgress: number;
  attendanceGoal: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  urgent?: boolean;
  count?: number;
}

interface AttendanceAlert {
  id: string;
  type: "low_attendance" | "frequent_absence" | "late_pattern" | "parent_contact";
  studentName: string;
  className: string;
  message: string;
  severity: "high" | "medium" | "low";
  actionRequired: boolean;
}

interface UpcomingClass {
  id: string;
  name: string;
  subject: string;
  time: string;
  location: string;
  studentsCount: number;
  isNext: boolean;
  minutesUntil?: number;
}

interface MobileTeacherAttendanceOverviewProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToReports?: () => void;
}

export const MobileTeacherAttendanceOverview: React.FC<MobileTeacherAttendanceOverviewProps> = ({
  onPageChange,
  onBack,
  onNavigateToAttendance,
  onNavigateToAnalytics,
  onNavigateToReports
}) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const metrics: DashboardMetrics = {
    totalClasses: 8,
    completedToday: 3,
    averageAttendance: 91.5,
    totalStudents: 90,
    presentToday: 82,
    absentToday: 6,
    lateToday: 2,
    weeklyTrend: 5.2,
    monthlyGoalProgress: 78,
    attendanceGoal: 95
  };

  const upcomingClasses: UpcomingClass[] = [
    {
      id: "upcoming_1",
      name: "Class 10A",
      subject: "Mathematics",
      time: "02:00 PM",
      location: "Room 101",
      studentsCount: 32,
      isNext: true,
      minutesUntil: 45
    },
    {
      id: "upcoming_2",
      name: "Class 9B",
      subject: "Algebra",
      time: "03:30 PM",
      location: "Room 102",
      studentsCount: 28,
      isNext: false
    },
    {
      id: "upcoming_3",
      name: "Class 11A",
      subject: "Calculus",
      time: "04:30 PM",
      location: "Room 103",
      studentsCount: 25,
      isNext: false
    }
  ];

  const alerts: AttendanceAlert[] = [
    {
      id: "alert_1",
      type: "low_attendance",
      studentName: "David Wilson",
      className: "Class 10A",
      message: "Attendance dropped to 72% - below threshold",
      severity: "high",
      actionRequired: true
    },
    {
      id: "alert_2",
      type: "frequent_absence",
      studentName: "Emma Thompson",
      className: "Class 10B",
      message: "3 consecutive absences detected",
      severity: "medium",
      actionRequired: true
    },
    {
      id: "alert_3",
      type: "parent_contact",
      studentName: "Bob Smith",
      className: "Class 9A",
      message: "Parent requested attendance update",
      severity: "low",
      actionRequired: false
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: "take_attendance",
      title: "Take Attendance",
      description: "Record attendance for current class",
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => {
        onNavigateToAttendance?.();
        toast.success("Opening attendance interface...");
      }
    },
    {
      id: "view_analytics",
      title: "View Analytics",
      description: "Check attendance trends and insights",
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => {
        onNavigateToAnalytics?.();
        toast.success("Loading analytics...");
      }
    },
    {
      id: "generate_report",
      title: "Generate Report",
      description: "Create attendance reports",
      icon: <FileText className="h-5 w-5" />,
      action: () => {
        onNavigateToReports?.();
        toast.success("Opening reports...");
      }
    },
    {
      id: "review_alerts",
      title: "Review Alerts",
      description: "Check attendance alerts",
      icon: <AlertTriangle className="h-5 w-5" />,
      action: () => toast.info("Opening alerts..."),
      urgent: true,
      count: alerts.filter(a => a.actionRequired).length
    }
  ];

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high": return "border-red-200 bg-red-50 text-red-800";
      case "medium": return "border-yellow-200 bg-yellow-50 text-yellow-800";
      default: return "border-blue-200 bg-blue-50 text-blue-800";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_attendance": return <TrendingDown className="h-4 w-4" />;
      case "frequent_absence": return <XCircle className="h-4 w-4" />;
      case "late_pattern": return <Clock className="h-4 w-4" />;
      case "parent_contact": return <Phone className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleTakeAttendance = (classId: string) => {
    toast.success("Starting attendance for class...");
    onPageChange("take-attendance");
  };

  const handleAlertAction = (alert: AttendanceAlert) => {
    switch (alert.type) {
      case "low_attendance":
        toast.info(`Reviewing ${alert.studentName}'s attendance pattern`);
        break;
      case "frequent_absence":
        toast.info(`Initiating parent contact for ${alert.studentName}`);
        break;
      case "parent_contact":
        toast.info(`Opening communication with ${alert.studentName}'s parent`);
        break;
      default:
        toast.info("Processing alert...");
    }
  };

  return (
    <MobilePageContent
      title="Attendance Overview"
      subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'Teacher'}`}
      showBack
      onBack={onBack}
      className="space-y-4"
    >
      {/* Current Time & Status */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold mb-2">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          {upcomingClasses.find(c => c.isNext) && (
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
              <Timer className="w-3 h-3 mr-1" />
              Next: {upcomingClasses.find(c => c.isNext)?.subject} in {upcomingClasses.find(c => c.isNext)?.minutesUntil}min
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/30">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <Badge className="bg-green-200 text-green-700 border-0 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metrics.weeklyTrend}%
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.averageAttendance}%
              </div>
              <div className="text-sm text-green-600">Average Attendance</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <Badge className="bg-blue-200 text-blue-700 border-0 text-xs">
                Today
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.completedToday}/{metrics.totalClasses}
              </div>
              <div className="text-sm text-blue-600">Classes Done</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Summary
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onPageChange("attendance")}>
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-3 text-center mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">{metrics.presentToday}</div>
              <div className="text-xs text-green-600">Present</div>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{metrics.lateToday}</div>
              <div className="text-xs text-yellow-600">Late</div>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600">{metrics.absentToday}</div>
              <div className="text-xs text-red-600">Absent</div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{metrics.totalStudents}</div>
              <div className="text-xs text-blue-600">Total</div>
            </div>
          </div>

          {/* Monthly Goal Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Goal Progress</span>
              <span className="font-medium">{metrics.monthlyGoalProgress}% to {metrics.attendanceGoal}%</span>
            </div>
            <Progress value={metrics.monthlyGoalProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                variant="outline"
                className={`h-20 w-full flex-col space-y-1 relative ${
                  action.urgent ? 'border-red-200 bg-red-50 hover:bg-red-100' : ''
                }`}
                onClick={action.action}
              >
                {action.urgent && action.count && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white border-0 w-5 h-5 rounded-full text-xs p-0 flex items-center justify-center">
                    {action.count}
                  </Badge>
                )}
                <div className={action.urgent ? 'text-red-600' : ''}>{action.icon}</div>
                <span className={`text-xs text-center ${action.urgent ? 'text-red-800' : ''}`}>
                  {action.title}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Upcoming Classes</h3>
          <Button variant="ghost" size="sm" className="text-xs">
            View Schedule
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="space-y-2">
          {upcomingClasses.slice(0, 3).map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`border-0 shadow-sm ${classItem.isNext ? 'bg-accent/10 border-accent/20' : ''}`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${classItem.isNext ? 'bg-accent/20' : 'bg-primary/10'}`}>
                        <BookOpen className={`h-4 w-4 ${classItem.isNext ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm">{classItem.name}</h4>
                        <div className="text-xs text-muted-foreground">
                          {classItem.subject} • {classItem.studentsCount} students
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{classItem.time}</span>
                          <MapPin className="h-3 w-3" />
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {classItem.isNext && classItem.minutesUntil && (
                        <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mb-1">
                          {classItem.minutesUntil}min
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={classItem.isNext ? "default" : "outline"}
                        onClick={() => handleTakeAttendance(classItem.id)}
                        className="text-xs h-7"
                      >
                        {classItem.isNext ? "Start Now" : "Prepare"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alerts & Notifications */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Alerts & Notifications</h3>
            <Badge variant="destructive" className="text-xs">
              {alerts.filter(a => a.actionRequired).length} require action
            </Badge>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`border ${getAlertColor(alert.severity)}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{alert.studentName}</h4>
                        <p className="text-xs opacity-90 mb-1">{alert.className}</p>
                        <p className="text-xs opacity-80">{alert.message}</p>
                      </div>
                      {alert.actionRequired && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAlertAction(alert)}
                          className="text-xs h-7 flex-shrink-0"
                        >
                          Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </MobilePageContent>
  );
};