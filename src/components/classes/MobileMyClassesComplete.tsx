import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Plus, Users, Calendar, Clock, 
  Search, Filter, Grid, List, Settings,
  BookOpen, ChevronRight, Star, Award,
  MoreVertical, UserPlus, Share2, Copy,
  BarChart3, MessageCircle, FileText,
  ArrowLeft, Edit, Trash2, ExternalLink
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { MobileCreateClass } from "./MobileCreateClass";
import { MobileJoinClass } from "./MobileJoinClass";
import { toast } from "sonner";

interface MobileMyClassesCompleteProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileMyClassesComplete: React.FC<MobileMyClassesCompleteProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [userClasses, setUserClasses] = useState([
    {
      id: "1",
      name: "Advanced Mathematics",
      subject: "Mathematics",
      teacher: "Ms. Sarah Johnson",
      teacherId: "teacher1",
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
      teacherId: "teacher2",
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
    },
    {
      id: "3",
      name: "English Literature",
      subject: "English",
      teacher: "Prof. Emily Davis",
      teacherId: "teacher3",
      students: 32,
      maxStudents: 35,
      schedule: "Mon, Wed - 1:00 PM",
      progress: 89,
      color: "#FB7185",
      status: "completed",
      code: "ENG03",
      role: user?.role === "teacher" ? "teacher" : "student",
      grade: user?.role === "student" ? "A" : undefined,
      assignments: 15,
      announcements: 0,
      lastActivity: "1 week ago",
      description: "Classic and modern literature analysis",
      room: "Room 305",
      nextClass: null
    }
  ]);

  const filteredClasses = userClasses.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || cls.status === filterStatus;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "teaching" && cls.role === "teacher") ||
                      (activeTab === "enrolled" && cls.role === "student");
    return matchesSearch && matchesFilter && matchesTab;
  });

  const handleCreateClass = (classData: any) => {
    const newClass = {
      ...classData,
      id: Date.now().toString(),
      role: "teacher",
      students: 0,
      progress: 0,
      status: "active",
      assignments: 0,
      announcements: 0,
      lastActivity: "Just now",
      teacherId: user?.id,
      nextClass: "Not scheduled"
    };
    setUserClasses(prev => [newClass, ...prev]);
    setCurrentView("overview");
    toast.success(`Class "${classData.name}" created successfully!`);
  };

  const handleJoinClass = (classData: any) => {
    const joinedClass = {
      ...classData,
      id: Date.now().toString(),
      role: "student",
      grade: undefined,
      assignments: classData.assignments || 0,
      announcements: classData.announcements || 0,
      lastActivity: "Just joined"
    };
    setUserClasses(prev => [joinedClass, ...prev]);
    setCurrentView("overview");
    toast.success(`Successfully joined "${classData.name}"!`);
  };

  const handleShareCode = (cls: any) => {
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

  const handleDeleteClass = (classId: string) => {
    setUserClasses(prev => prev.filter(cls => cls.id !== classId));
    toast.success("Class removed successfully!");
  };

  const renderClassCard = (cls: any, index: number) => (
    <motion.div
      key={cls.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={viewMode === "grid" ? "w-full" : "w-full"}
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
            <div className="flex items-center space-x-2">
              <Badge 
                variant={cls.status === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {cls.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPageChange("class-details")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShareCode(cls)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Code
                  </DropdownMenuItem>
                  {cls.role === "teacher" && (
                    <>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {cls.role === "student" && (
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteClass(cls.id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Leave Class
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Code: {cls.code}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => handleShareCode(cls)}
              >
                <Copy className="w-3 h-3" />
              </Button>
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
  );

  const renderOverview = () => (
    <div className="space-y-6">
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
              <div className="text-2xl font-bold">{userClasses.length}</div>
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
                {userClasses.reduce((acc, cls) => acc + cls.students, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                {user?.role === "teacher" ? "Total Students" : "Classmates"}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        {user?.role === "teacher" || user?.role === "admin" ? (
          <Button
            onClick={() => setCurrentView("create")}
            className="h-20 bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Create Class</div>
            </div>
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentView("join")}
            className="h-20 bg-gradient-to-br from-secondary to-blue-600 hover:from-secondary/90 hover:to-blue-600/90"
          >
            <div className="text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm font-medium">Join Class</div>
            </div>
          </Button>
        )}
        
        <Button
          variant="outline"
          className="h-20"
          onClick={() => onPageChange("calendar")}
        >
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-1" />
            <div className="text-sm font-medium">Schedule</div>
          </div>
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="all" className="text-sm">All Classes</TabsTrigger>
            <TabsTrigger value="teaching" className="text-sm">Teaching</TabsTrigger>
            <TabsTrigger value="enrolled" className="text-sm">Enrolled</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your classes..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Classes List */}
      <div className={`${viewMode === "grid" ? "space-y-4" : "space-y-3"}`}>
        {filteredClasses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {userClasses.length === 0 ? "No classes yet" : "No classes found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {userClasses.length === 0 
                ? user?.role === "teacher" 
                  ? "Create your first class to get started"
                  : "Join a class to begin learning"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {userClasses.length === 0 && (
              <Button
                onClick={() => setCurrentView(user?.role === "teacher" ? "create" : "join")}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {user?.role === "teacher" ? (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Class
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Class
                  </>
                )}
              </Button>
            )}
          </motion.div>
        ) : (
          filteredClasses.map((cls, index) => renderClassCard(cls, index))
        )}
      </div>
    </div>
  );

  if (currentView === "create" && (user?.role === "teacher" || user?.role === "admin")) {
    return (
      <MobileCreateClass
        onBack={() => setCurrentView("overview")}
        onClassCreated={handleCreateClass}
      />
    );
  }

  if (currentView === "join" && user?.role === "student") {
    return (
      <MobileJoinClass
        onBack={() => setCurrentView("overview")}
        onClassJoined={handleJoinClass}
      />
    );
  }

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-10 h-10 rounded-full"
            onClick={() => setCurrentView(user?.role === "teacher" ? "create" : "join")}
          >
            {user?.role === "teacher" ? <Plus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4">
        {renderOverview()}
      </div>
    </div>
  );
};