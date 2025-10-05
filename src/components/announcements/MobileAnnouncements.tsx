import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Bell,
  Megaphone,
  Clock,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  Info,
  CheckCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Pin,
  Share,
  Eye,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorRole: "admin" | "teacher";
  category: "general" | "academic" | "event" | "emergency" | "reminder";
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: "all" | "students" | "teachers" | "admins" | "class";
  classId?: string;
  className?: string;
  date: string;
  time: string;
  isPinned: boolean;
  isRead: boolean;
  attachments?: string[];
  views?: number;
}

interface MobileAnnouncementsProps {
  onPageChange?: (page: string) => void;
}

export const MobileAnnouncements: React.FC<MobileAnnouncementsProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "pinned" | "general" | "academic">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const canCreateAnnouncements = isAdmin || isTeacher;

  // Mock data
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "School Holiday Notice",
      content: "The school will be closed on January 20th in observance of Martin Luther King Jr. Day. All classes are suspended for the day.",
      author: "Principal Johnson",
      authorRole: "admin",
      category: "general",
      priority: "high",
      targetAudience: "all",
      date: "2024-01-15",
      time: "09:00",
      isPinned: true,
      isRead: false,
      views: 234
    },
    {
      id: "2",
      title: "Math Quiz Rescheduled",
      content: "The math quiz originally scheduled for Wednesday has been moved to Friday due to the assembly. Please prepare accordingly.",
      author: "Ms. Smith",
      authorRole: "teacher", 
      category: "academic",
      priority: "medium",
      targetAudience: "class",
      className: "Math 101",
      date: "2024-01-14",
      time: "14:30",
      isPinned: false,
      isRead: true,
      views: 45
    },
    {
      id: "3",
      title: "Science Fair Registration Open",
      content: "Registration for the annual science fair is now open. Students interested in participating should submit their project proposals by January 30th.",
      author: "Dr. Wilson",
      authorRole: "teacher",
      category: "event",
      priority: "medium",
      targetAudience: "students",
      date: "2024-01-13",
      time: "11:15",
      isPinned: false,
      isRead: true,
      attachments: ["registration_form.pdf"],
      views: 128
    },
    {
      id: "4",
      title: "Library Hours Extended",
      content: "The library will now be open until 8 PM on weekdays to accommodate study groups. New hours are effective immediately.",
      author: "Ms. Davis",
      authorRole: "admin",
      category: "general",
      priority: "low",
      targetAudience: "all",
      date: "2024-01-12",
      time: "16:00",
      isPinned: false,
      isRead: false,
      views: 89
    },
    {
      id: "5",
      title: "Emergency Drill Tomorrow",
      content: "We will be conducting a fire drill tomorrow at 10:30 AM. Please follow your teacher's instructions and proceed to the designated assembly areas.",
      author: "Safety Coordinator",
      authorRole: "admin",
      category: "emergency",
      priority: "urgent",
      targetAudience: "all",
      date: "2024-01-11",
      time: "08:00",
      isPinned: true,
      isRead: true,
      views: 456
    }
  ];

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case "academic": return <BookOpen className="h-3 w-3" />;
      case "event": return <Calendar className="h-3 w-3" />;
      case "emergency": return <AlertCircle className="h-3 w-3" />;
      case "reminder": return <Clock className="h-3 w-3" />;
      case "general": return <Info className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case "academic": return "bg-primary/10 text-primary border-primary/20";
      case "event": return "bg-secondary/10 text-secondary border-secondary/20";
      case "emergency": return "bg-destructive/10 text-destructive border-destructive/20";
      case "reminder": return "bg-accent/10 text-accent border-accent/20";
      case "general": return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    if (filter === "unread" && announcement.isRead) return false;
    if (filter === "pinned" && !announcement.isPinned) return false;
    if (filter === "general" && announcement.category !== "general") return false;
    if (filter === "academic" && announcement.category !== "academic") return false;
    if (searchQuery && !announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !announcement.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = mockAnnouncements.filter(a => !a.isRead).length;
  const pinnedCount = mockAnnouncements.filter(a => a.isPinned).length;

  const formatTimeAgo = (date: string, time: string) => {
    const announcementDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - announcementDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread messages` : "All caught up!"}
          </p>
        </div>
        
        {canCreateAnnouncements && (
          <Button size="sm" className="rounded-full p-2 w-10 h-10">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">{mockAnnouncements.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-accent">{unreadCount}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-secondary">{pinnedCount}</div>
            <div className="text-xs text-muted-foreground">Pinned</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: "all", label: "All", count: mockAnnouncements.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "pinned", label: "Pinned", count: pinnedCount },
          { key: "academic", label: "Academic", count: mockAnnouncements.filter(a => a.category === "academic").length },
          { key: "general", label: "General", count: mockAnnouncements.filter(a => a.category === "general").length }
        ].map((filterType) => (
          <Button
            key={filterType.key}
            variant={filter === filterType.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType.key as any)}
            className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
          >
            {filterType.label}
            {filterType.count > 0 && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {filterType.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAnnouncements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No announcements found</p>
            </motion.div>
          ) : (
            filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
                  !announcement.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                } ${announcement.isPinned ? 'ring-1 ring-secondary/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Author Avatar */}
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={announcement.authorAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {announcement.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm line-clamp-1 ${!announcement.isRead ? 'text-primary' : ''}`}>
                              {announcement.isPinned && <Pin className="inline h-3 w-3 mr-1 text-secondary" />}
                              {announcement.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{announcement.author}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(announcement.date, announcement.time)}</span>
                              {announcement.views && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{announcement.views}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1 h-auto">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              {canCreateAnnouncements && (
                                <>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs border ${getCategoryColor(announcement.category)}`}>
                            {getCategoryIcon(announcement.category)}
                            <span className="ml-1 capitalize">{announcement.category}</span>
                          </Badge>
                          
                          <Badge className={`text-xs border ${getPriorityColor(announcement.priority)}`}>
                            <span className="capitalize">{announcement.priority}</span>
                          </Badge>
                          
                          {announcement.className && (
                            <Badge variant="outline" className="text-xs">
                              {announcement.className}
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {announcement.content}
                        </p>

                        {/* Attachments */}
                        {announcement.attachments && announcement.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-primary mb-3">
                            <BookOpen className="h-3 w-3" />
                            <span>{announcement.attachments.length} attachment(s)</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {!announcement.isRead && (
                              <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-primary">
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Action Card for Teachers/Admins */}
      {canCreateAnnouncements && (
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Create Announcement</h4>
                <p className="text-xs text-muted-foreground">Share important information with your {isAdmin ? 'school' : 'students'}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};