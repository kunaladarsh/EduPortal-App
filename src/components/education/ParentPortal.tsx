import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  Bell,
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  BarChart3,
  FileText,
  Video,
  Phone
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface ChildData {
  id: string;
  name: string;
  grade: string;
  class: string;
  teacher: string;
  avatar?: string;
  overallGrade: number;
  attendanceRate: number;
  assignments: {
    completed: number;
    total: number;
  };
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'grade' | 'attendance' | 'assignment' | 'announcement';
  title: string;
  description: string;
  date: string;
  status: 'positive' | 'neutral' | 'negative';
}

const ParentPortal: React.FC = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real API calls
  const [children, setChildren] = useState<ChildData[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      grade: '8th Grade',
      class: '8-A',
      teacher: 'Ms. Sarah Wilson',
      overallGrade: 88.5,
      attendanceRate: 94.2,
      assignments: {
        completed: 23,
        total: 26
      },
      recentActivity: [
        {
          id: '1',
          type: 'grade',
          title: 'Math Quiz Result',
          description: 'Scored 92% on Algebra quiz',
          date: '2024-01-15',
          status: 'positive'
        },
        {
          id: '2',
          type: 'assignment',
          title: 'Science Project Due',
          description: 'Solar system model due tomorrow',
          date: '2024-01-16',
          status: 'neutral'
        },
        {
          id: '3',
          type: 'attendance',
          title: 'Perfect Attendance Week',
          description: 'No absences this week',
          date: '2024-01-12',
          status: 'positive'
        }
      ]
    },
    {
      id: '2',
      name: 'Alex Johnson',
      grade: '5th Grade',
      class: '5-B',
      teacher: 'Mr. David Chen',
      overallGrade: 91.2,
      attendanceRate: 96.8,
      assignments: {
        completed: 18,
        total: 20
      },
      recentActivity: [
        {
          id: '4',
          type: 'grade',
          title: 'Reading Comprehension',
          description: 'Excellent progress in reading level',
          date: '2024-01-14',
          status: 'positive'
        }
      ]
    }
  ]);

  const currentChild = children.find(child => child.id === selectedChild) || children[0];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'grade': return <Award className="w-4 h-4" />;
      case 'attendance': return <CheckCircle className="w-4 h-4" />;
      case 'assignment': return <FileText className="w-4 h-4" />;
      case 'announcement': return <Bell className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Parent Portal
          </h1>
          <p className="text-muted-foreground">
            Stay connected with your child's educational journey
          </p>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {children.map(child => (
            <Button
              key={child.id}
              variant={selectedChild === child.id ? "default" : "outline"}
              onClick={() => setSelectedChild(child.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {child.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {child.name}
            </Button>
          ))}
        </div>
      )}

      {/* Child Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">
                {currentChild.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{currentChild.name}</h2>
              <p className="text-muted-foreground">{currentChild.grade} • {currentChild.class}</p>
              <p className="text-sm text-muted-foreground">Teacher: {currentChild.teacher}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{currentChild.overallGrade}%</div>
              <div className="text-sm text-muted-foreground">Overall Grade</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{currentChild.overallGrade}%</div>
              <div className="text-sm text-muted-foreground">Academic Performance</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{currentChild.attendanceRate}%</div>
              <div className="text-sm text-muted-foreground">Attendance Rate</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">
                {currentChild.assignments.completed}/{currentChild.assignments.total}
              </div>
              <div className="text-sm text-muted-foreground">Assignments Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="communication">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentChild.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm">Message Teacher</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Schedule Meeting</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Video className="w-6 h-6" />
                  <span className="text-sm">Virtual Classroom</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mathematics</h4>
                    <p className="text-sm text-muted-foreground">Last updated: Jan 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">92%</div>
                    <Badge variant="default" className="text-xs">A-</Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Science</h4>
                    <p className="text-sm text-muted-foreground">Last updated: Jan 14, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">89%</div>
                    <Badge variant="default" className="text-xs">B+</Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">English</h4>
                    <p className="text-sm text-muted-foreground">Last updated: Jan 13, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">85%</div>
                    <Badge variant="secondary" className="text-xs">B</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {currentChild.attendanceRate}%
                  </div>
                  <p className="text-muted-foreground">Overall Attendance Rate</p>
                </div>
                
                <Progress value={currentChild.attendanceRate} className="h-2" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-muted-foreground">Present</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">8</div>
                    <div className="text-sm text-muted-foreground">Absent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-muted-foreground">Late</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Completed Assignments</span>
                  <span className="font-bold">
                    {currentChild.assignments.completed}/{currentChild.assignments.total}
                  </span>
                </div>
                
                <Progress 
                  value={(currentChild.assignments.completed / currentChild.assignments.total) * 100} 
                  className="h-2" 
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Math Homework #15</h4>
                        <p className="text-sm text-muted-foreground">Due: Jan 16, 2024</p>
                      </div>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Science Project</h4>
                        <p className="text-sm text-muted-foreground">Due: Jan 20, 2024</p>
                      </div>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-medium">English Essay</h4>
                        <p className="text-sm text-muted-foreground">Due: Jan 18, 2024</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Messages & Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">Ms. Sarah Wilson</h4>
                    <p className="text-sm text-muted-foreground">
                      Emma is doing excellent work in mathematics...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <Button size="sm" variant="outline">Reply</Button>
                </div>
                
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">School Administration</h4>
                    <p className="text-sm text-muted-foreground">
                      Parent-Teacher Conference scheduled for...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
              
              <Button className="w-full mt-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send New Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPortal;