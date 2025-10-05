import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Settings,
  MessageCircle,
  BookOpen,
  Calendar,
  Award,
  Users,
  AlertCircle,
  Info,
  Clock,
  MoreHorizontal,
  Archive,
  Star,
  Volume2,
  VolumeX,
  ArrowLeft,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

// Import centralized notifications hook
import { useNotifications } from "../../hooks/useSchoolData";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "message" | "assignment" | "grade" | "announcement";
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  sender?: string;
  avatar?: string;
  actionable?: boolean;
  category: string;
}

interface MobileNotificationsProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileNotifications: React.FC<MobileNotificationsProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const { notifications: centralNotifications, loading, error, markAsRead, markAllAsRead } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    emailEnabled: false,
    announcements: true,
    assignments: true,
    grades: true,
    messages: true,
    reminders: true
  });

  // Transform central notifications to component format
  const notifications: Notification[] = centralNotifications.map(notif => ({
    id: notif.id,
    title: notif.title,
    message: notif.message,
    type: notif.type === 'info' ? 'info' : 'message',
    timestamp: new Date(notif.createdAt).toLocaleDateString(),
    read: notif.read,
    priority: 'medium' as const,
    sender: 'System',
    actionable: false,
    category: 'Academic'
  }));

  // Remove all hardcoded notifications data
  const hardcodedNotifications: Notification[] = [];

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment": return <BookOpen className="w-5 h-5" />;
      case "grade": return <Award className="w-5 h-5" />;
      case "message": return <MessageCircle className="w-5 h-5" />;
      case "announcement": return <Bell className="w-5 h-5" />;
      case "info": return <Info className="w-5 h-5" />;
      case "warning": return <AlertCircle className="w-5 h-5" />;
      case "error": return <X className="w-5 h-5" />;
      case "success": return <Check className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment": return "bg-blue-100 text-blue-600 border-blue-200";
      case "grade": return "bg-green-100 text-green-600 border-green-200";
      case "message": return "bg-purple-100 text-purple-600 border-purple-200";
      case "announcement": return "bg-indigo-100 text-indigo-600 border-indigo-200";
      case "info": return "bg-cyan-100 text-cyan-600 border-cyan-200";
      case "warning": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "error": return "bg-red-100 text-red-600 border-red-200";
      case "success": return "bg-green-100 text-green-600 border-green-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "border-l-4 border-red-500 bg-red-50/50";
      case "medium": return "border-l-4 border-yellow-500 bg-yellow-50/50";
      case "low": return "border-l-4 border-green-500 bg-green-50/50";
      default: return "border-l-4 border-gray-500 bg-gray-50/50";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notification.read) ||
                         (filter === "read" && notification.read) ||
                         notification.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const handleNotificationAction = (notification: Notification) => {
    if (!notification.actionable) return;

    switch (notification.type) {
      case "assignment":
        onPageChange("assignments");
        break;
      case "grade":
        onPageChange("grades");
        break;
      case "message":
        onPageChange("messages");
        break;
      default:
        break;
    }
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const renderNotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch
                checked={notificationSettings.pushEnabled}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, pushEnabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sound</h4>
                <p className="text-sm text-muted-foreground">Play notification sounds</p>
              </div>
              <Switch
                checked={notificationSettings.soundEnabled}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Vibration</h4>
                <p className="text-sm text-muted-foreground">Vibrate for notifications</p>
              </div>
              <Switch
                checked={notificationSettings.vibrationEnabled}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, vibrationEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <Switch
                checked={notificationSettings.emailEnabled}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, emailEnabled: checked }))
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Notification Types</h4>
            <div className="space-y-3">
              {[
                { key: "announcements", label: "Announcements" },
                { key: "assignments", label: "Assignments" },
                { key: "grades", label: "Grades" },
                { key: "messages", label: "Messages" },
                { key: "reminders", label: "Reminders" }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <Switch
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (showSettings) {
    return (
      <MobilePageContent
        title="Notification Settings"
        onBack={() => setShowSettings(false)}
      >
        <div className="p-4">
          {renderNotificationSettings()}
        </div>
      </MobilePageContent>
    );
  }

  return (
    <MobilePageContent
      title="Notifications"
      onBack={onBack}
      rightAction={
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="p-2"
          >
            <CheckCheck className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "assignment", label: "Assignments" },
              { value: "grade", label: "Grades" },
              { value: "message", label: "Messages" },
              { value: "announcement", label: "Announcements" }
            ].map(filterOption => (
              <Button
                key={filterOption.value}
                variant={filter === filterOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.value)}
                className="whitespace-nowrap"
              >
                {filterOption.label}
                {filterOption.value === "unread" && unreadCount > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {searchQuery || filter !== "all" 
                  ? "No notifications match your criteria"
                  : "You're all caught up!"}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-card rounded-xl border border-border/50 ${
                  !notification.read ? getPriorityColor(notification.priority) : ''
                } ${notification.actionable ? 'cursor-pointer hover:bg-muted/50' : ''} transition-colors`}
                onClick={() => notification.actionable && handleNotificationAction(notification)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium truncate ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className={`text-sm text-muted-foreground mb-2 ${!notification.read ? 'text-foreground' : ''}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {notification.sender && notification.sender !== "System" && (
                            <div className="flex items-center space-x-1">
                              {notification.avatar && (
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={notification.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {notification.sender.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {notification.sender}
                              </span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MobilePageContent>
  );
};