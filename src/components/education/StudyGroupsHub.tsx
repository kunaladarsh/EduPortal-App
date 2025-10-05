import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Clock,
  MapPin,
  Star,
  MessageCircle,
  Calendar,
  Target,
  Award,
  Filter,
  Share2,
  Settings,
  UserPlus,
  Video,
  Coffee,
  Brain,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  creator: string;
  members: GroupMember[];
  maxMembers: number;
  meetingSchedule: string;
  location: string;
  isVirtual: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  goals: string[];
  rating: number;
  totalSessions: number;
  createdAt: string;
  nextMeeting?: string;
  status: 'active' | 'recruiting' | 'full' | 'completed';
}

interface GroupMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
  contribution: number;
  avatar?: string;
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  date: string;
  duration: number;
  topic: string;
  attendees: number;
  materials: string[];
  notes?: string;
}

const StudyGroupsHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  // Mock data - replace with real API calls
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Advanced Calculus Study Circle',
      subject: 'Mathematics',
      description: 'Deep dive into calculus concepts with collaborative problem-solving sessions.',
      creator: 'Sarah Chen',
      members: [
        { id: '1', name: 'Sarah Chen', role: 'leader', joinedAt: '2024-01-01', contribution: 95 },
        { id: '2', name: 'Mike Johnson', role: 'member', joinedAt: '2024-01-03', contribution: 87 },
        { id: '3', name: 'Lisa Wong', role: 'member', joinedAt: '2024-01-05', contribution: 92 }
      ],
      maxMembers: 6,
      meetingSchedule: 'Tuesdays & Thursdays, 7:00 PM',
      location: 'Library Room 204',
      isVirtual: false,
      difficulty: 'advanced',
      tags: ['calculus', 'problem-solving', 'exam-prep'],
      goals: ['Master integration techniques', 'Prepare for final exam', 'Build problem-solving skills'],
      rating: 4.8,
      totalSessions: 12,
      createdAt: '2024-01-01',
      nextMeeting: '2024-01-16T19:00:00',
      status: 'active'
    },
    {
      id: '2',
      name: 'Physics Lab Partners',
      subject: 'Physics',
      description: 'Collaborative physics experiments and lab report discussions.',
      creator: 'David Park',
      members: [
        { id: '4', name: 'David Park', role: 'leader', joinedAt: '2024-01-02', contribution: 90 },
        { id: '5', name: 'Emma Davis', role: 'member', joinedAt: '2024-01-04', contribution: 85 },
        { id: '6', name: 'James Wilson', role: 'member', joinedAt: '2024-01-06', contribution: 88 },
        { id: '7', name: 'Anna Lopez', role: 'member', joinedAt: '2024-01-08', contribution: 91 }
      ],
      maxMembers: 5,
      meetingSchedule: 'Wednesdays, 3:00 PM',
      location: 'Physics Lab B',
      isVirtual: false,
      difficulty: 'intermediate',
      tags: ['physics', 'experiments', 'lab-reports'],
      goals: ['Complete lab assignments', 'Understand experimental methods', 'Improve lab skills'],
      rating: 4.6,
      totalSessions: 8,
      createdAt: '2024-01-02',
      nextMeeting: '2024-01-17T15:00:00',
      status: 'recruiting'
    },
    {
      id: '3',
      name: 'Programming Bootcamp',
      subject: 'Computer Science',
      description: 'Learn programming fundamentals through hands-on coding sessions.',
      creator: 'Alex Rivera',
      members: [
        { id: '8', name: 'Alex Rivera', role: 'leader', joinedAt: '2024-01-03', contribution: 98 },
        { id: '9', name: 'Sophie Turner', role: 'member', joinedAt: '2024-01-05', contribution: 82 },
        { id: '10', name: 'Ryan Kim', role: 'member', joinedAt: '2024-01-07', contribution: 89 }
      ],
      maxMembers: 8,
      meetingSchedule: 'Saturdays, 10:00 AM',
      location: 'Virtual (Zoom)',
      isVirtual: true,
      difficulty: 'beginner',
      tags: ['programming', 'coding', 'algorithms'],
      goals: ['Learn Python basics', 'Build first project', 'Understand algorithms'],
      rating: 4.9,
      totalSessions: 6,
      createdAt: '2024-01-03',
      nextMeeting: '2024-01-20T10:00:00',
      status: 'active'
    }
  ]);

  const [userGroups, setUserGroups] = useState<string[]>(['1']); // Groups user has joined
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
    maxMembers: 6,
    meetingSchedule: '',
    location: '',
    isVirtual: false,
    difficulty: 'intermediate' as const,
    tags: '',
    goals: ''
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Psychology', 'Economics'
  ];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    recruiting: 'bg-blue-100 text-blue-800',
    full: 'bg-gray-100 text-gray-800',
    completed: 'bg-purple-100 text-purple-800'
  };

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filterSubject === 'all' || group.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleJoinGroup = (groupId: string) => {
    if (userGroups.includes(groupId)) {
      toast.info("You're already a member of this group!");
      return;
    }

    const group = studyGroups.find(g => g.id === groupId);
    if (group && group.members.length >= group.maxMembers) {
      toast.error("This group is full!");
      return;
    }

    setUserGroups(prev => [...prev, groupId]);
    toast.success("Successfully joined the study group!");
  };

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.subject || !newGroup.description) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      ...newGroup,
      creator: user?.name || 'Anonymous',
      members: [{
        id: user?.id || '1',
        name: user?.name || 'Anonymous',
        role: 'leader',
        joinedAt: new Date().toISOString(),
        contribution: 100
      }],
      tags: newGroup.tags.split(',').map(tag => tag.trim()),
      goals: newGroup.goals.split('\n').filter(goal => goal.trim()),
      rating: 0,
      totalSessions: 0,
      createdAt: new Date().toISOString(),
      status: 'recruiting'
    };

    setStudyGroups(prev => [group, ...prev]);
    setUserGroups(prev => [...prev, group.id]);
    setShowCreateDialog(false);
    setNewGroup({
      name: '',
      subject: '',
      description: '',
      maxMembers: 6,
      meetingSchedule: '',
      location: '',
      isVirtual: false,
      difficulty: 'intermediate',
      tags: '',
      goals: ''
    });
    toast.success("Study group created successfully!");
  };

  const GroupCard = ({ group }: { group: StudyGroup }) => {
    const isUserMember = userGroups.includes(group.id);
    const isFull = group.members.length >= group.maxMembers;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedGroup(group)}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{group.subject}</Badge>
                  <Badge className={difficultyColors[group.difficulty]}>
                    {group.difficulty}
                  </Badge>
                  <Badge className={statusColors[group.status]}>
                    {group.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{group.rating}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {group.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{group.members.length}/{group.maxMembers}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{group.totalSessions} sessions</span>
              </div>
              <div className="flex items-center gap-1">
                {group.isVirtual ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span className="truncate">
                  {group.isVirtual ? 'Virtual' : group.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member, index) => (
                  <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 3 && (
                  <div className="w-6 h-6 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                    <span className="text-xs">+{group.members.length - 3}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Led by {group.creator}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {group.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {group.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{group.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              {group.nextMeeting && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Next: {new Date(group.nextMeeting).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinGroup(group.id);
                }}
                disabled={isUserMember || isFull}
                className="ml-auto"
              >
                {isUserMember ? (
                  <>
                    <Users className="w-4 h-4 mr-1" />
                    Joined
                  </>
                ) : isFull ? (
                  'Full'
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Join
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Study Groups
          </h1>
          <p className="text-muted-foreground">
            Join collaborative learning groups and boost your academic success
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Study Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Group Name</label>
                  <Input
                    placeholder="Enter group name..."
                    value={newGroup.name}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select 
                    value={newGroup.subject} 
                    onValueChange={(value) => setNewGroup(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your study group..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Members</label>
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select 
                    value={newGroup.difficulty} 
                    onValueChange={(value: any) => setNewGroup(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Meeting Schedule</label>
                <Input
                  placeholder="e.g., Tuesdays & Thursdays, 7:00 PM"
                  value={newGroup.meetingSchedule}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, meetingSchedule: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="Room number or virtual platform"
                    value={newGroup.location}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="virtual"
                    checked={newGroup.isVirtual}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, isVirtual: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="virtual" className="text-sm">Virtual meetings</label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                <Input
                  placeholder="e.g., calculus, problem-solving, exam-prep"
                  value={newGroup.tags}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Goals (one per line)</label>
                <Textarea
                  placeholder="List your study goals..."
                  value={newGroup.goals}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup}>
                  Create Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups ({userGroups.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search study groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </AnimatePresence>
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No study groups found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new group
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Group
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups
              .filter(group => userGroups.includes(group.id))
              .map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
          </div>

          {userGroups.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups joined yet</h3>
              <p className="text-muted-foreground mb-4">
                Join study groups to start collaborative learning
              </p>
              <Button onClick={() => setActiveTab('discover')}>
                <Search className="w-4 h-4 mr-2" />
                Discover Groups
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Groups Joined</span>
                  <span className="font-medium">{userGroups.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sessions Attended</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Contribution Score</span>
                  <span className="font-medium">89%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Calculus Study</p>
                      <p className="text-xs text-muted-foreground">Today, 7:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Physics Lab</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Top Contributor
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Users className="w-3 h-3 mr-1" />
                      Team Player
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Consistent Attendee
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Group Detail Modal */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-4xl">
          {selectedGroup && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedGroup.name}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedGroup.subject}</Badge>
                  <Badge className={difficultyColors[selectedGroup.difficulty]}>
                    {selectedGroup.difficulty}
                  </Badge>
                  <Badge className={statusColors[selectedGroup.status]}>
                    {selectedGroup.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedGroup.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Study Goals</h3>
                    <ul className="space-y-1">
                      {selectedGroup.goals.map((goal, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Target className="w-3 h-3 text-primary" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Members ({selectedGroup.members.length}/{selectedGroup.maxMembers})</h3>
                    <div className="space-y-2">
                      {selectedGroup.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {member.role === 'leader' ? 'Group Leader' : 'Member'}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.contribution}% contribution
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{selectedGroup.meetingSchedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedGroup.isVirtual ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm">{selectedGroup.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{selectedGroup.rating}/5.0 rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">{selectedGroup.totalSessions} sessions completed</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleJoinGroup(selectedGroup.id)}
                      disabled={userGroups.includes(selectedGroup.id) || selectedGroup.members.length >= selectedGroup.maxMembers}
                    >
                      {userGroups.includes(selectedGroup.id) ? (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Already Joined
                        </>
                      ) : selectedGroup.members.length >= selectedGroup.maxMembers ? (
                        'Group Full'
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join Group
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Group
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyGroupsHub;