import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, Clock, Users, BookOpen, Plus, TrendingUp, 
  BarChart3, CheckCircle, XCircle, AlertCircle, Target,
  Eye, Edit, ArrowRight, Filter, Search, RefreshCw,
  FileText, Settings, Bell, Star, Timer, Activity
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MobilePageContent } from "../shared/MobilePageContent";
import { MobileTakeAttendanceFlow } from "./MobileTakeAttendanceFlow";
import { MobileAttendanceAnalytics } from "./MobileAttendanceAnalytics";
import { MobileAttendanceReports } from "./MobileAttendanceReports";
import { MobileTeacherAttendanceEdit } from "./MobileTeacherAttendanceEdit";
import { toast } from "sonner@2.0.3";

interface ClassSession {
  id: string;
  className: string;
  subject: string;
  time: string;
  duration: string;
  studentsCount: number;
  attendanceStatus: "not-started" | "in-progress" | "completed";
  presentCount: number;
  absentCount: number;
  lateCount: number;
  teacher: string;
  location: string;
  date: string;
  lastUpdated?: string;
  attendanceRate: number;
}

interface AttendanceMetrics {
  totalClasses: number;
  completedToday: number;
  averageAttendance: number;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  weeklyTrend: number;
}

interface MobileTeacherAttendanceProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileTeacherAttendance: React.FC<MobileTeacherAttendanceProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<"dashboard" | "take-attendance" | "analytics" | "reports" | "edit">("dashboard");
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  // Mock teacher sessions data
  useEffect(() => {
    const mockSessions: ClassSession[] = [
      {
        id: "session_001",
        className: "Class 10A",
        subject: "Mathematics",
        time: "09:00 AM",
        duration: "50 min",
        studentsCount: 32,
        attendanceStatus: "not-started",
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        teacher: user?.name || "Teacher",
        location: "Room 101",
        date: new Date().toISOString().split('T')[0],
        attendanceRate: 0
      },
      {
        id: "session_002",
        className: "Class 10B",
        subject: "Mathematics",
        time: "11:00 AM",
        duration: "50 min",
        studentsCount: 28,
        attendanceStatus: "completed",
        presentCount: 26,
        absentCount: 1,
        lateCount: 1,
        teacher: user?.name || "Teacher",
        location: "Room 101",
        date: new Date().toISOString().split('T')[0],
        lastUpdated: "2 hours ago",
        attendanceRate: 92.9
      },
      {
        id: "session_003",
        className: "Class 9A",
        subject: "Mathematics",
        time: "02:00 PM",
        duration: "50 min",
        studentsCount: 30,
        attendanceStatus: "in-progress",
        presentCount: 24,
        absentCount: 2,
        lateCount: 1,
        teacher: user?.name || "Teacher",
        location: "Room 102",
        date: new Date().toISOString().split('T')[0],
        lastUpdated: "15 minutes ago",
        attendanceRate: 80.0
      },
      {
        id: "session_004",
        className: "Class 11A",
        subject: "Advanced Mathematics",
        time: "10:00 AM",
        duration: "50 min",
        studentsCount: 25,
        attendanceStatus: "completed",
        presentCount: 23,
        absentCount: 1,
        lateCount: 1,
        teacher: user?.name || "Teacher",
        location: "Room 103",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
        lastUpdated: "1 day ago",
        attendanceRate: 92.0
      }
    ];
    setSessions(mockSessions);
  }, [user?.name]);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "pending" && session.attendanceStatus !== "completed") ||
      (filterStatus === "completed" && session.attendanceStatus === "completed");

    return matchesSearch && matchesFilter;
  });

  const todaySessions = sessions.filter(session => 
    session.date === new Date().toISOString().split('T')[0]
  );

  const metrics: AttendanceMetrics = {
    totalClasses: todaySessions.length,
    completedToday: todaySessions.filter(s => s.attendanceStatus === "completed").length,
    averageAttendance: todaySessions.length > 0 
      ? todaySessions.reduce((acc, s) => acc + s.attendanceRate, 0) / todaySessions.length 
      : 0,
    totalStudents: todaySessions.reduce((acc, s) => acc + s.studentsCount, 0),
    presentToday: todaySessions.reduce((acc, s) => acc + s.presentCount, 0),
    absentToday: todaySessions.reduce((acc, s) => acc + s.absentCount, 0),
    lateToday: todaySessions.reduce((acc, s) => acc + s.lateCount, 0),
    weeklyTrend: 5.2
  };

  const handleTakeAttendance = (session: ClassSession) => {
    setSelectedSession(session);
    setActiveView("take-attendance");
  };

  const handleEditAttendance = (session: ClassSession) => {
    setSelectedSession(session);
    setActiveView("edit");
  };

  const handleAttendanceComplete = (attendanceData: any) => {
    // Update session with completed attendance
    setSessions(prev => prev.map(session => 
      session.id === selectedSession?.id 
        ? { 
            ...session, 
            attendanceStatus: "completed" as const,
            lastUpdated: "just now",
            attendanceRate: (attendanceData.students.filter((s: any) => s.status === "present").length / attendanceData.students.length) * 100
          }
        : session
    ));
    
    setActiveView("dashboard");
    setSelectedSession(null);
    toast.success("Attendance completed successfully!");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  const getStatusIcon = (status: ClassSession['attendanceStatus']) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Timer className="h-4 w-4 text-yellow-600" />;
      case "not-started": return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ClassSession['attendanceStatus']) => {
    switch (status) {
      case "completed": return "bg-green-50 text-green-600 border-green-200";
      case "in-progress": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "not-started": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // Render different views based on activeView
  if (activeView === "take-attendance" && selectedSession) {
    return (
      <MobileTakeAttendanceFlow
        session={selectedSession}
        onBack={() => setActiveView("dashboard")}
        onComplete={handleAttendanceComplete}
        onPageChange={onPageChange}
      />
    );
  }

  if (activeView === "analytics") {
    return (
      <MobileAttendanceAnalytics
        onPageChange={onPageChange}
        onBack={() => setActiveView("dashboard")}
      />
    );
  }

  if (activeView === "reports") {
    return (
      <MobileAttendanceReports
        onPageChange={onPageChange}
        onBack={() => setActiveView("dashboard")}
      />
    );
  }

  if (activeView === "edit" && selectedSession) {
    return (
      <MobileTeacherAttendanceEdit
        session={selectedSession}
        onBack={() => setActiveView("dashboard")}
        onPageChange={onPageChange}
      />
    );
  }

  // Main dashboard view
  return (
    <MobilePageContent
      title="Attendance"
      subtitle="Manage your class attendance"
      showBack
      onBack={onBack}
      className="space-y-4"
      actions={
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 w-9 h-9"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      }
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                +{metrics.weeklyTrend}%
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {metrics.averageAttendance.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Attendance</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Activity className="h-4 w-4 text-secondary" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                Today
              </Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {metrics.completedToday}/{metrics.totalClasses}
              </div>
              <div className="text-sm text-muted-foreground">Classes Done</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card className="border-0 bg-gradient-to-r from-accent/5 to-chart-4/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-3 text-center">
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
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => setActiveView("analytics")}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => setActiveView("reports")}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs">Reports</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex-col space-y-1"
          onClick={() => toast.info("Settings coming soon!")}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["all", "pending", "completed"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={filterStatus === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(filter)}
                  className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Today's Classes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today's Classes</h3>
              <Badge variant="outline" className="text-xs">
                {todaySessions.length} classes
              </Badge>
            </div>

            <AnimatePresence>
              {filteredSessions.filter(session => 
                session.date === new Date().toISOString().split('T')[0]
              ).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">
                              {session.className} - {session.subject}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.time} ({session.duration})</span>
                              <span>•</span>
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{session.studentsCount} students</span>
                              {session.lastUpdated && (
                                <>
                                  <span>•</span>
                                  <span>Updated {session.lastUpdated}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <Badge className={`text-xs border ${getStatusColor(session.attendanceStatus)} flex-shrink-0`}>
                          {getStatusIcon(session.attendanceStatus)}
                          <span className="ml-1 capitalize">
                            {session.attendanceStatus === "not-started" ? "Pending" : session.attendanceStatus.replace("-", " ")}
                          </span>
                        </Badge>
                      </div>

                      {session.attendanceStatus === "completed" && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Attendance Rate</span>
                            <span className="font-medium">{session.attendanceRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={session.attendanceRate} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {session.attendanceStatus === "not-started" ? (
                          <Button
                            size="sm"
                            onClick={() => handleTakeAttendance(session)}
                            className="flex-1 text-xs h-8"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Take Attendance
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAttendance(session)}
                              className="flex-1 text-xs h-8"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info("View details coming soon!")}
                              className="flex-1 text-xs h-8"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSessions.filter(session => 
              session.date === new Date().toISOString().split('T')[0]
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No classes found for today</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          {/* Recent Classes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent Classes</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("reports")}
                className="text-xs"
              >
                View All Reports
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <AnimatePresence>
              {sessions.filter(session => 
                session.date !== new Date().toISOString().split('T')[0] && 
                session.attendanceStatus === "completed"
              ).slice(0, 5).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {session.subject.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h4 className="font-medium text-sm">{session.className}</h4>
                            <div className="text-xs text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} • {session.attendanceRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {session.presentCount}/{session.studentsCount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.lastUpdated}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </MobilePageContent>
  );
};