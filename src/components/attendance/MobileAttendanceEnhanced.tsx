import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Filter,
  Plus,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  User,
  BookOpen,
  Target,
  Edit,
  UserCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { MobilePageContent } from "../shared/MobilePageContent";
import { MobileTakeAttendanceFlow } from "./MobileTakeAttendanceFlow";
import { MobileTeacherAttendanceEdit } from "./MobileTeacherAttendanceEdit";

interface MobileAttendanceEnhancedProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  avatar?: string;
  status: "present" | "absent" | "late" | "excused";
  timestamp: string;
  class: string;
  subject: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}

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
}

export const MobileAttendanceEnhanced: React.FC<
  MobileAttendanceEnhancedProps
> = ({ onPageChange, onBack }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<
    | "overview"
    | "take-attendance"
    | "edit-attendance"
    | "analytics"
  >("overview");
  const [selectedSession, setSelectedSession] =
    useState<ClassSession | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "present" | "absent" | "late"
  >("all");
  const [refreshing, setRefreshing] = useState(false);

  const isTeacher =
    user?.role === "teacher" || user?.role === "admin";
  const isStudent = user?.role === "student";

  // Mock data for different roles
  const mockStats: AttendanceStats = isStudent
    ? {
        totalDays: 45,
        presentDays: 42,
        absentDays: 2,
        lateDays: 1,
        percentage: 93.3,
      }
    : {
        totalDays: 45,
        presentDays: 384,
        absentDays: 42,
        lateDays: 24,
        percentage: 85.3,
      };

  const mockClassSessions: ClassSession[] = isTeacher
    ? [
        {
          id: "1",
          className: "Mathematics 10A",
          subject: "Algebra Basics",
          time: "09:00 AM",
          duration: "50 min",
          studentsCount: 28,
          attendanceStatus: "in-progress",
          presentCount: 24,
          absentCount: 3,
          lateCount: 1,
        },
        {
          id: "2",
          className: "Mathematics 10B",
          subject: "Geometry",
          time: "11:00 AM",
          duration: "50 min",
          studentsCount: 25,
          attendanceStatus: "not-started",
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
        },
        {
          id: "3",
          className: "Physics 11A",
          subject: "Motion & Force",
          time: "02:00 PM",
          duration: "60 min",
          studentsCount: 22,
          attendanceStatus: "completed",
          presentCount: 20,
          absentCount: 1,
          lateCount: 1,
        },
      ]
    : [
        {
          id: "1",
          className: "Mathematics",
          subject: "Today's Lesson",
          time: "09:00 AM",
          duration: "50 min",
          studentsCount: 1,
          attendanceStatus: "completed",
          presentCount: 1,
          absentCount: 0,
          lateCount: 0,
        },
        {
          id: "2",
          className: "Physics",
          subject: "Today's Lesson",
          time: "11:00 AM",
          duration: "50 min",
          studentsCount: 1,
          attendanceStatus: "not-started",
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
        },
      ];

  const mockAttendanceRecords: AttendanceRecord[] = isStudent
    ? [
        {
          id: "1",
          studentId: user?.id || "student-1",
          studentName: user?.name || "Student",
          status: "present",
          timestamp: "2024-01-22T09:05:00",
          class: "Mathematics",
          subject: "Algebra",
        },
        {
          id: "2",
          studentId: user?.id || "student-1",
          studentName: user?.name || "Student",
          status: "late",
          timestamp: "2024-01-21T09:15:00",
          class: "Physics",
          subject: "Motion",
        },
      ]
    : [
        {
          id: "1",
          studentId: "s1",
          studentName: "Alice Johnson",
          avatar: "",
          status: "present",
          timestamp: "2024-01-22T09:05:00",
          class: "Mathematics 10A",
          subject: "Algebra",
        },
        {
          id: "2",
          studentId: "s2",
          studentName: "Bob Smith",
          avatar: "",
          status: "late",
          timestamp: "2024-01-22T09:15:00",
          class: "Mathematics 10A",
          subject: "Algebra",
        },
        {
          id: "3",
          studentId: "s3",
          studentName: "Carol Davis",
          avatar: "",
          status: "absent",
          timestamp: "2024-01-22T09:00:00",
          class: "Mathematics 10A",
          subject: "Algebra",
        },
      ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredRecords = mockAttendanceRecords.filter(
    (record) => {
      if (
        selectedFilter !== "all" &&
        record.status !== selectedFilter
      )
        return false;
      if (
        searchQuery &&
        !record.studentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !record.class
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    },
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50 text-green-600 border-green-200";
      case "absent":
        return "bg-red-50 text-red-600 border-red-200";
      case "late":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "excused":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "in-progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "not-started":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-3 w-3" />;
      case "absent":
        return <XCircle className="h-3 w-3" />;
      case "late":
        return <Clock className="h-3 w-3" />;
      case "excused":
        return <UserCheck className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const handleSessionAction = (
    session: ClassSession,
    action: "take" | "edit",
  ) => {
    setSelectedSession(session);
    if (action === "take") {
      setCurrentView("take-attendance");
    } else {
      setCurrentView("edit-attendance");
    }
  };

  if (currentView === "take-attendance" && selectedSession) {
    return (
      <MobileTakeAttendanceFlow
        session={selectedSession}
        onBack={() => {
          setCurrentView("overview");
          setSelectedSession(null);
        }}
        onComplete={(attendanceData) => {
          console.log("Attendance completed:", attendanceData);
          setCurrentView("overview");
          setSelectedSession(null);
        }}
        onPageChange={onPageChange}
      />
    );
  }

  if (currentView === "edit-attendance" && selectedSession) {
    return (
      <MobileTeacherAttendanceEdit
        session={selectedSession}
        onBack={() => {
          setCurrentView("overview");
          setSelectedSession(null);
        }}
        onSave={(attendanceData) => {
          console.log("Attendance updated:", attendanceData);
          setCurrentView("overview");
          setSelectedSession(null);
        }}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <MobilePageContent
      title="Attendance"
      showBack
      onBack={onBack}
      className="space-y-4"
      actions={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 w-9 h-9"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>

          {isTeacher && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("analytics")}
              className="p-2 w-9 h-9"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}
        </div>
      }
    >
      {/* Attendance Statistics */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">
                {isStudent
                  ? "Your Attendance Rate"
                  : "Overall Attendance Rate"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {mockStats.percentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {mockStats.presentDays}/{mockStats.totalDays}{" "}
                {isStudent ? "sessions" : "total"}
              </div>
            </div>
          </div>

          <Progress
            value={mockStats.percentage}
            className="mb-4"
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {mockStats.presentDays}
              </div>
              <div className="text-xs text-green-600">
                Present
              </div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {mockStats.lateDays}
              </div>
              <div className="text-xs text-yellow-600">
                Late
              </div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {mockStats.absentDays}
              </div>
              <div className="text-xs text-red-600">Absent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes for Teachers */}
      {isTeacher && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Classes
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {mockClassSessions.length} sessions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {mockClassSessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/50 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {session.className}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {session.subject}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.studentsCount} students
                          </span>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs border ${getStatusColor(session.attendanceStatus)} flex-shrink-0`}
                      >
                        {session.attendanceStatus ===
                          "not-started" && "Not Started"}
                        {session.attendanceStatus ===
                          "in-progress" && "In Progress"}
                        {session.attendanceStatus ===
                          "completed" && "Completed"}
                      </Badge>
                    </div>

                    {session.attendanceStatus !==
                      "not-started" && (
                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="font-semibold text-green-600">
                            {session.presentCount}
                          </div>
                          <div className="text-green-600">
                            Present
                          </div>
                        </div>
                        <div className="text-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <div className="font-semibold text-yellow-600">
                            {session.lateCount}
                          </div>
                          <div className="text-yellow-600">
                            Late
                          </div>
                        </div>
                        <div className="text-center p-1 bg-red-50 dark:bg-red-900/20 rounded">
                          <div className="font-semibold text-red-600">
                            {session.absentCount}
                          </div>
                          <div className="text-red-600">
                            Absent
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {session.attendanceStatus ===
                        "not-started" && (
                        <Button
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() =>
                            handleSessionAction(session, "take")
                          }
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Take Attendance
                        </Button>
                      )}

                      {session.attendanceStatus ===
                        "in-progress" && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 text-xs h-7"
                            onClick={() =>
                              handleSessionAction(
                                session,
                                "take",
                              )
                            }
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Continue
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-7"
                            onClick={() =>
                              handleSessionAction(
                                session,
                                "edit",
                              )
                            }
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </>
                      )}

                      {session.attendanceStatus ===
                        "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() =>
                            handleSessionAction(session, "edit")
                          }
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Attendance
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}

      {/* Recent Attendance Records */}

      {/* Quick Actions for Students */}
      {isStudent && (
        <Card className="border-0 bg-gradient-to-r from-accent/5 to-chart-4/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => onPageChange("calendar")}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">View Calendar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => setCurrentView("analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </MobilePageContent>
  );
};