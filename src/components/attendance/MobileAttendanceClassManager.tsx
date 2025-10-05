import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Users, BookOpen, Calendar, Clock, Plus, Search, Filter,
  MapPin, Star, TrendingUp, TrendingDown, Award, AlertTriangle,
  Edit, Eye, MoreVertical, Settings, Target, Activity,
  CheckCircle, XCircle, Timer, Bell, Phone, Mail
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface ClassDetails {
  id: string;
  name: string;
  subject: string;
  grade: string;
  studentsCount: number;
  averageAttendance: number;
  schedule: {
    day: string;
    time: string;
    duration: string;
    location: string;
  }[];
  lastSession: string;
  totalSessions: number;
  completedSessions: number;
  upcomingSession?: {
    date: string;
    time: string;
    location: string;
  };
  performance: {
    excellent: number;
    good: number;
    warning: number;
    critical: number;
  };
  recentTrend: "up" | "down" | "stable";
  trendValue: number;
}

interface StudentPerformance {
  id: string;
  name: string;
  enrollmentNumber: string;
  avatar?: string;
  attendanceRate: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalSessions: number;
  lastAttendance: string;
  status: "excellent" | "good" | "warning" | "critical";
  parentContact?: string;
  recentPattern: "improving" | "declining" | "stable";
}

interface MobileAttendanceClassManagerProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
  selectedClassId?: string;
}

export const MobileAttendanceClassManager: React.FC<MobileAttendanceClassManagerProps> = ({
  onPageChange,
  onBack,
  selectedClassId
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("classes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null);

  // Mock classes data
  const classes: ClassDetails[] = [
    {
      id: "class_001",
      name: "Class 10A",
      subject: "Mathematics",
      grade: "10",
      studentsCount: 32,
      averageAttendance: 92.5,
      schedule: [
        { day: "Monday", time: "09:00 AM", duration: "50 min", location: "Room 101" },
        { day: "Wednesday", time: "11:00 AM", duration: "50 min", location: "Room 101" },
        { day: "Friday", time: "02:00 PM", duration: "50 min", location: "Room 101" }
      ],
      lastSession: "2 hours ago",
      totalSessions: 45,
      completedSessions: 42,
      upcomingSession: {
        date: "Tomorrow",
        time: "09:00 AM",
        location: "Room 101"
      },
      performance: {
        excellent: 24,
        good: 6,
        warning: 2,
        critical: 0
      },
      recentTrend: "up",
      trendValue: 3.2
    },
    {
      id: "class_002",
      name: "Class 10B",
      subject: "Mathematics",
      grade: "10",
      studentsCount: 28,
      averageAttendance: 88.7,
      schedule: [
        { day: "Tuesday", time: "10:00 AM", duration: "50 min", location: "Room 102" },
        { day: "Thursday", time: "01:00 PM", duration: "50 min", location: "Room 102" },
        { day: "Saturday", time: "09:00 AM", duration: "50 min", location: "Room 102" }
      ],
      lastSession: "1 day ago",
      totalSessions: 43,
      completedSessions: 40,
      upcomingSession: {
        date: "Today",
        time: "01:00 PM",
        location: "Room 102"
      },
      performance: {
        excellent: 18,
        good: 7,
        warning: 2,
        critical: 1
      },
      recentTrend: "down",
      trendValue: 1.8
    },
    {
      id: "class_003",
      name: "Class 9A",
      subject: "Mathematics",
      grade: "9",
      studentsCount: 30,
      averageAttendance: 94.8,
      schedule: [
        { day: "Monday", time: "02:00 PM", duration: "50 min", location: "Room 103" },
        { day: "Wednesday", time: "09:00 AM", duration: "50 min", location: "Room 103" },
        { day: "Friday", time: "10:00 AM", duration: "50 min", location: "Room 103" }
      ],
      lastSession: "3 hours ago",
      totalSessions: 40,
      completedSessions: 38,
      upcomingSession: {
        date: "Tomorrow",
        time: "02:00 PM",
        location: "Room 103"
      },
      performance: {
        excellent: 27,
        good: 3,
        warning: 0,
        critical: 0
      },
      recentTrend: "stable",
      trendValue: 0.5
    }
  ];

  // Mock student performance data
  const studentsPerformance: StudentPerformance[] = [
    {
      id: "student_001",
      name: "Alice Johnson",
      enrollmentNumber: "STU2024001",
      attendanceRate: 98.5,
      presentCount: 39,
      absentCount: 1,
      lateCount: 2,
      totalSessions: 42,
      lastAttendance: "Present - Today",
      status: "excellent",
      parentContact: "+1234567890",
      recentPattern: "stable"
    },
    {
      id: "student_002",
      name: "Bob Smith",
      enrollmentNumber: "STU2024002",
      attendanceRate: 85.7,
      presentCount: 36,
      absentCount: 4,
      lateCount: 2,
      totalSessions: 42,
      lastAttendance: "Absent - Yesterday",
      status: "good",
      parentContact: "+1234567891",
      recentPattern: "declining"
    },
    {
      id: "student_003",
      name: "Carol Davis",
      enrollmentNumber: "STU2024003",
      attendanceRate: 76.2,
      presentCount: 32,
      absentCount: 8,
      lateCount: 2,
      totalSessions: 42,
      lastAttendance: "Late - 2 days ago",
      status: "warning",
      parentContact: "+1234567892",
      recentPattern: "improving"
    }
  ];

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Timer className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-700 border-green-200";
      case "good": return "bg-blue-100 text-blue-700 border-blue-200";
      case "warning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <Star className="w-3 w-3" />;
      case "good": return <CheckCircle className="w-3 h-3" />;
      case "warning": return <AlertTriangle className="w-3 h-3" />;
      case "critical": return <XCircle className="w-3 h-3" />;
      default: return <Timer className="w-3 h-3" />;
    }
  };

  const handleClassSelect = (classItem: ClassDetails) => {
    setSelectedClass(classItem);
    setActiveTab("details");
  };

  const handleStudentSelect = (student: StudentPerformance) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleTakeAttendance = (classItem: ClassDetails) => {
    toast.success(`Starting attendance for ${classItem.name}`);
    // This would navigate to the take attendance flow
    onPageChange("take-attendance");
  };

  const handleContactParent = (student: StudentPerformance) => {
    if (student.parentContact) {
      toast.success(`Calling ${student.name}'s parent...`);
    } else {
      toast.error("No parent contact available");
    }
  };

  return (
    <MobilePageContent
      title="Class Management"
      subtitle="Manage your classes and student attendance"
      showBack
      onBack={onBack}
      className="space-y-4"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="students">All Students</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 mt-4">
          {/* Search */}
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

          {/* Classes Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Classes ({filteredClasses.length})</h3>
              <Button size="sm" variant="outline" className="rounded-full text-xs px-4">
                <Plus className="h-3 w-3 mr-1" />
                Add Class
              </Button>
            </div>

            <AnimatePresence>
              {filteredClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
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
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{classItem.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Grade {classItem.grade}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {classItem.subject} • {classItem.studentsCount} students
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Last session: {classItem.lastSession}</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTakeAttendance(classItem)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Take Attendance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleClassSelect(classItem)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Class
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Attendance Rate */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Attendance Rate</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{classItem.averageAttendance}%</span>
                            <div className={getTrendColor(classItem.recentTrend)}>
                              {getTrendIcon(classItem.recentTrend)}
                            </div>
                            <span className={`text-xs ${getTrendColor(classItem.recentTrend)}`}>
                              {classItem.trendValue}%
                            </span>
                          </div>
                        </div>
                        <Progress value={classItem.averageAttendance} className="h-2" />
                      </div>

                      {/* Performance Distribution */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="text-sm font-semibold text-green-600">
                            {classItem.performance.excellent}
                          </div>
                          <div className="text-xs text-green-600">Excellent</div>
                        </div>
                        <div className="text-center p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="text-sm font-semibold text-blue-600">
                            {classItem.performance.good}
                          </div>
                          <div className="text-xs text-blue-600">Good</div>
                        </div>
                        <div className="text-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <div className="text-sm font-semibold text-yellow-600">
                            {classItem.performance.warning}
                          </div>
                          <div className="text-xs text-yellow-600">Warning</div>
                        </div>
                        <div className="text-center p-1 bg-red-50 dark:bg-red-900/20 rounded">
                          <div className="text-sm font-semibold text-red-600">
                            {classItem.performance.critical}
                          </div>
                          <div className="text-xs text-red-600">Critical</div>
                        </div>
                      </div>

                      {/* Next Session */}
                      {classItem.upcomingSession && (
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-accent" />
                              <span className="font-medium">Next: {classItem.upcomingSession.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{classItem.upcomingSession.time}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleTakeAttendance(classItem)}
                          className="flex-1 text-xs h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Take Attendance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClassSelect(classItem)}
                          className="flex-1 text-xs h-8"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredClasses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No classes found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-4">
          {/* Students List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">All Students</h3>
              <Badge variant="outline" className="text-xs">
                {studentsPerformance.length} students
              </Badge>
            </div>

            <AnimatePresence>
              {studentsPerformance.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{student.name}</h4>
                            <Badge className={`text-xs border ${getStatusColor(student.status)}`}>
                              {getStatusIcon(student.status)}
                              <span className="ml-1 capitalize">{student.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.enrollmentNumber} • {student.attendanceRate}% attendance
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.lastAttendance}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {student.presentCount}/{student.totalSessions}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Present
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStudentSelect(student)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContactParent(student)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Contact Parent
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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