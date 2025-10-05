import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Plus, Users, BarChart3, Award, Edit, Trash2, Save,
  ArrowLeft, Search, Filter, BookOpen, FileText,
  CheckCircle, AlertCircle, Calendar, Star, Target,
  Download, Upload, Eye, MoreVertical, Send
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
}

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentName: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  type: "exam" | "assignment" | "quiz" | "project" | "lab";
  date: string;
  submittedOn?: string;
  feedback?: string;
  graded: boolean;
  class: string;
}

interface Assignment {
  id: string;
  name: string;
  subject: string;
  type: "exam" | "assignment" | "quiz" | "project" | "lab";
  maxScore: number;
  dueDate: string;
  description: string;
  class: string;
  totalSubmissions: number;
  gradedSubmissions: number;
}

interface MobileTeacherGradesProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileTeacherGrades: React.FC<MobileTeacherGradesProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "students" | "assignments" | "add-assignment" | "grade-assignment">("overview");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [gradingData, setGradingData] = useState<Record<string, { score: string | number; feedback: string }>>({});

  // Mock data
  const mockStudents: Student[] = [
    {
      id: "s1",
      name: "Alice Johnson",
      email: "alice@school.edu",
      studentId: "STU001"
    },
    {
      id: "s2", 
      name: "Bob Smith",
      email: "bob@school.edu",
      studentId: "STU002"
    },
    {
      id: "s3",
      name: "Carol Davis",
      email: "carol@school.edu", 
      studentId: "STU003"
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: "a1",
      name: "Quadratic Equations Test",
      subject: "Mathematics",
      type: "exam",
      maxScore: 100,
      dueDate: "2024-01-25",
      description: "Comprehensive test on quadratic equations and their applications",
      class: "Advanced Mathematics",
      totalSubmissions: 5,
      gradedSubmissions: 4
    },
    {
      id: "a2",
      name: "Lab Report - Pendulum",
      subject: "Physics",
      type: "lab",
      maxScore: 100,
      dueDate: "2024-01-22",
      description: "Analysis of pendulum motion experiment",
      class: "Physics Laboratory",
      totalSubmissions: 5,
      gradedSubmissions: 5
    },
    {
      id: "a3",
      name: "Molecular Structure Quiz",
      subject: "Chemistry",
      type: "quiz",
      maxScore: 50,
      dueDate: "2024-01-20",
      description: "Quick assessment on molecular structures",
      class: "Chemistry Basics",
      totalSubmissions: 5,
      gradedSubmissions: 3
    }
  ];

  const mockGrades: Grade[] = [
    {
      id: "g1",
      studentId: "s1",
      studentName: "Alice Johnson",
      assignmentId: "a1",
      assignmentName: "Quadratic Equations Test",
      subject: "Mathematics",
      score: 92,
      maxScore: 100,
      percentage: 92,
      type: "exam",
      date: "2024-01-22",
      submittedOn: "2024-01-20",
      feedback: "Excellent understanding of complex equations. Minor calculation error on question 5.",
      graded: true,
      class: "Advanced Mathematics"
    },
    {
      id: "g2",
      studentId: "s2",
      studentName: "Bob Smith", 
      assignmentId: "a2",
      assignmentName: "Lab Report - Pendulum",
      subject: "Physics",
      score: 88,
      maxScore: 100,
      percentage: 88,
      type: "lab",
      date: "2024-01-21",
      submittedOn: "2024-01-19",
      feedback: "Good experimental setup and data collection. Analysis could be more detailed.",
      graded: true,
      class: "Physics Laboratory"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exam": return <FileText className="h-4 w-4" />;
      case "assignment": return <BookOpen className="h-4 w-4" />;
      case "quiz": return <CheckCircle className="h-4 w-4" />;
      case "project": return <Target className="h-4 w-4" />;
      case "lab": return <AlertCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam": return "bg-destructive/10 text-destructive border-destructive/20";
      case "assignment": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "quiz": return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "project": return "bg-chart-5/10 text-chart-5 border-chart-5/20";
      case "lab": return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-chart-4 bg-chart-4/10 border-chart-4/20";
    if (percentage >= 80) return "text-chart-1 bg-chart-1/10 border-chart-1/20";
    if (percentage >= 70) return "text-accent bg-accent/10 border-accent/20";
    if (percentage >= 60) return "text-chart-3 bg-chart-3/10 border-chart-3/20";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddAssignment = () => {
    toast.success("Assignment created successfully!");
    setShowAddAssignment(false);
  };

  // Mock student submissions for the selected assignment
  const studentSubmissions = useMemo(() => {
    if (!selectedAssignment) return [];
    
    return mockStudents.map((student, index) => ({
      ...student,
      submitted: index < 4, // First 4 students have submitted
      submissionDate: index < 4 ? "2024-01-20" : null,
      currentGrade: index === 0 ? 92 : index === 1 ? 88 : index === 2 ? 0 : null,
      feedback: index === 0 ? "Excellent work! Minor calculation error on question 5." : 
                index === 1 ? "Good understanding, but needs more detailed analysis." : "",
      graded: index < 2
    }));
  }, [selectedAssignment]);

  // Initialize grading data when assignment or students change
  useEffect(() => {
    if (selectedAssignment && studentSubmissions.length > 0) {
      const initialData = studentSubmissions.reduce((acc, student) => ({
        ...acc,
        [student.id]: {
          score: student.currentGrade || '',
          feedback: student.feedback || ''
        }
      }), {} as Record<string, { score: string | number; feedback: string }>);
      setGradingData(initialData);
    }
  }, [selectedAssignment?.id, studentSubmissions]);

  const renderOverview = () => {
    const totalAssignments = mockAssignments.length;
    const totalGrades = mockGrades.length;
    const pendingGrades = mockAssignments.reduce((sum, assignment) => 
      sum + (assignment.totalSubmissions - assignment.gradedSubmissions), 0);
    const avgClassScore = mockGrades.reduce((sum, grade) => sum + grade.percentage, 0) / mockGrades.length;

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{totalAssignments}</div>
              <div className="text-xs text-muted-foreground">Assignments</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{totalGrades}</div>
              <div className="text-xs text-muted-foreground">Graded</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{pendingGrades}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-sky-50">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{avgClassScore.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Class Avg</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            className="h-16 flex-col gap-2 bg-gradient-to-br from-primary to-secondary"
            onClick={() => setShowAddAssignment(true)}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">New Assignment</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 flex-col gap-2"
            onClick={() => setCurrentView("assignments")}
          >
            <FileText className="w-6 h-6" />
            <span className="text-sm">Manage Grades</span>
          </Button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Grades</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("assignments")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockGrades.slice(0, 3).map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-xs">
                          {grade.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{grade.studentName}</h4>
                        <div className="text-xs text-muted-foreground">
                          {grade.assignmentName} • {grade.subject}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-sm border ${getGradeColor(grade.percentage)}`}>
                          {grade.score}/{grade.maxScore}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(grade.date)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderAssignments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Assignments</h2>
        <Button
          size="sm"
          onClick={() => setShowAddAssignment(true)}
          className="bg-gradient-to-r from-primary to-secondary"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {mockAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(assignment.type)}`}>
                    {getTypeIcon(assignment.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base">{assignment.name}</h3>
                      <Badge className={`text-xs border ${getTypeColor(assignment.type)}`}>
                        {assignment.type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {assignment.subject} • {assignment.class} • Due {formatDate(assignment.dueDate)}
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Grading Progress</span>
                        <span className="text-sm">
                          {assignment.gradedSubmissions}/{assignment.totalSubmissions} completed
                        </span>
                      </div>
                      <Progress 
                        value={(assignment.gradedSubmissions / assignment.totalSubmissions) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setCurrentView("grade-assignment");
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Grade
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Assignment details viewed")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGradeAssignment = () => {
    if (!selectedAssignment || studentSubmissions.length === 0) return null;

    const handleScoreChange = (studentId: string, score: string) => {
      setGradingData(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], score }
      }));
    };

    const handleFeedbackChange = (studentId: string, feedback: string) => {
      setGradingData(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], feedback }
      }));
    };

    const handleSaveGrade = (studentId: string) => {
      const data = gradingData[studentId];
      if (!data.score) {
        toast.error("Please enter a score");
        return;
      }
      
      const score = Number(data.score);
      if (score < 0 || score > selectedAssignment.maxScore) {
        toast.error(`Score must be between 0 and ${selectedAssignment.maxScore}`);
        return;
      }

      toast.success("Grade saved successfully!");
    };

    const handleSaveAllGrades = () => {
      const incompleteGrades = studentSubmissions.filter(student => 
        student.submitted && !gradingData[student.id]?.score
      );
      
      if (incompleteGrades.length > 0) {
        toast.error(`Please grade all submitted assignments (${incompleteGrades.length} remaining)`);
        return;
      }

      toast.success("All grades saved successfully!");
    };

    return (
      <div className="space-y-4">
        {/* Assignment Info */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(selectedAssignment.type)}`}>
                {getTypeIcon(selectedAssignment.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedAssignment.name}</h3>
                <div className="text-sm text-muted-foreground mb-2">
                  {selectedAssignment.subject} • {selectedAssignment.class}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>Max Score: <strong>{selectedAssignment.maxScore}</strong></span>
                  <span>Due: <strong>{formatDate(selectedAssignment.dueDate)}</strong></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grading Progress */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {studentSubmissions.filter(s => s.submitted).length}
              </div>
              <div className="text-xs text-green-600">Submitted</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {studentSubmissions.filter(s => s.graded).length}
              </div>
              <div className="text-xs text-blue-600">Graded</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-orange-600">
                {studentSubmissions.filter(s => s.submitted && !s.graded).length}
              </div>
              <div className="text-xs text-orange-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Student Submissions</h3>
            <Button
              size="sm"
              onClick={handleSaveAllGrades}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Save className="w-4 h-4 mr-1" />
              Save All
            </Button>
          </div>

          {studentSubmissions.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border transition-all duration-200 ${
                student.submitted 
                  ? student.graded 
                    ? "border-green-200 bg-green-50/50 dark:bg-green-900/10" 
                    : "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10"
                  : "border-gray-200 bg-gray-50/50 dark:bg-gray-900/10"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{student.name}</h4>
                          <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                        </div>
                        <div className="text-right">
                          {student.submitted ? (
                            <Badge className={`text-xs ${
                              student.graded 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }`}>
                              {student.graded ? "Graded" : "Submitted"}
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                              Not Submitted
                            </Badge>
                          )}
                        </div>
                      </div>

                      {student.submitted ? (
                        <div className="space-y-3">
                          <div className="text-xs text-muted-foreground">
                            Submitted: {formatDate(student.submissionDate!)}
                          </div>
                          
                          {/* Grading Section */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-medium mb-1 block">
                                Score (out of {selectedAssignment.maxScore})
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max={selectedAssignment.maxScore}
                                value={gradingData[student.id]?.score || ''}
                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                placeholder="0"
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                size="sm"
                                onClick={() => handleSaveGrade(student.id)}
                                className="w-full h-8 text-xs"
                                disabled={!gradingData[student.id]?.score}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save Grade
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs font-medium mb-1 block">
                              Feedback (Optional)
                            </Label>
                            <Textarea
                              value={gradingData[student.id]?.feedback || ''}
                              onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                              placeholder="Provide feedback for this student..."
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>

                          {/* Current Grade Display */}
                          {gradingData[student.id]?.score && (
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span>Grade:</span>
                                <span className="font-semibold">
                                  {gradingData[student.id].score}/{selectedAssignment.maxScore} 
                                  ({((Number(gradingData[student.id].score) / selectedAssignment.maxScore) * 100).toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Assignment not submitted</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={currentView === "overview" ? onBack : () => setCurrentView("overview")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {currentView === "overview" ? "Grade Management" :
                 currentView === "assignments" ? "Assignments" :
                 currentView === "grade-assignment" ? "Grade Assignment" : "Grade Management"}
              </h1>
              <p className="text-sm text-muted-foreground">Manage student assignments and grades</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          {currentView === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderOverview()}
            </motion.div>
          )}
          
          {currentView === "assignments" && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderAssignments()}
            </motion.div>
          )}

          {currentView === "grade-assignment" && (
            <motion.div
              key="grade-assignment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderGradeAssignment()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Assignment Dialog */}
      <Dialog open={showAddAssignment} onOpenChange={setShowAddAssignment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for students to complete
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignment-name">Assignment Name *</Label>
              <Input id="assignment-name" placeholder="e.g., Midterm Exam" />
            </div>
            <div>
              <Label htmlFor="assignment-type">Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="max-score">Max Score *</Label>
              <Input id="max-score" type="number" placeholder="100" />
            </div>
            <div>
              <Label htmlFor="due-date">Due Date *</Label>
              <Input id="due-date" type="date" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Assignment description..." />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddAssignment(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                onClick={handleAddAssignment}
              >
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};