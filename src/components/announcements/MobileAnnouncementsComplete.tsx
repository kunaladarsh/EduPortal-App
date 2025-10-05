import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Megaphone,
  Calendar,
  Clock,
  User,
  Pin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Send,
  Eye,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Bell,
  BookOpen,
  Users,
  School,
  FileText,
  Image as ImageIcon,
  Paperclip,
  MoreHorizontal,
  Star,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: "admin" | "teacher";
  date: string;
  time: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: "general" | "academic" | "event" | "urgent" | "maintenance";
  target: "all" | "students" | "teachers" | "class";
  targetClass?: string;
  isPinned: boolean;
  likes: number;
  comments: number;
  hasAttachment?: boolean;
  attachmentType?: "image" | "document";
  isRead?: boolean;
}

interface MobileAnnouncementsCompleteProps {
  onPageChange?: (page: string) => void;
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Spring Break Holiday Notice",
    content: "The school will be closed from March 25th to April 1st for Spring Break. Classes will resume on April 2nd. Have a wonderful break!",
    author: "Principal Johnson",
    authorRole: "admin",
    date: "2024-01-22",
    time: "09:00",
    priority: "high",
    category: "general",
    target: "all",
    isPinned: true,
    likes: 45,
    comments: 12,
    isRead: false
  },
  {
    id: "2",
    title: "Math Test Postponed",
    content: "Due to the teacher training session, the mathematics test scheduled for January 25th has been postponed to January 28th. Please prepare accordingly.",
    author: "Ms. Johnson",
    authorRole: "teacher",
    date: "2024-01-21",
    time: "14:30",
    priority: "medium",
    category: "academic",
    target: "class",
    targetClass: "Mathematics 10A",
    isPinned: false,
    likes: 23,
    comments: 8,
    hasAttachment: true,
    attachmentType: "document",
    isRead: true
  },
  {
    id: "3",
    title: "Science Fair Registration Open",
    content: "Registration for the annual science fair is now open! Submit your project proposals by February 15th. This is a great opportunity to showcase your creativity and scientific knowledge.",
    author: "Dr. Smith",
    authorRole: "teacher",
    date: "2024-01-20",
    time: "11:15",
    priority: "medium",
    category: "event",
    target: "students",
    isPinned: false,
    likes: 67,
    comments: 25,
    hasAttachment: true,
    attachmentType: "image",
    isRead: true
  },
  {
    id: "4",
    title: "Emergency Drill Scheduled",
    content: "We will conduct a fire drill tomorrow at 2:00 PM. Please follow your teachers' instructions and evacuate calmly when the alarm sounds.",
    author: "Safety Officer",
    authorRole: "admin",
    date: "2024-01-19",
    time: "16:45",
    priority: "urgent",
    category: "urgent",
    target: "all",
    isPinned: true,
    likes: 12,
    comments: 3,
    isRead: false
  },
  {
    id: "5",
    title: "Library New Books Arrival",
    content: "We've added 50 new books to our library collection! Come check out the latest fiction, science, and reference materials. Open during lunch hours.",
    author: "Librarian Wilson",
    authorRole: "admin",
    date: "2024-01-18",
    time: "10:30",
    priority: "low",
    category: "general",
    target: "all",
    isPinned: false,
    likes: 34,
    comments: 15,
    isRead: true
  },
  {
    id: "6",
    title: "Parent-Teacher Conferences",
    content: "Parent-teacher conferences are scheduled for next week. Please check your email for individual appointment times. We look forward to discussing your child's progress.",
    author: "Admin Office",
    authorRole: "admin",
    date: "2024-01-17",
    time: "08:00",
    priority: "high",
    category: "general",
    target: "all",
    isPinned: false,
    likes: 89,
    comments: 42,
    isRead: true
  }
];

const priorities = ["All", "low", "medium", "high", "urgent"];
const categories = ["All", "general", "academic", "event", "urgent", "maintenance"];
const targets = ["All", "all", "students", "teachers", "class"];

