import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Award, TrendingUp, TrendingDown, BookOpen, Calendar,
  Search, Filter, Plus, Edit, Eye, Target, ArrowLeft,
  Users, FileText, CheckCircle, AlertCircle, BarChart3,
  Star, GraduationCap, Clock, Download, Upload
} from "lucide-react";
import { toast } from "sonner";

interface Grade {
  id: string;
  studentId?: string;
  studentName?: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
  type: "exam" | "assignment" | "quiz" | "project" | "lab" | "participation";
  teacher: string;
  feedback?: string;
  submittedOn?: string;
  graded: boolean;
  class?: string;
}

interface Subject {
  id: string;
  name: string;
  average: number;
  letterGrade: string;
  credits: number;
  teacher: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  color: string;
  trend: "up" | "down" | "stable";
  classCode?: string;
}

interface MobileGradesProfessionalProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileGradesProfessional: React.FC<MobileGradesProfessionalProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "subjects" | "grades" | "analytics" | "add-grade">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "grade" | "subject">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  // Mock data
  const mockGrades: Grade[] = [
    {
      id: "1",
      studentId: isTeacher ? "s1" : undefined,
      studentName: isTeacher ? "Alice Johnson" : undefined,
      subject: "Mathematics",
      assignment: "Quadratic Equations Test",
      score: 92,
      maxScore: 100,
      percentage: 92,
      date: "2024-01-22",
      type: "exam",
      teacher: "Ms. Johnson",
      feedback: "Excellent understanding of complex equations. Minor calculation error on question 5.",
      submittedOn: "2024-01-20",
      graded: true,
      class: "Math Advanced"
    },
    {
      id: "2",
      studentId: isTeacher ? "s2" : undefined,
      studentName: isTeacher ? "Bob Smith" : undefined,
      subject: "Physics",
      assignment: "Lab Report - Pendulum Motion",
      score: 88,
      maxScore: 100,
      percentage: 88,
      date: "2024-01-21",
      type: "lab",
      teacher: "Dr. Smith",
      feedback: "Good experimental setup and data collection. Analysis could be more detailed.",
      submittedOn: "2024-01-19",
      graded: true,
      class: "Physics 101"
    },
    {
      id: "3",
      studentId: isTeacher ? "s1" : undefined,
      studentName: isTeacher ? "Alice Johnson" : undefined,
      subject: "English",
      assignment: "Literature Essay - Shakespeare",
      score: 85,
      maxScore: 100,
      percentage: 85,
      date: "2024-01-20",
      type: "assignment",
      teacher: "Mr. Wilson",
      feedback: "Well-structured essay with good analysis. Work on conclusion strength.",
      submittedOn: "2024-01-18",
      graded: true,
      class: "English Lit"
    },
    {
      id: "4",
      studentId: isTeacher ? "s3" : undefined,
      studentName: isTeacher ? "Carol Davis" : undefined,
      subject: "Chemistry",
      assignment: "Molecular Structure Quiz",
      score: 78,
      maxScore: 100,
      percentage: 78,
      date: "2024-01-19",
      type: "quiz",
      teacher: "Dr. Brown",
      feedback: "Good basic understanding. Review organic chemistry concepts.",
      submittedOn: "2024-01-17",
      graded: true,
      class: "Chemistry 101"
    },
    {
      id: "5",
      studentId: isTeacher ? "s2" : undefined,
      studentName: isTeacher ? "Bob Smith" : undefined,
      subject: "History",
      assignment: "World War II Timeline Project",
      score: 0,
      maxScore: 100,
      percentage: 0,
      date: "2024-01-25",
      type: "project",
      teacher: "Prof. Davis",
      submittedOn: "2024-01-23",
      graded: false,
      class: "World History"
    }
  ];

  const mockSubjects: Subject[] = [
    {
      id: "1",
      name: "Mathematics",
      average: 89.5,
      letterGrade: "A-",
      credits: 4,
      teacher: "Ms. Johnson",
      totalAssignments: 12,
      completedAssignments: 10,
      pendingAssignments: 2,
      color: "bg-chart-1",
      trend: "up",
      classCode: "MATH101"
    },
    {
      id: "2",
      name: "Physics",
      average: 86.3,
      letterGrade: "B+",
      credits: 4,
      teacher: "Dr. Smith",
      totalAssignments: 10,
      completedAssignments: 8,
      pendingAssignments: 2,
      color: "bg-chart-4",
      trend: "up",
      classCode: "PHYS101"
    },
    {
      id: "3",
      name: "English",
      average: 84.7,
      letterGrade: "B+",
      credits: 3,
      teacher: "Mr. Wilson",
      totalAssignments: 8,
      completedAssignments: 6,
      pendingAssignments: 2,
      color: "bg-chart-5",
      trend: "stable",
      classCode: "ENG101"
    },
    {
      id: "4",
      name: "Chemistry",
      average: 81.2,
      letterGrade: "B",
      credits: 4,
      teacher: "Dr. Brown",
      totalAssignments: 9,
      completedAssignments: 7,
      pendingAssignments: 2,
      color: "bg-destructive",
      trend: "down",
      classCode: "CHEM101"
    },
    {
      id: "5",
      name: "History",
      average: 87.8,
      letterGrade: "A-",
      credits: 3,
      teacher: "Prof. Davis",
      totalAssignments: 6,
      completedAssignments: 4,
      pendingAssignments: 2,
      color: "bg-chart-2",
      trend: "up",
      classCode: "HIST101"
    }
  ];

  const filteredGrades = mockGrades.filter(grade => {
    const matchesSearch = grade.assignment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (grade.studentName && grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || grade.subject === selectedSubject;
    const matchesType = selectedType === "all" || grade.type === selectedType;
    const matchesStudent = selectedStudent === "all" || grade.studentId === selectedStudent;
    
    return matchesSearch && matchesSubject && matchesType && matchesStudent;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "grade":
        comparison = a.percentage - b.percentage;
        break;
      case "subject":
        comparison = a.subject.localeCompare(b.subject);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-chart-4 bg-chart-4/10 border-chart-4/20";
    if (percentage >= 80) return "text-chart-1 bg-chart-1/10 border-chart-1/20";
    if (percentage >= 70) return "text-accent bg-accent/10 border-accent/20";
    if (percentage >= 60) return "text-chart-3 bg-chart-3/10 border-chart-3/20";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exam": return <FileText className="h-4 w-4" />;
      case "assignment": return <BookOpen className="h-4 w-4" />;
      case "quiz": return <CheckCircle className="h-4 w-4" />;
      case "project": return <Target className="h-4 w-4" />;
      case "lab": return <AlertCircle className="h-4 w-4" />;
      case "participation": return <Users className="h-4 w-4" />;
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
      case "participation": return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const calculateGPA = () => {
    const totalCredits = mockSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    const weightedSum = mockSubjects.reduce((sum, subject) => {
      const points = subject.average >= 97 ? 4.0 :
                    subject.average >= 93 ? 3.7 :
                    subject.average >= 90 ? 3.3 :
                    subject.average >= 87 ? 3.0 :
                    subject.average >= 83 ? 2.7 :
                    subject.average >= 80 ? 2.3 :
                    subject.average >= 77 ? 2.0 :
                    subject.average >= 73 ? 1.7 :
                    subject.average >= 70 ? 1.3 :
                    subject.average >= 67 ? 1.0 :
                    subject.average >= 65 ? 0.7 : 0.0;
      return sum + (points * subject.credits);
    }, 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderOverview = () => {
    const gpa = calculateGPA();
    const totalGrades = mockGrades.filter(g => g.graded).length;
    const pendingGrades = mockGrades.filter(g => !g.graded).length;
    const averageGrade = mockGrades.filter(g => g.graded).reduce((sum, g) => sum + g.percentage, 0) / totalGrades;
    const recentGrades = mockGrades.filter(g => g.graded).slice(0, 3);

    return (
      <div className="space-y-6">
        {/* GPA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
            <CardContent className="p-6 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{gpa}</div>
                <div className="text-sm text-muted-foreground mb-3">Current GPA</div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-chart-4" />
                  <span className="text-chart-4">+0.15 from last semester</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-chart-4" />
              <div className="text-2xl font-bold text-chart-4">{totalGrades}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-chart-3" />
              <div className="text-2xl font-bold text-chart-3">{pendingGrades}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-chart-1" />
              <div className="text-2xl font-bold text-chart-1">{averageGrade.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Average</div>
            </CardContent>
          </Card>
          
          <Card className="border-0">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-chart-5" />
              <div className="text-2xl font-bold text-chart-5">{mockSubjects.length}</div>
              <div className="text-xs text-muted-foreground">Subjects</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            variant="outline"
            className="h-16 flex-col gap-2"
            onClick={() => setCurrentView("subjects")}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-sm">Subjects</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-16 flex-col gap-2"
            onClick={() => setCurrentView("grades")}
          >
            <Award className="w-6 h-6" />
            <span className="text-sm">All Grades</span>
          </Button>
        </motion.div>

        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Grades</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("grades")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(grade.type)}`}>
                        {getTypeIcon(grade.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{grade.assignment}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{grade.subject}</span>
                          <span>•</span>
                          <span>{formatDate(grade.date)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-sm border ${getGradeColor(grade.percentage)}`}>
                          {grade.percentage}%
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {grade.score}/{grade.maxScore}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubjects.slice(0, 3).map((subject, index) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      {subject.trend === "up" && <TrendingUp className="w-3 h-3 text-chart-4" />}
                      {subject.trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                      <span className="text-sm font-bold">{subject.average}%</span>
                    </div>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderSubjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Subjects</h2>
        <span className="text-sm text-muted-foreground">{mockSubjects.length} subjects</span>
      </div>

      <div className="space-y-3">
        {mockSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center text-white`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base">{subject.name}</h3>
                      <Badge className={`text-sm border ${getGradeColor(subject.average)}`}>
                        {subject.letterGrade}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {subject.teacher} • {subject.credits} credits • {subject.classCode}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{subject.average}% Average</span>
                      <div className="flex items-center gap-1">
                        {subject.trend === "up" && <TrendingUp className="w-3 h-3 text-chart-4" />}
                        {subject.trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                        <span className="text-xs text-muted-foreground">
                          {subject.completedAssignments}/{subject.totalAssignments} completed
                        </span>
                      </div>
                    </div>

                    <Progress value={subject.average} className="h-2 mb-3" />
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <div className="font-semibold text-sm">{subject.completedAssignments}</div>
                        <div className="text-xs text-muted-foreground">Done</div>
                      </div>
                      <div className="bg-chart-3/10 rounded-lg p-2">
                        <div className="font-semibold text-sm text-chart-3">{subject.pendingAssignments}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                      <div className="bg-chart-1/10 rounded-lg p-2">
                        <div className="font-semibold text-sm text-chart-1">{subject.totalAssignments}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
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

  const renderGrades = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">All Grades</h2>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <Button
              size="sm"
              onClick={() => setCurrentView("add-grade")}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grades, assignments, or students..."
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {mockSubjects.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Grades List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredGrades.map((grade, index) => (
            <motion.div
              key={grade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(grade.type)}`}>
                      {getTypeIcon(grade.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm line-clamp-2">{grade.assignment}</h3>
                        {grade.graded ? (
                          <Badge className={`text-sm border ml-2 ${getGradeColor(grade.percentage)}`}>
                            {grade.percentage}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs ml-2">
                            Pending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{grade.subject}</span>
                        <span>•</span>
                        <span>{grade.teacher}</span>
                        {grade.studentName && (
                          <>
                            <span>•</span>
                            <span>{grade.studentName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(grade.date)}</span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge className={`text-xs border ${getTypeColor(grade.type)}`}>
                            {grade.type}
                          </Badge>
                          {grade.graded && (
                            <Badge variant="outline" className="text-xs">
                              {grade.score}/{grade.maxScore}
                            </Badge>
                          )}
                        </div>
                        
                        {grade.graded && grade.feedback && (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Eye className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      {grade.feedback && grade.graded && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs font-medium mb-1">Teacher Feedback:</div>
                          <p className="text-xs text-muted-foreground">{grade.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">No Grades Found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedSubject !== "all" || selectedType !== "all"
              ? "Try adjusting your search or filters."
              : "No grades available yet."}
          </p>
        </motion.div>
      )}
    </div>
  );

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
                {currentView === "overview" ? "Grades" :
                 currentView === "subjects" ? "Subjects" :
                 currentView === "grades" ? "All Grades" :
                 currentView === "add-grade" ? "Add Grade" : "Analytics"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isTeacher ? "Manage student grades" : "Track your academic progress"}
              </p>
            </div>
          </div>
          {currentView === "overview" && (
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={() => setCurrentView("analytics")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          )}
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
          
          {currentView === "subjects" && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSubjects()}
            </motion.div>
          )}
          
          {currentView === "grades" && (
            <motion.div
              key="grades"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderGrades()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};