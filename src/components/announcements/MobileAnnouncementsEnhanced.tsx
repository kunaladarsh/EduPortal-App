import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Bell, Plus, Filter, Search, Heart, MessageSquare, 
  Share2, Bookmark, MoreVertical, Pin, AlertTriangle,
  Calendar, Users, Tag, Send, Image, Paperclip, 
  Edit3, Trash2, Eye, CheckCircle, RefreshCw
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

// Import centralized data services
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  Announcement
} from "../../services/mockData";

interface MobileAnnouncementsEnhancedProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

// Enhanced announcement interface for UI features
interface EnhancedAnnouncement extends Announcement {
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  category: "general" | "academic" | "event" | "urgent" | "sports";
  priority: "low" | "medium" | "high";
  isPinned: boolean;
  isRead: boolean;
  likes: number;
  comments: number;
  targetAudience: string[];
  attachments?: { type: string; name: string; url: string }[];
}

export const MobileAnnouncementsEnhanced: React.FC<MobileAnnouncementsEnhancedProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<EnhancedAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "general" as const,
    priority: "medium" as const,
    targetAudience: ["all"]
  });

  // Load announcements from centralized service
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAnnouncements();
      
      // Transform basic announcements to enhanced announcements for UI
      const enhancedData: EnhancedAnnouncement[] = data.map(announcement => ({
        ...announcement,
        author: {
          id: announcement.createdBy,
          name: announcement.authorName || 'Unknown Author',
          role: user?.role === 'admin' ? 'Administrator' : 'Teacher',
          avatar: '/api/placeholder/40/40'
        },
        category: 'general' as const,
        priority: 'medium' as const,
        isPinned: false,
        isRead: Math.random() > 0.3,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        targetAudience: ['all'],
        attachments: []
      }));
      
      setAnnouncements(enhancedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Handle creating new announcement
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const announcement = await createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        createdBy: user?.id || '1',
        authorName: user?.name || 'User',
        classId: undefined
      });

      await loadAnnouncements();
      
      setNewAnnouncement({
        title: "",
        content: "",
        category: "general",
        priority: "medium",
        targetAudience: ["all"]
      });
      
      setIsCreating(false);
      toast.success("Announcement created successfully!");
    } catch (err) {
      toast.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  // Add loading states for the component
  if (loading && announcements.length === 0) {
    return (
      <MobilePageContent title="Announcements" onBack={onBack}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-lg font-semibold mb-2">Loading Announcements</h3>
            <p className="text-muted-foreground">Fetching latest announcements...</p>
          </div>
        </div>
      </MobilePageContent>
    );
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "bg-blue-100 text-blue-700";
      case "event": return "bg-purple-100 text-purple-700";
      case "urgent": return "bg-red-100 text-red-700";
      case "sports": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-orange-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  const handleLike = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, likes: announcement.likes + 1 }
          : announcement
      )
    );
  };

  const renderCreateForm = () => (
    <AnimatePresence>
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Create Announcement</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Announcement title..."
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <Textarea
                placeholder="Write your announcement content..."
                rows={4}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={newAnnouncement.category}
                  onValueChange={(value: any) => setNewAnnouncement(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(value: any) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                  onClick={handleCreateAnnouncement}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderAnnouncementCard = (announcement: EnhancedAnnouncement, index: number) => (
    <motion.div
      key={announcement.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`bg-card rounded-xl border-l-4 ${getPriorityColor(announcement.priority)} ${
        !announcement.isRead ? 'border border-primary/20 shadow-sm' : 'border border-border/50'
      }`}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={announcement.author.avatar} />
              <AvatarFallback>{announcement.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm truncate">{announcement.author.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {announcement.author.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(announcement.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {announcement.isPinned && (
              <Pin className="w-4 h-4 text-primary" />
            )}
            {!announcement.isRead && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-base leading-snug pr-2">{announcement.title}</h3>
            <Badge className={`${getCategoryColor(announcement.category)} border-0`}>
              {announcement.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {announcement.content}
          </p>
          
          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-2">
              {announcement.attachments.map((attachment, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{attachment.name}</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <Separator className="my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground hover:text-red-500"
              onClick={() => handleLike(announcement.id)}
            >
              <Heart className="w-4 h-4 mr-1" />
              <span className="text-xs">{announcement.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground hover:text-blue-500"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-xs">{announcement.comments}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-muted-foreground hover:text-primary"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            
            {(user?.role === "admin" || user?.role === "teacher") && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-muted-foreground hover:text-orange-500"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </motion.div>
  );

  const getRightAction = () => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={loadAnnouncements}
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
      <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
        <Search className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
        <Filter className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <MobilePageContent
      title="Announcements"
      onBack={onBack}
      rightAction={getRightAction()}
    >
      <div className="p-4 space-y-6">
        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-destructive font-medium">Error: {error}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </motion.div>
        )}

        {/* Create Button for Teachers/Admins */}
        {(user?.role === "admin" || user?.role === "teacher") && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Announcement
            </Button>
          </motion.div>
        )}

        {/* Create Form */}
        {renderCreateForm()}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex space-x-2 overflow-x-auto pb-2"
        >
          {["all", "general", "academic", "event", "urgent", "sports"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Announcements List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAnnouncements.map((announcement, index) => 
              renderAnnouncementCard(announcement, index)
            )}
          </AnimatePresence>

          {filteredAnnouncements.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No announcements found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search criteria" : "Check back later for updates"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MobilePageContent>
  );
};