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
import {
  Award, TrendingUp, TrendingDown, BookOpen, Calendar,
  Search, Filter, ArrowLeft, Target, Star, GraduationCap,
  BarChart3, Clock, CheckCircle, AlertCircle, FileText,
  Eye, Download, Share2, Bell, Trophy, Zap, Plus
} from "lucide-react";

interface Grade {
  id: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
  type: "exam" | "assignment" | "quiz" | "project" | "lab";
  teacher: string;
  feedback?: string;
  submittedOn?: string;
  graded: boolean;
  weight: number;
}

interface Subject {
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
  targetGrade: number;
  currentGPA: number;
}

interface MobileStudentGradesProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileStudentGrades: React.FC<MobileStudentGradesProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "subjects" | "assignments">("overview");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const mockGrades: Grade[] = [
    {
      id: "g1",
      subject: "Mathematics",
      assignment: "Quadratic Equations Test",
      score: 92,
      maxScore: 100,
      percentage: 92,
      date: "2024-01-22",
      type: "exam",
      teacher: "Ms. Johnson",
      feedback: "Excellent work! Great understanding of the concepts.",
      graded: true,
      weight: 20
    },
    {
      id: "g2",
      subject: "Physics",
      assignment: "Lab Report - Pendulum",
      score: 88,
      maxScore: 100,
      percentage: 88,
      date: "2024-01-21",
      type: "lab",
      teacher: "Mr. Chen",
      feedback: "Good experimental setup. Analysis could be more detailed.",
      graded: true,
      weight: 15
    },
    {
      id: "g3",
      subject: "Chemistry",
      assignment: "Molecular Structure Quiz",
      score: 85,
      maxScore: 100,
      percentage: 85,
      date: "2024-01-19",
      type: "quiz",
      teacher: "Dr. Smith",
      feedback: "Good understanding of basic concepts.",
      graded: true,
      weight: 10
    }
  ];

  const mockSubjects: Subject[] = [
    {
      name: "Mathematics",
      average: 89.5,
      letterGrade: "A-",
      credits: 4,
      teacher: "Ms. Johnson",
      totalAssignments: 8,
      completedAssignments: 6,
      pendingAssignments: 2,
      color: "chart-5",
      trend: "up",
      targetGrade: 90,
      currentGPA: 3.7
    },
    {
      name: "Physics",
      average: 85.2,
      letterGrade: "B+",
      credits: 4,
      teacher: "Mr. Chen",
      totalAssignments: 10,
      completedAssignments: 7,
      pendingAssignments: 3,
      color: "chart-1",
      trend: "stable",
      targetGrade: 87,
      currentGPA: 3.3
    },
    {
      name: "Chemistry",
      average: 91.8,
      letterGrade: "A",
      credits: 3,
      teacher: "Dr. Smith",
      totalAssignments: 6,
      completedAssignments: 5,
      pendingAssignments: 1,
      color: "chart-4",
      trend: "up",
      targetGrade: 92,
      currentGPA: 4.0
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-chart-4" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const calculateOverallGPA = () => {
    const totalGPA = mockSubjects.reduce((sum, subject) => sum + (subject.currentGPA * subject.credits), 0);
    const totalCredits = mockSubjects.reduce((sum, subject) => sum + subject.credits, 0);
    return (totalGPA / totalCredits).toFixed(2);
  };

  const renderOverview = () => {
    const overallGPA = calculateOverallGPA();
    const totalAssignments = mockSubjects.reduce((sum, subject) => sum + subject.totalAssignments, 0);
    const completedAssignments = mockSubjects.reduce((sum, subject) => sum + subject.completedAssignments, 0);
    const pendingAssignments = mockSubjects.reduce((sum, subject) => sum + subject.pendingAssignments, 0);

    return (
      <div className="space-y-6">
        {/* GPA Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">{overallGPA}</div>
              <div className="text-sm text-muted-foreground mb-4">Overall GPA</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{totalAssignments}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-chart-4">{completedAssignments}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-chart-3">{pendingAssignments}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Subject Performance</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("subjects")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {mockSubjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${subject.color}/10`}
                      >
                        <BookOpen className={`h-6 w-6 text-${subject.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{subject.name}</h4>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(subject.trend)}
                            <Badge className={`${getGradeColor(subject.average)} border`}>
                              {subject.letterGrade}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {subject.teacher} • {subject.credits} credits
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{subject.average.toFixed(1)}%</span>
                          </div>
                          <Progress value={subject.average} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Grades */}
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeColor(grade.type)}`}>
                        {getTypeIcon(grade.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{grade.assignment}</h4>
                        <div className="text-xs text-muted-foreground">
                          {grade.subject} • {grade.teacher} • {formatDate(grade.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-sm border ${getGradeColor(grade.percentage)}`}>
                          {grade.score}/{grade.maxScore}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {grade.percentage}%
                        </div>
                      </div>
                    </div>
                    {grade.feedback && (
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                        <span className="font-medium">Feedback: </span>
                        {grade.feedback}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSubjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Subjects</h2>
        <Badge variant="outline">
          GPA: {calculateOverallGPA()}
        </Badge>
      </div>

      <div className="space-y-3">
        {mockSubjects.map((subject, index) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <BookOpen className="h-8 w-8" style={{ color: subject.color }} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getTrendIcon(subject.trend)}
                          <Badge className={`${getGradeColor(subject.average)} border`}>
                            {subject.letterGrade}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{subject.credits} credits</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Average</span>
                          <span className="font-medium">{subject.average.toFixed(1)}%</span>
                        </div>
                        <Progress value={subject.average} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-semibold">{subject.totalAssignments}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <div className="font-semibold text-green-600">{subject.completedAssignments}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-600">{subject.pendingAssignments}</div>
                          <div className="text-xs text-muted-foreground">Pending</div>
                        </div>
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
                {currentView === "overview" ? "My Grades" :
                 currentView === "subjects" ? "My Subjects" : "All Assignments"}
              </h1>
              <p className="text-sm text-muted-foreground">Track your academic progress</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
            GPA {calculateOverallGPA()}
          </Badge>
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
        </AnimatePresence>
      </div>
    </div>
  );
};