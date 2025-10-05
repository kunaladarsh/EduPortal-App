import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  BookOpen, Plus, Users, Calendar, Clock, 
  GraduationCap, ChevronRight, Star, Award,
  Search, Filter, Grid, List, Settings,
  Bell, MessageCircle, FileText, BarChart3,
  Sparkles, Construction, Rocket, Zap
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MobilePageContent } from "../shared/MobilePageContent";
import { MobileMyClassesFull } from "./MobileMyClassesFull";
import { MobileMyClassesComplete } from "./MobileMyClassesComplete";

interface MobileMyClassesProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileMyClasses: React.FC<MobileMyClassesProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullVersion, setShowFullVersion] = useState(true); // Default to true for complete experience

  // Use the complete version by default, but allow fallback to the preview/coming soon version
  if (showFullVersion) {
    return (
      <MobileMyClassesComplete 
        onPageChange={onPageChange} 
        onBack={onBack} 
      />
    );
  }

  // Mock data showing what the full feature would include
  const mockClasses = [
    {
      id: "1",
      name: "Advanced Mathematics",
      subject: "Mathematics",
      teacher: "Ms. Sarah Johnson",
      students: 28,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      progress: 75,
      color: "#7C3AED",
      status: "active"
    },
    {
      id: "2",
      name: "Physics Laboratory",
      subject: "Physics",
      teacher: "Mr. Robert Chen",
      students: 24,
      schedule: "Tue, Thu - 2:00 PM",
      progress: 68,
      color: "#0EA5E9",
      status: "active"
    },
    {
      id: "3",
      name: "English Literature",
      subject: "English",
      teacher: "Dr. Emily Davis",
      students: 32,
      schedule: "Mon, Wed - 1:00 PM",
      progress: 89,
      color: "#FB7185",
      status: "active"
    }
  ];

  const upcomingFeatures = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: "Create Classes",
      description: "Teachers can create and customize new classes",
      role: "teacher"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Join Classes",
      description: "Students can easily join classes with codes",
      role: "student"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Class Discussions", 
      description: "Interactive discussions and Q&A sessions",
      role: "both"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Resource Sharing",
      description: "Share materials, assignments, and documents",
      role: "both"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Progress Tracking",
      description: "Monitor student progress and analytics",
      role: "teacher"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Class Scheduling",
      description: "Manage class schedules and events",
      role: "both"
    }
  ];

  const renderComingSoon = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8"
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Construction className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Classes
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Coming Soon
            </Badge>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto">
            This beautiful class management interface is currently under development. 
            Get ready for an amazing classroom experience!
          </p>
        </motion.div>
      </motion.div>

      {/* Preview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Preview: Your Classes</h3>
          <Badge variant="outline" className="text-xs">Demo</Badge>
        </div>

        {mockClasses.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="relative"
          >
            <Card className="overflow-hidden border-2 border-dashed border-muted hover:border-primary/30 transition-all duration-300">
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Rocket className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-primary">Coming Soon</p>
                </div>
              </div>

              <div 
                className="h-2 w-full"
                style={{ backgroundColor: classItem.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{classItem.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{classItem.subject}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{classItem.status}</Badge>
                </div>
                
                <div className="flex items-center space-x-3 mt-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {classItem.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{classItem.teacher}</p>
                    <p className="text-xs text-muted-foreground">{classItem.schedule}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{classItem.progress}%</span>
                  </div>
                  <Progress value={classItem.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">{classItem.students}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">12</div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">A</div>
                    <div className="text-xs text-muted-foreground">Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Upcoming Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Upcoming Features</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {upcomingFeatures
            .filter(feature => 
              feature.role === "both" || 
              feature.role === user?.role ||
              (user?.role === "admin")
            )
            .map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <Card className="p-4 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center py-6"
      >
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Get Notified</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to know when My Classes launches with full functionality!
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => setShowFullVersion(true)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Try Full Version
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderTeacherFeatures = () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Teacher Features</h3>
      <div className="grid grid-cols-1 gap-3">
        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Create New Class</h4>
              <p className="text-sm text-muted-foreground">Set up a new class with curriculum</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="font-medium">Manage Students</h4>
              <p className="text-sm text-muted-foreground">Add, remove, and organize students</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-medium">Track Progress</h4>
              <p className="text-sm text-muted-foreground">Monitor student performance</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStudentFeatures = () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Student Features</h3>
      <div className="grid grid-cols-1 gap-3">
        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Join Classes</h4>
              <p className="text-sm text-muted-foreground">Enter class codes to join</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="font-medium">View Grades</h4>
              <p className="text-sm text-muted-foreground">Check your academic progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-dashed border-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-medium">Class Schedule</h4>
              <p className="text-sm text-muted-foreground">Stay updated with class timings</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const getRightAction = () => (
    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full opacity-50 cursor-not-allowed">
      <Settings className="w-4 h-4" />
    </Button>
  );

  return (
    <MobilePageContent
      title="My Classes"
      onBack={onBack}
      rightAction={getRightAction()}
    >
      <div className="p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="teacher" className="text-sm">
              {user?.role === "teacher" ? "My Tools" : "Teacher"}
            </TabsTrigger>
            <TabsTrigger value="student" className="text-sm">
              {user?.role === "student" ? "My View" : "Student"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {renderComingSoon()}
          </TabsContent>
          
          <TabsContent value="teacher" className="mt-6">
            {renderTeacherFeatures()}
          </TabsContent>
          
          <TabsContent value="student" className="mt-6">
            {renderStudentFeatures()}
          </TabsContent>
        </Tabs>
      </div>
    </MobilePageContent>
  );
};