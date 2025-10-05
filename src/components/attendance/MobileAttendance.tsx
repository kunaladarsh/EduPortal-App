import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { MobileTeacherAttendanceMain } from "./MobileTeacherAttendanceMain";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  Plus,
  Edit,
  BarChart3,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late" | "excused";
  duration?: string;
  teacher?: string;
  note?: string;
}

interface MobileAttendanceProps {
  onPageChange?: (page: string) => void;
}

export const MobileAttendance: React.FC<MobileAttendanceProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"today" | "week" | "month">("today");

  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isStudent = user?.role === "student";

  // Redirect teachers to dedicated teacher attendance component
  if (isTeacher) {
    return (
      <MobileTeacherAttendanceMain 
        onPageChange={onPageChange} 
        onBack={() => onPageChange?.("dashboard")} 
      />
    );
  }

  // Mock data - for students
  const mockAttendance: AttendanceRecord[] = isTeacher ? [
    {
      id: "1",
      studentId: "s1",
      studentName: "Alice Johnson",
      studentAvatar: "",
      subject: "Mathematics",
      className: "Math 101",
      date: "2024-01-15",
      time: "09:00",
      status: "present",
      duration: "50 min"
    },
    {
      id: "2", 
      studentId: "s2",
      studentName: "Bob Smith",
      studentAvatar: "",
      subject: "Mathematics",
      className: "Math 101",
      date: "2024-01-15",
      time: "09:00",
      status: "late",
      duration: "50 min",
      note: "Arrived 10 minutes late"
    },
    {
      id: "3",
      studentId: "s3",
      studentName: "Carol Davis",
      studentAvatar: "",
      subject: "Mathematics", 
      className: "Math 101",
      date: "2024-01-15",
      time: "09:00",
      status: "absent",
      duration: "50 min",
      note: "Sick leave"
    },
    {
      id: "4",
      studentId: "s1",
      studentName: "Alice Johnson",
      studentAvatar: "",
      subject: "Physics",
      className: "Physics 201",
      date: "2024-01-15",
      time: "11:00",
      status: "present",
      duration: "50 min"
    }
  ] : [
    {
      id: "1",
      subject: "Mathematics",
      className: "Math 101",
      date: "2024-01-15",
      time: "09:00",
      status: "present",
      duration: "50 min",
      teacher: "Ms. Johnson"
    },
    {
      id: "2",
      subject: "Physics",
      className: "Physics 201", 
      date: "2024-01-15",
      time: "11:00",
      status: "present",
      duration: "50 min",
      teacher: "Dr. Smith"
    },
    {
      id: "3",
      subject: "English",
      className: "English 101",
      date: "2024-01-14",
      time: "14:00",
      status: "late",
      duration: "50 min",
      teacher: "Mr. Davis",
      note: "Traffic delay"
    },
    {
      id: "4",
      subject: "History",
      className: "History 101",
      date: "2024-01-14",
      time: "10:00",
      status: "absent",
      duration: "50 min",
      teacher: "Ms. Wilson",
      note: "Medical appointment"
    }
  ];

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case "present": return "text-green-600 bg-green-50 border-green-200";
      case "absent": return "text-red-600 bg-red-50 border-red-200";
      case "late": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "excused": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case "present": return <CheckCircle className="h-3 w-3" />;
      case "absent": return <XCircle className="h-3 w-3" />;
      case "late": return <AlertCircle className="h-3 w-3" />;
      case "excused": return <UserCheck className="h-3 w-3" />;
      default: return <UserX className="h-3 w-3" />;
    }
  };

  const filteredAttendance = mockAttendance.filter(record => {
    if (selectedClass !== "all" && record.className !== selectedClass) return false;
    if (searchQuery && !record.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.className.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    const recordDate = new Date(record.date);
    const today = new Date();
    
    if (viewMode === "today") {
      return record.date === today.toISOString().split('T')[0];
    } else if (viewMode === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return recordDate >= weekAgo && recordDate <= today;
    }
    
    return true;
  });

  const classes = [...new Set(mockAttendance.map(r => r.className))];

  const getAttendanceStats = () => {
    const total = mockAttendance.length;
    const present = mockAttendance.filter(r => r.status === "present").length;
    const absent = mockAttendance.filter(r => r.status === "absent").length;
    const late = mockAttendance.filter(r => r.status === "late").length;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;
    
    return { total, present, absent, late, attendanceRate };
  };

  const stats = getAttendanceStats();

  const todayClasses = isTeacher 
    ? [...new Set(mockAttendance.filter(r => r.date === new Date().toISOString().split('T')[0]).map(r => r.className))]
    : mockAttendance.filter(r => r.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isTeacher ? "Track student attendance" : "Your attendance record"}
          </p>
        </div>
        
        {isTeacher && (
          <Button size="sm" className="rounded-full p-2 w-10 h-10">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Attendance Overview */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{isTeacher ? "Class" : "Your"} Attendance Rate</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{stats.attendanceRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                {stats.present}/{stats.total} sessions
              </div>
            </div>
          </div>
          
          <Progress value={stats.attendanceRate} className="mb-3" />
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">{stats.present}</div>
              <div className="text-xs text-green-600">Present</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{stats.late}</div>
              <div className="text-xs text-yellow-600">Late</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600">{stats.absent}</div>
              <div className="text-xs text-red-600">Absent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes (for students) or Quick Action (for teachers) */}
      {!isTeacher && todayClasses.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-accent/5 to-chart-4/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayClasses.slice(0, 3).map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{record.className}</div>
                    <div className="text-xs text-muted-foreground">{record.time}</div>
                  </div>
                </div>
                <Badge className={`text-xs border ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                  <span className="ml-1 capitalize">{record.status}</span>
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>

        {/* View mode and class filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["today", "week", "month"].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode as any)}
              className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>

        {/* Class filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedClass === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedClass("all")}
            className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
          >
            All Classes
          </Button>
          {classes.map((className) => (
            <Button
              key={className}
              variant={selectedClass === className ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedClass(className)}
              className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
            >
              {className}
            </Button>
          ))}
        </div>
      </div>

      {/* Attendance Records */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Attendance Records</h3>
          <span className="text-sm text-muted-foreground">{filteredAttendance.length} records</span>
        </div>

        <AnimatePresence>
          {filteredAttendance.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No attendance records found</p>
            </motion.div>
          ) : (
            filteredAttendance.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {isTeacher && record.studentName && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={record.studentAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {record.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{record.className}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{record.time}</span>
                            {record.duration && (
                              <>
                                <span>•</span>
                                <span>{record.duration}</span>
                              </>
                            )}
                          </div>
                          
                          {isTeacher && record.studentName && (
                            <div className="text-xs text-muted-foreground mb-2">
                              Student: {record.studentName}
                            </div>
                          )}
                          
                          {!isTeacher && record.teacher && (
                            <div className="text-xs text-muted-foreground mb-2">
                              Teacher: {record.teacher}
                            </div>
                          )}

                          {record.note && (
                            <div className="text-xs text-muted-foreground italic">
                              Note: {record.note}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Badge className={`text-xs border ${getStatusColor(record.status)} flex-shrink-0`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                    </div>

                    {isTeacher && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                          <Users className="h-3 w-3 mr-1" />
                          View Class
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Weekly Summary */}
      <Card className="border-0 bg-gradient-to-r from-chart-2/5 to-chart-3/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">This Week Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-chart-2">5/7</div>
              <div className="text-xs text-muted-foreground">Days Attended</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">92%</div>
              <div className="text-xs text-muted-foreground">Weekly Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};