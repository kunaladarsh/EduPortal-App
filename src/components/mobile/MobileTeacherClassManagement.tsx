import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Award,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  School,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Star,
  MapPin,
  Save,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner@2.0.3";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  attendance: number;
  averageGrade: number;
  status: "active" | "inactive" | "pending";
  lastActivity: string;
}

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  location: string;
  totalStudents: number;
  averageGrade: number;
  attendanceRate: number;
  nextSession: string;
  description: string;
  semester: string;
  credits: number;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "active" | "completed" | "overdue";
  submissionRate: number;
  averageScore?: number;
}

interface MobileTeacherClassManagementProps {
  onPageChange?: (page: string) => void;
}

const mockClasses: ClassInfo[] = [
  {
    id: "1",
    name: "Mathematics 10A",
    subject: "Mathematics",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    location: "Room 101",
    totalStudents: 25,
    averageGrade: 87.5,
    attendanceRate: 92,
    nextSession: "2024-01-23T09:00:00",
    description: "Advanced algebra and geometry concepts for grade 10 students",
    semester: "Spring 2024",
    credits: 4
  },
  {
    id: "2",
    name: "Physics 11B",
    subject: "Physics",
    schedule: "Tue, Thu - 11:00 AM",
    location: "Lab 203",
    totalStudents: 22,
    averageGrade: 85.2,
    attendanceRate: 89,
    nextSession: "2024-01-23T11:00:00",
    description: "Mechanics and thermodynamics for grade 11 students",
    semester: "Spring 2024",
    credits: 4
  },
  {
    id: "3",
    name: "Calculus AP",
    subject: "Mathematics",
    schedule: "Daily - 2:00 PM",
    location: "Room 205",
    totalStudents: 18,
    averageGrade: 91.8,
    attendanceRate: 96,
    nextSession: "2024-01-23T14:00:00",
    description: "Advanced Placement Calculus preparation course",
    semester: "Spring 2024",
    credits: 5
  }
];

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@school.edu",
    enrollmentDate: "2024-01-15",
    attendance: 95,
    averageGrade: 92,
    status: "active",
    lastActivity: "2024-01-22"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@school.edu",
    enrollmentDate: "2024-01-15",
    attendance: 87,
    averageGrade: 85,
    status: "active",
    lastActivity: "2024-01-21"
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@school.edu",
    enrollmentDate: "2024-01-15",
    attendance: 100,
    averageGrade: 96,
    status: "active",
    lastActivity: "2024-01-22"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    enrollmentDate: "2024-01-18",
    attendance: 80,
    averageGrade: 78,
    status: "pending",
    lastActivity: "2024-01-20"
  }
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Quadratic Equations Test",
    dueDate: "2024-01-25",
    status: "active",
    submissionRate: 75,
    averageScore: 87
  },
  {
    id: "2",
    title: "Physics Lab Report",
    dueDate: "2024-01-28",
    status: "active",
    submissionRate: 60
  },
  {
    id: "3",
    title: "Calculus Problem Set 5",
    dueDate: "2024-01-20",
    status: "overdue",
    submissionRate: 95,
    averageScore: 91
  }
];

