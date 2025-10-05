import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ArrowLeft, Users, Calendar, Clock, 
  BookOpen, Share2, Edit, Settings,
  MessageCircle, FileText, BarChart3,
  Bell, Copy, MapPin, Star, Award,
  CheckCircle, AlertCircle, TrendingUp,
  Download, Upload, Eye, Plus
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface MobileClassDetailsViewProps {
  classData: any;
  onBack: () => void;
  onPageChange: (page: string) => void;
}

export const MobileClassDetailsView: React.FC<MobileClassDetailsViewProps> = ({ 
  classData, 
  onBack,
  onPageChange 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock class data if not provided
  const mockClass = {
    id: "1",
    name: "Advanced Mathematics",
    subject: "Mathematics",
    teacher: "Ms. Sarah Johnson",
    description: "This course covers advanced mathematical concepts including calculus, statistics, and linear algebra. Students will develop problem-solving skills and mathematical reasoning.",
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
    room: "Room 101",
    nextClass: "Tomorrow 9:00 AM",
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    tags: ["Advanced", "Calculus", "Statistics"],
    rating: 4.8
  };

  const cls = classData || mockClass;

  const handleShareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${cls.name}`,
        text: `Join my class "${cls.name}" using code: ${cls.code}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(cls.code);
      toast.success("Class code copied to clipboard!");
    }
  };

  const mockStudents = [
    { id: "1", name: "Alice Johnson", email: "alice@school.edu", grade: "A", attendance: 95 },
    { id: "2", name: "Bob Smith", email: "bob@school.edu", grade: "B+", attendance: 88 },
    { id: "3", name: "Carol Brown", email: "carol@school.edu", grade: "A-", attendance: 92 },
    { id: "4", name: "David Wilson", email: "david@school.edu", grade: "B", attendance: 85 }
  ];

  const mockAssignments = [
    { id: "1", title: "Calculus Problem Set 1", dueDate: "2024-01-25", status: "completed", grade: "A" },
    { id: "2", title: "Statistics Project", dueDate: "2024-01-30", status: "pending", grade: null },
    { id: "3", title: "Linear Algebra Quiz", dueDate: "2024-02-05", status: "upcoming", grade: null }
  ];

  const mockAnnouncements = [
    { id: "1", title: "Midterm Exam Schedule", date: "2024-01-20", content: "The midterm exam will be held next Friday..." },
    { id: "2", title: "Study Group Session", date: "2024-01-18", content: "Optional study group session this Thursday..." },
    { id: "3", title: "Assignment Deadline Extended", date: "2024-01-15", content: "Due to technical issues, the deadline has been extended..." }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Class Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {cls.teacher.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{cls.teacher}</h3>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{cls.rating}</span>
                </div>
              </div>

              <Separator />

              <p className="text-muted-foreground">{cls.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Schedule</div>
                  <div className="font-medium">{cls.schedule}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{cls.room}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {cls.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{cls.progress}%</span>
            </div>
            <Progress value={cls.progress} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {cls.grade || cls.students}
            </div>
            <div className="text-sm text-muted-foreground">
              {cls.grade ? "Current Grade" : "Students"}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="p-3 text-center">
          <div className="font-semibold">{cls.assignments}</div>
          <div className="text-xs text-muted-foreground">Assignments</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="font-semibold">{cls.announcements}</div>
          <div className="text-xs text-muted-foreground">Announcements</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="font-semibold">
            {cls.status === "active" ? "Active" : "Completed"}
          </div>
          <div className="text-xs text-muted-foreground">Status</div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button 
          variant="outline" 
          className="h-16"
          onClick={() => onPageChange("assignments")}
        >
          <div className="text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm">Assignments</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="h-16"
          onClick={() => onPageChange("messages")}
        >
          <div className="text-center">
            <MessageCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm">Messages</div>
          </div>
        </Button>
      </motion.div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4">
      {cls.role === "teacher" && (
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Class Roster</h3>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      )}

      {mockStudents.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{student.grade}</div>
                  <div className="text-sm text-muted-foreground">{student.attendance}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-4">
      {cls.role === "teacher" && (
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Assignments</h3>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      )}

      {mockAssignments.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={assignment.status === "completed" ? "default" : assignment.status === "pending" ? "secondary" : "outline"}
                  >
                    {assignment.status}
                  </Badge>
                  {assignment.grade && (
                    <Badge variant="outline">{assignment.grade}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
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
        style={{ backgroundColor: `${cls.color}10` }}
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
              <h1 className="text-lg font-semibold">{cls.name}</h1>
              <p className="text-sm text-muted-foreground">{cls.subject}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={handleShareCode}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            {cls.role === "teacher" && (
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-4">
          <Badge 
            variant={cls.status === "active" ? "default" : "secondary"}
            style={{ backgroundColor: cls.color }}
          >
            {cls.status}
          </Badge>
          <span className="text-sm text-muted-foreground">Code: {cls.code}</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="students" className="text-sm">
              {cls.role === "teacher" ? "Students" : "Classmates"}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-sm">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            {renderStudents()}
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-6">
            {renderAssignments()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};