export const MobileAnnouncementsComplete: React.FC<MobileAnnouncementsCompleteProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"list" | "create" | "details">("list");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === "All" || announcement.priority === selectedPriority;
    const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-50 text-red-600 border-red-200";
      case "high": return "bg-orange-50 text-orange-600 border-orange-200";
      case "medium": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "low": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <Info className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic": return <BookOpen className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      case "maintenance": return <AlertCircle className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "bg-blue-50 text-blue-600 border-blue-200";
      case "event": return "bg-purple-50 text-purple-600 border-purple-200";
      case "urgent": return "bg-red-50 text-red-600 border-red-200";
      case "maintenance": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-green-50 text-green-600 border-green-200";
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "students": return <Users className="h-3 w-3" />;
      case "teachers": return <School className="h-3 w-3" />;
      case "class": return <BookOpen className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) return formatDate(dateStr);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return "Just now";
  };

  // List View
  if (currentView === "list") {
    const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
    const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);
    const unreadCount = mockAnnouncements.filter(a => !a.isRead).length;

    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">
              {filteredAnnouncements.length} announcements
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            {(user?.role === "admin" || user?.role === "teacher") && (
              <Button
                size="sm"
                onClick={() => setCurrentView("create")}
                className="rounded-full w-8 h-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Priority Filter */}
              <div>
                <div className="text-sm font-medium mb-2">Priority</div>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {priorities.map((priority) => (
                    <Button
                      key={priority}
                      variant={selectedPriority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPriority(priority)}
                      className="whitespace-nowrap flex-shrink-0 capitalize"
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="text-sm font-medium mb-2">Category</div>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="whitespace-nowrap flex-shrink-0 capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4 text-center">
              <Pin className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold text-primary">{pinnedAnnouncements.length}</div>
              <div className="text-xs text-muted-foreground">Pinned</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/20">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-xl font-bold text-orange-600">{unreadCount}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Pin className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Pinned Announcements</h3>
            </div>
            <div className="space-y-2">
              {pinnedAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setCurrentView("details");
                  }}
                >
                  <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${!announcement.isRead ? 'ring-2 ring-primary/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getPriorityColor(announcement.priority)} flex-shrink-0`}>
                          {getPriorityIcon(announcement.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-sm line-clamp-2 flex-1">{announcement.title}</h4>
                            <div className="flex items-center gap-1 ml-2">
                              <Pin className="h-3 w-3 text-primary" />
                              {!announcement.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {announcement.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <Badge className={`text-xs border ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </Badge>
                              <Badge className={`text-xs border ${getCategoryColor(announcement.category)}`}>
                                {announcement.category}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {getTimeAgo(announcement.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {pinnedAnnouncements.length > 0 && (
            <h3 className="font-semibold">Recent Announcements</h3>
          )}
          
          <AnimatePresence>
            {regularAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  setCurrentView("details");
                }}
              >
                <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${!announcement.isRead ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${announcement.author}`} />
                        <AvatarFallback className="text-xs">
                          {announcement.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm line-clamp-2">{announcement.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <span>{announcement.author}</span>
                              <span>•</span>
                              <span>{getTimeAgo(announcement.date)}</span>
                              {announcement.targetClass && (
                                <>
                                  <span>•</span>
                                  <span>{announcement.targetClass}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {!announcement.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {announcement.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Badge className={`text-xs border ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </Badge>
                            <Badge className={`text-xs border ${getCategoryColor(announcement.category)}`}>
                              {announcement.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getTargetIcon(announcement.target)}
                              <span className="capitalize">{announcement.target}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {announcement.hasAttachment && (
                              <div className="flex items-center gap-1">
                                {announcement.attachmentType === "image" ? (
                                  <ImageIcon className="h-3 w-3" />
                                ) : (
                                  <Paperclip className="h-3 w-3" />
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{announcement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{announcement.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Announcements Found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery || selectedPriority !== "All" || selectedCategory !== "All"
                ? "Try adjusting your search or filters."
                : "No announcements available at the moment."}
            </p>
            {(user?.role === "admin" || user?.role === "teacher") && (
              <Button onClick={() => setCurrentView("create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // Details View - simplified for brevity
  if (currentView === "details" && selectedAnnouncement) {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("list")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold line-clamp-2">{selectedAnnouncement.title}</h1>
            <p className="text-sm text-muted-foreground">{selectedAnnouncement.author}</p>
          </div>
        </div>

        <Card className="border-0">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm leading-relaxed">{selectedAnnouncement.content}</p>
            
            <div className="flex gap-2">
              <Badge className={`text-sm border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                {selectedAnnouncement.priority}
              </Badge>
              <Badge className={`text-sm border ${getCategoryColor(selectedAnnouncement.category)}`}>
                {selectedAnnouncement.category}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span className="text-xs">{selectedAnnouncement.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-xs">{selectedAnnouncement.comments}</span>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(selectedAnnouncement.date)} at {formatTime(selectedAnnouncement.time)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create View - placeholder
  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Create Announcement</h1>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <Input placeholder="Title" />
          <Textarea placeholder="Content" rows={6} />
          <div className="flex gap-2">
            <Button className="flex-1">Publish</Button>
            <Button variant="outline" onClick={() => setCurrentView("list")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};