import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  BookOpen, Plus, Users, Calendar, Clock, 
  GraduationCap, ChevronRight, Star, Award,
  Search, Filter, Grid, List, Settings,
  Bell, MessageCircle, FileText, BarChart3,
  ArrowLeft
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MobileMyClassesFullProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileMyClassesFull: React.FC<MobileMyClassesFullProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();

  // Mock data for classes
  const mockClasses = [
    {
      id: "1",
      name: "Advanced Mathematics",
      subject: "Mathematics",
      teacher: "Ms. Sarah Johnson",
      students: 28,
      maxStudents: 30,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      progress: 75,
      color: "#7C3AED",
      status: "active",
      code: "MATH01",
      role: user?.role === "teacher" ? "teacher" : "student",
      grade: user?.role === "student" ? "A-" : undefined,
      assignments: 12,
      announcements: 3,
      lastActivity: "2 hours ago",
      description: "Advanced mathematical concepts and problem solving",
      room: "Room 101",
      nextClass: "Tomorrow 9:00 AM"
    },
    {
      id: "2",
      name: "Physics Laboratory",
      subject: "Physics",
      teacher: "Dr. Robert Chen",
      students: 24,
      maxStudents: 25,
      schedule: "Tue, Thu - 2:00 PM",
      progress: 68,
      color: "#0EA5E9",
      status: "active",
      code: "PHYS02",
      role: user?.role === "teacher" ? "teacher" : "student",
      grade: user?.role === "student" ? "B+" : undefined,
      assignments: 8,
      announcements: 1,
      lastActivity: "1 day ago",
      description: "Hands-on physics experiments and theory",
      room: "Lab 203",
      nextClass: "Today 2:00 PM"
    }
  ];

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
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">My Classes</h1>
              <p className="text-sm text-muted-foreground">
                {user?.role === "teacher" ? "Manage your classes" : "Your enrolled classes"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockClasses.length}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.role === "teacher" ? "Classes Teaching" : "Classes Enrolled"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockClasses.reduce((acc, cls) => acc + cls.students, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.role === "teacher" ? "Total Students" : "Classmates"}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Classes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="font-semibold">Your Classes</h3>
          
          {mockClasses.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => onPageChange("class-details")}
              >
                <div 
                  className="h-3 w-full"
                  style={{ backgroundColor: cls.color }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{cls.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{cls.subject}</p>
                    </div>
                    <Badge 
                      variant={cls.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {cls.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {cls.teacher.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cls.teacher}</p>
                      <p className="text-xs text-muted-foreground">{cls.room}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cls.description}
                  </p>

                  {cls.status === "active" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{cls.progress}%</span>
                      </div>
                      <Progress value={cls.progress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm">{cls.students}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm">{cls.assignments}</div>
                      <div className="text-xs text-muted-foreground">Assignments</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="font-semibold text-sm">
                        {cls.grade || cls.announcements}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cls.grade ? "Grade" : "News"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Code: {cls.code}
                    </div>
                    {cls.nextClass && (
                      <div className="text-xs text-muted-foreground">
                        Next: {cls.nextClass}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State for no classes */}
        {mockClasses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No classes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {user?.role === "teacher" 
                ? "Create your first class to get started"
                : "Join a class to begin learning"
              }
            </p>
          </motion.div>
        )}

        {/* Bottom spacing for mobile */}
        <div className="h-20" />
      </div>
    </div>
  );
};