export const MobileTeacherClassManagement: React.FC<MobileTeacherClassManagementProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "classes" | "class-details" | "students" | "assignments" | "create-class" | "add-student">("overview");
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>(mockClasses);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  
  // Form states
  const [classForm, setClassForm] = useState({
    name: "",
    subject: "",
    schedule: "",
    location: "",
    description: "", 
    semester: "Spring 2024",
    credits: 3
  });
  
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    status: "active" as "active" | "inactive" | "pending"
  });

  const handleCreateClass = () => {
    if (!classForm.name || !classForm.subject || !classForm.schedule || !classForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newClass: ClassInfo = {
      id: Date.now().toString(),
      name: classForm.name,
      subject: classForm.subject,
      schedule: classForm.schedule,
      location: classForm.location,
      description: classForm.description,
      semester: classForm.semester,
      credits: classForm.credits,
      totalStudents: 0,
      averageGrade: 0,
      attendanceRate: 0,
      nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    setClasses([...classes, newClass]);
    setClassForm({
      name: "",
      subject: "",
      schedule: "",
      location: "",
      description: "",
      semester: "Spring 2024",
      credits: 3
    });
    toast.success("Class created successfully!");
    setCurrentView("classes");
  };

  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: studentForm.name,
      email: studentForm.email,
      status: studentForm.status,
      enrollmentDate: new Date().toISOString().split('T')[0],
      attendance: 0,
      averageGrade: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setStudents([...students, newStudent]);
    setStudentForm({
      name: "",
      email: "",
      status: "active"
    });
    toast.success("Student added successfully!");
    setCurrentView("students");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-600 border-green-200";
      case "inactive": return "bg-gray-50 text-gray-600 border-gray-200";
      case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "inactive": return <AlertCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntilNext = (nextSession: string) => {
    const now = new Date();
    const session = new Date(nextSession);
    const diffMs = session.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  // Overview
  if (currentView === "overview") {
    const totalStudents = classes.reduce((sum, cls) => sum + cls.totalStudents, 0);
    const averageAttendance = Math.round(
      classes.reduce((sum, cls) => sum + cls.attendanceRate, 0) / classes.length
    );
    const averageGrade = Math.round(
      classes.reduce((sum, cls) => sum + cls.averageGrade, 0) / classes.length * 10
    ) / 10;

    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and students
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold text-primary">{classes.length}</div>
              <div className="text-xs text-muted-foreground">Classes</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold text-blue-600">{totalStudents}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">{averageAttendance}%</div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-xl font-bold text-yellow-600">{averageGrade}</div>
              <div className="text-xs text-muted-foreground">Avg Grade</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card 
            className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("classes")}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm">View Classes</div>
              <div className="text-xs text-muted-foreground">Manage classes</div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("students")}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="font-semibold text-sm">All Students</div>
              <div className="text-xs text-muted-foreground">View students</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Upcoming Classes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("classes")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {classes.slice(0, 3).map((classInfo, index) => (
              <motion.div
                key={classInfo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => {
                  setSelectedClass(classInfo);
                  setCurrentView("class-details");
                }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{classInfo.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{classInfo.location}</span>
                          <span>•</span>
                          <span>Next: {getTimeUntilNext(classInfo.nextSession)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{classInfo.totalStudents}</div>
                        <div className="text-xs text-muted-foreground">students</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Class Average</span>
                <Badge variant="outline" className={getGradeColor(averageGrade)}>{averageGrade}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance Rate</span>
                <Badge variant="outline" className="text-green-600">{averageAttendance}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Assignments</span>
                <Badge variant="outline">{mockAssignments.filter(a => a.status === "active").length}</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Classes List
  if (currentView === "classes") {
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
            <h1 className="text-xl font-bold">My Classes</h1>
            <p className="text-sm text-muted-foreground">{classes.length} classes</p>
          </div>
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setCurrentView("create-class")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {classes.map((classInfo, index) => (
              <motion.div
                key={classInfo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  setSelectedClass(classInfo);
                  setCurrentView("class-details");
                }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm line-clamp-1">{classInfo.name}</h3>
                          <Button variant="ghost" size="sm" className="p-1 ml-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {classInfo.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{classInfo.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{classInfo.location}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-sm font-bold text-blue-600">{classInfo.totalStudents}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${getGradeColor(classInfo.averageGrade)}`}>
                              {classInfo.averageGrade}%
                            </div>
                            <div className="text-xs text-muted-foreground">Avg Grade</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-green-600">{classInfo.attendanceRate}%</div>
                            <div className="text-xs text-muted-foreground">Attendance</div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Performance</span>
                            <span>{classInfo.averageGrade}%</span>
                          </div>
                          <Progress value={classInfo.averageGrade} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Class Details
  if (currentView === "class-details" && selectedClass) {
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
            onClick={() => setCurrentView("classes")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold line-clamp-2">{selectedClass.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedClass.subject}</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Class Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-bold">{selectedClass.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedClass.semester}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{selectedClass.totalStudents}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{selectedClass.credits}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-xl font-bold text-yellow-600">{selectedClass.averageGrade}%</div>
              <div className="text-xs text-muted-foreground">Average Grade</div>
            </CardContent>
          </Card>
          
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-600">{selectedClass.attendanceRate}%</div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Class Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Schedule</span>
                </div>
                <span className="text-sm font-medium">{selectedClass.schedule}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Location</span>
                </div>
                <span className="text-sm font-medium">{selectedClass.location}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next Session</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDate(selectedClass.nextSession)} at {formatTime(selectedClass.nextSession)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Semester</span>
                </div>
                <span className="text-sm font-medium">{selectedClass.semester}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => setCurrentView("students")}
          >
            <Users className="h-4 w-4 mr-2" />
            Students
          </Button>
          <Button 
            className="h-12"
            onClick={() => onPageChange?.("class-details")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Class
          </Button>
        </motion.div>

        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Students</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("students")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {students.slice(0, 3).map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                        <AvatarFallback className="text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{student.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Grade: {student.averageGrade}%</span>
                          <span>•</span>
                          <span>Attendance: {student.attendance}%</span>
                        </div>
                      </div>
                      <Badge className={`text-xs border ${getStatusColor(student.status)}`}>
                        {student.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Students List
  if (currentView === "students") {
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
            <h1 className="text-xl font-bold">All Students</h1>
            <p className="text-sm text-muted-foreground">{students.length} students</p>
          </div>
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setCurrentView("add-student")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {students
              .filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                        <AvatarFallback className="text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-sm line-clamp-1">{student.name}</h3>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                          <Badge className={`text-xs border ${getStatusColor(student.status)}`}>
                            {getStatusIcon(student.status)}
                            <span className="ml-1">{student.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-center mb-3">
                          <div>
                            <div className={`text-sm font-bold ${getGradeColor(student.averageGrade)}`}>
                              {student.averageGrade}%
                            </div>
                            <div className="text-xs text-muted-foreground">Grade</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-green-600">{student.attendance}%</div>
                            <div className="text-xs text-muted-foreground">Attendance</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-blue-600">
                              {formatDate(student.enrollmentDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">Enrolled</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Last activity: {formatDate(student.lastActivity)}</span>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Quick Action to Add Student */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("add-student")}
          >
            <CardContent className="p-4 text-center">
              <UserPlus className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="font-semibold text-sm">Add New Student</div>
              <div className="text-xs text-muted-foreground">Create a new student profile</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Create Class
  if (currentView === "create-class") {
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
            <h1 className="text-xl font-bold">Create Class</h1>
            <p className="text-sm text-muted-foreground">Add a new class</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Class Name</h4>
                  <Input
                    type="text"
                    value={classForm.name}
                    onChange={e => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Subject</h4>
                  <Input
                    type="text"
                    value={classForm.subject}
                    onChange={e => setClassForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Schedule</h4>
                  <Input
                    type="text"
                    value={classForm.schedule}
                    onChange={e => setClassForm(prev => ({ ...prev, schedule: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Location</h4>
                  <Input
                    type="text"
                    value={classForm.location}
                    onChange={e => setClassForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Description</h4>
                  <Textarea
                    value={classForm.description}
                    onChange={e => setClassForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Semester</h4>
                  <Input
                    type="text"
                    value={classForm.semester}
                    onChange={e => setClassForm(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Credits</h4>
                  <Input
                    type="number"
                    value={classForm.credits}
                    onChange={e => setClassForm(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            variant="outline"
            className="h-12"
            onClick={handleCreateClass}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Class
          </Button>
          <Button
            className="h-12"
            onClick={() => setCurrentView("overview")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </motion.div>
      </div>
    );
  }

  // Add Student
  if (currentView === "add-student") {
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
            <h1 className="text-xl font-bold">Add Student</h1>
            <p className="text-sm text-muted-foreground">Add a new student</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Name</h4>
                  <Input
                    type="text"
                    value={studentForm.name}
                    onChange={e => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Email</h4>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={e => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-sm">Status</h4>
                  <Select
                    value={studentForm.status}
                    onValueChange={(value) => setStudentForm(prev => ({ ...prev, status: value as "active" | "inactive" | "pending" }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            variant="outline"
            className="h-12"
            onClick={handleAddStudent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
          <Button
            className="h-12"
            onClick={() => setCurrentView("overview")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};