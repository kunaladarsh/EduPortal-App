import React from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  BookOpen,
  Upload,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  FileText,
  GraduationCap,
  Target,
  AlertCircle,
  Edit,
  Plus
} from "lucide-react";

interface AssignmentSystemOverviewProps {
  onNavigate: (page: string) => void;
}

export const AssignmentSystemOverview: React.FC<AssignmentSystemOverviewProps> = ({
  onNavigate
}) => {
  const { user } = useAuth();

  // Mock data for demonstration
  const mockStats = {
    totalAssignments: 12,
    activeAssignments: 8,
    pendingSubmissions: 15,
    gradedAssignments: 7,
    averageGrade: 87,
    completionRate: 85,
    upcomingDeadlines: 3,
    overdue: 2
  };

  const mockRecentAssignments = [
    {
      id: "1",
      title: "Mathematics Problem Set Chapter 5",
      subject: "Mathematics",
      dueDate: "2025-01-28",
      status: "active",
      type: "homework",
      submissions: 12,
      totalStudents: 25,
      maxPoints: 100
    },
    {
      id: "2", 
      title: "Physics Lab Report - Pendulum Experiment",
      subject: "Physics",
      dueDate: "2025-01-30",
      status: "active",
      type: "project",
      submissions: 8,
      totalStudents: 25,
      maxPoints: 50
    },
    {
      id: "3",
      title: "History Essay - World War Analysis",
      subject: "History", 
      dueDate: "2025-02-02",
      status: "draft",
      type: "essay",
      submissions: 0,
      totalStudents: 25,
      maxPoints: 75
    }
  ];

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 xs:p-6 pb-24 space-y-6 xs:space-y-8 max-w-sm xs:max-w-md mx-auto safe-area-top safe-area-bottom">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-xl xs:text-2xl font-bold mb-2">Assignment System</h1>
        <p className="text-muted-foreground">Complete assignment management solution</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 xs:grid-cols-2 gap-3 xs:gap-4"
      >
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 xs:p-5 text-center">
            <BookOpen className="h-6 w-6 xs:h-7 xs:w-7 mx-auto mb-2 text-primary" />
            <div className="text-lg xs:text-xl font-bold text-primary">{mockStats.totalAssignments}</div>
            <div className="text-xs xs:text-sm text-muted-foreground">Total Assignments</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-secondary/10 to-secondary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 xs:p-5 text-center">
            <CheckCircle className="h-6 w-6 xs:h-7 xs:w-7 mx-auto mb-2 text-secondary" />
            <div className="text-lg xs:text-xl font-bold text-secondary">{mockStats.activeAssignments}</div>
            <div className="text-xs xs:text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-chart-1/10 to-chart-1/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 xs:p-5 text-center">
            <Users className="h-6 w-6 xs:h-7 xs:w-7 mx-auto mb-2" style={{ color: 'var(--chart-1)' }} />
            <div className="text-lg xs:text-xl font-bold" style={{ color: 'var(--chart-1)' }}>{mockStats.pendingSubmissions}</div>
            <div className="text-xs xs:text-sm text-muted-foreground">Pending Submissions</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-accent/10 to-accent/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4 xs:p-5 text-center">
            <Star className="h-6 w-6 xs:h-7 xs:w-7 mx-auto mb-2 text-accent" />
            <div className="text-lg xs:text-xl font-bold text-accent">{mockStats.averageGrade}%</div>
            <div className="text-xs xs:text-sm text-muted-foreground">Average Grade</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 xs:pb-4">
            <CardTitle className="text-base xs:text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 xs:h-6 xs:w-6 text-primary" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 xs:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Completion Rate</span>
                <span className="text-muted-foreground">{mockStats.completionRate}%</span>
              </div>
              <Progress value={mockStats.completionRate} className="h-2 xs:h-2.5" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 xs:gap-4 pt-2">
              <div className="text-center">
                <div className="text-base xs:text-lg font-bold text-primary">{mockStats.gradedAssignments}</div>
                <div className="text-xs xs:text-sm text-muted-foreground">Graded</div>
              </div>
              <div className="text-center">
                <div className="text-base xs:text-lg font-bold text-secondary">{mockStats.upcomingDeadlines}</div>
                <div className="text-xs xs:text-sm text-muted-foreground">Due Soon</div>
              </div>
              <div className="text-center">
                <div className="text-base xs:text-lg font-bold text-accent">{mockStats.overdue}</div>
                <div className="text-xs xs:text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 xs:pb-4">
            <CardTitle className="text-base xs:text-lg">System Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 xs:space-y-4">
            <div className="grid grid-cols-2 xs:grid-cols-2 gap-3 xs:gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-3 xs:p-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate("assignments")}
              >
                <BookOpen className="h-5 w-5 xs:h-6 xs:w-6" />
                <span className="text-xs xs:text-sm">View All</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-3 xs:p-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate("assignments")}
              >
                <Plus className="h-5 w-5 xs:h-6 xs:w-6" />
                <span className="text-xs xs:text-sm">Create New</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-3 xs:p-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate("assignments")}
              >
                <Users className="h-5 w-5 xs:h-6 xs:w-6" />
                <span className="text-xs xs:text-sm">Submissions</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => onNavigate("assignments")}
              >
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs">Grading</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3 xs:mb-4">
          <h3 className="font-semibold text-base xs:text-lg">Recent Assignments</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("assignments")}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3 xs:space-y-4">
          {mockRecentAssignments.map((assignment, index) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const submissionRate = (assignment.submissions / assignment.totalStudents) * 100;
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
                onClick={() => onNavigate("assignments")}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 xs:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 xs:h-6 xs:w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm xs:text-base mb-1 line-clamp-2">{assignment.title}</h4>
                        <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground mb-2">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>{assignment.maxPoints} pts</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            assignment.status === 'active' ? 'bg-primary/10 text-primary' :
                            assignment.status === 'draft' ? 'bg-secondary/10 text-secondary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {assignment.status}
                          </Badge>
                          
                          <div className="text-xs xs:text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1" />
                            {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                             daysUntilDue === 0 ? "Due today" : 
                             `${Math.abs(daysUntilDue)} days overdue`}
                          </div>
                        </div>

                        {user?.role === "teacher" && (
                          <div>
                            <div className="flex items-center justify-between text-xs xs:text-sm mb-1">
                              <span>Submissions</span>
                              <span>{assignment.submissions}/{assignment.totalStudents}</span>
                            </div>
                            <Progress value={submissionRate} className="h-1 xs:h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore the complete assignment management system with all features.
            </p>
            <Button onClick={() => onNavigate("assignments")} className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Open Assignment System
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};