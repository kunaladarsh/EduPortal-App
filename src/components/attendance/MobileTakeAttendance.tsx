import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  CheckCircle, XCircle, Clock, Users, Save, 
  ArrowLeft, Search, Filter, RotateCcw, AlertCircle,
  User, Check, X, Timer, BookOpen
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface MobileTakeAttendanceProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
  classId?: string;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  status: "present" | "absent" | "late" | "not_marked";
  previousAttendance: number; // percentage
}

export const MobileTakeAttendance: React.FC<MobileTakeAttendanceProps> = ({ 
  onPageChange, 
  onBack,
  classId 
}) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [classInfo] = useState({
    name: "Class 10A",
    subject: "Mathematics",
    period: "Period 3",
    time: "10:00 AM - 10:45 AM"
  });

  // Mock student data
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        rollNumber: "001",
        avatar: "",
        status: "not_marked",
        previousAttendance: 95
      },
      {
        id: "2", 
        name: "Bob Smith",
        rollNumber: "002",
        avatar: "",
        status: "not_marked",
        previousAttendance: 87
      },
      {
        id: "3",
        name: "Carol Davis", 
        rollNumber: "003",
        avatar: "",
        status: "not_marked",
        previousAttendance: 92
      },
      {
        id: "4",
        name: "David Wilson",
        rollNumber: "004", 
        avatar: "",
        status: "not_marked",
        previousAttendance: 78
      },
      {
        id: "5",
        name: "Emma Thompson",
        rollNumber: "005",
        avatar: "",
        status: "not_marked", 
        previousAttendance: 98
      },
      {
        id: "6",
        name: "Frank Miller",
        rollNumber: "006",
        avatar: "",
        status: "not_marked",
        previousAttendance: 84
      },
      {
        id: "7",
        name: "Grace Lee",
        rollNumber: "007",
        avatar: "",
        status: "not_marked",
        previousAttendance: 91
      },
      {
        id: "8",
        name: "Henry Chen",
        rollNumber: "008", 
        avatar: "",
        status: "not_marked",
        previousAttendance: 88
      },
      {
        id: "9",
        name: "Isabella Rodriguez",
        rollNumber: "009",
        avatar: "",
        status: "not_marked",
        previousAttendance: 96
      },
      {
        id: "10",
        name: "Jack Brown",
        rollNumber: "010",
        avatar: "",
        status: "not_marked",
        previousAttendance: 82
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery)
  );

  const getAttendanceStats = () => {
    const total = students.length;
    const present = students.filter(s => s.status === "present").length;
    const absent = students.filter(s => s.status === "absent").length; 
    const late = students.filter(s => s.status === "late").length;
    const notMarked = students.filter(s => s.status === "not_marked").length;
    const marked = total - notMarked;
    const progress = total > 0 ? (marked / total) * 100 : 0;
    
    return { total, present, absent, late, notMarked, marked, progress };
  };

  const stats = getAttendanceStats();

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => 
      student.status === "not_marked" ? { ...student, status: "present" } : student
    ));
    toast.success("Marked all remaining students as present");
  };

  const resetAttendance = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: "not_marked" })));
    toast.success("Attendance reset");
  };

  const saveAttendance = async () => {
    if (stats.notMarked > 0) {
      toast.error(`Please mark attendance for ${stats.notMarked} remaining students`);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Attendance saved successfully!");
      setShowSummary(true);
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case "present": return "bg-green-50 text-green-600 border-green-200";
      case "absent": return "bg-red-50 text-red-600 border-red-200";
      case "late": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "not_marked": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4" />;
      case "absent": return <XCircle className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      case "not_marked": return <Timer className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (showSummary) {
    return (
      <MobilePageContent
        title="Attendance Summary"
        showBack
        onBack={onBack}
        className="space-y-4"
      >
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Attendance Saved!</h3>
            <p className="text-muted-foreground mb-4">
              Successfully recorded attendance for {classInfo.name}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-xs text-muted-foreground">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-xs text-muted-foreground">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={() => onPageChange("attendance")}
              >
                View Attendance Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onBack}
              >
                Back to Classes
              </Button>
            </div>
          </CardContent>
        </Card>
      </MobilePageContent>
    );
  }

  return (
    <MobilePageContent
      title="Take Attendance"
      subtitle={`${classInfo.name} • ${classInfo.subject}`}
      showBack
      onBack={onBack}
      className="space-y-4"
      actions={
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetAttendance}
          className="p-2 w-9 h-9"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      }
    >
      {/* Class Info */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{classInfo.period}</h3>
                <p className="text-xs text-muted-foreground">{classInfo.time}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                {stats.marked}/{stats.total} marked
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.progress.toFixed(0)}% complete
              </div>
            </div>
          </div>
          
          <Progress value={stats.progress} className="mb-3" />
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="font-semibold text-green-600">{stats.present}</div>
              <div className="text-green-600">Present</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="font-semibold text-yellow-600">{stats.late}</div>
              <div className="text-yellow-600">Late</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="font-semibold text-red-600">{stats.absent}</div>
              <div className="text-red-600">Absent</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
              <div className="font-semibold text-gray-600">{stats.notMarked}</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search students by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={markAllPresent}
          className="flex-1"
          disabled={stats.notMarked === 0}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Mark All Present
        </Button>
        <Button 
          size="sm" 
          onClick={saveAttendance}
          disabled={stats.notMarked > 0 || isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Timer className="h-3 w-3 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3 w-3 mr-1" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Students ({filteredStudents.length})</h3>
          {stats.notMarked > 0 && (
            <Badge variant="outline" className="text-xs">
              {stats.notMarked} pending
            </Badge>
          )}
        </div>

        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`border transition-all duration-200 ${
                student.status !== "not_marked" 
                  ? "border-primary/20 bg-primary/5" 
                  : "border-border hover:shadow-sm"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{student.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Roll: {student.rollNumber}</span>
                          <span>•</span>
                          <span>{student.previousAttendance}% attendance</span>
                        </div>
                      </div>
                    </div>

                    <Badge className={`text-xs border ${getStatusColor(student.status)} flex-shrink-0`}>
                      {getStatusIcon(student.status)}
                      <span className="ml-1 capitalize">
                        {student.status === "not_marked" ? "Pending" : student.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={student.status === "present" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStudentStatus(student.id, "present")}
                      className="text-xs h-8"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Present
                    </Button>
                    <Button
                      variant={student.status === "late" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStudentStatus(student.id, "late")}
                      className="text-xs h-8"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Late
                    </Button>
                    <Button
                      variant={student.status === "absent" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStudentStatus(student.id, "absent")}
                      className="text-xs h-8"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No students found</p>
          </div>
        )}
      </div>
    </MobilePageContent>
  );
};