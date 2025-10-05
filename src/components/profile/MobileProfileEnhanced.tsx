import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  BookOpen,
  Clock,
  Users,
  Settings,
  ChevronRight,
  Star,
  Briefcase,
  GraduationCap,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Share2,
  Heart,
  Target,
  TrendingUp,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MobileProfileEnhancedProps {
  onPageChange: (page: string) => void;
}

export const MobileProfileEnhanced: React.FC<MobileProfileEnhancedProps> = ({
  onPageChange,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@school.edu",
    phone: "+1 (555) 123-4567",
    address: "123 School Street, City, State 12345",
    bio: "Passionate educator focused on student success and innovative teaching methods.",
    joinDate: "September 2023",
    department: user?.role === "teacher" ? "Mathematics" : "Grade 10",
    subjects: user?.role === "teacher" ? ["Algebra", "Geometry", "Calculus"] : ["Math", "Science", "English"],
  });

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    publicProfile: true,
    showEmail: false,
    showPhone: false,
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success("Setting updated!");
  };

  const getStatsForRole = () => {
    if (user?.role === "teacher") {
      return [
        { label: "Classes", value: "5", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Students", value: "127", icon: <Users className="w-4 h-4" /> },
        { label: "Experience", value: "3 yrs", icon: <Calendar className="w-4 h-4" /> },
        { label: "Rating", value: "4.8", icon: <Star className="w-4 h-4" /> },
      ];
    } else if (user?.role === "student") {
      return [
        { label: "Classes", value: "6", icon: <BookOpen className="w-4 h-4" /> },
        { label: "GPA", value: "3.8", icon: <Award className="w-4 h-4" /> },
        { label: "Projects", value: "12", icon: <Target className="w-4 h-4" /> },
        { label: "Attendance", value: "95%", icon: <Clock className="w-4 h-4" /> },
      ];
    } else {
      return [
        { label: "Schools", value: "1", icon: <GraduationCap className="w-4 h-4" /> },
        { label: "Teachers", value: "24", icon: <Users className="w-4 h-4" /> },
        { label: "Students", value: "485", icon: <User className="w-4 h-4" /> },
        { label: "Classes", value: "32", icon: <BookOpen className="w-4 h-4" /> },
      ];
    }
  };

  const getAchievements = () => {
    if (user?.role === "teacher") {
      return [
        { title: "Excellence in Teaching", date: "2024", color: "text-yellow-600" },
        { title: "Student Favorite", date: "2023", color: "text-blue-600" },
        { title: "Innovation Award", date: "2023", color: "text-green-600" },
      ];
    } else {
      return [
        { title: "Honor Roll", date: "2024", color: "text-yellow-600" },
        { title: "Science Fair Winner", date: "2023", color: "text-blue-600" },
        { title: "Perfect Attendance", date: "2023", color: "text-green-600" },
      ];
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block mb-4">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="sm" 
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={() => toast.success("Camera feature coming soon!")}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center font-semibold"
              />
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="text-center text-sm"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.email}</p>
            </>
          )}
          
          <Badge variant="secondary" className="capitalize">
            {user?.role || 'User'}
          </Badge>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        {getStatsForRole().map((stat, index) => (
          <Card key={stat.label} className="border-0 bg-gradient-to-br from-muted/50 to-muted/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2 text-primary">
                {stat.icon}
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profileData.bio}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <span className="text-sm">{profileData.email}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <span className="text-sm">{profileData.phone}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  />
                ) : (
                  <span className="text-sm">{profileData.address}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getAchievements().map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${achievement.color.replace('text', 'bg')}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  </div>
                  <Trophy className={`w-4 h-4 ${achievement.color}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Public Profile</div>
                <div className="text-xs text-muted-foreground">Make your profile visible to others</div>
              </div>
              <Switch
                checked={settings.publicProfile}
                onCheckedChange={(checked) => handleSettingChange('publicProfile', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Show Email</div>
                <div className="text-xs text-muted-foreground">Display email in your profile</div>
              </div>
              <Switch
                checked={settings.showEmail}
                onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Show Phone</div>
                <div className="text-xs text-muted-foreground">Display phone number in your profile</div>
              </div>
              <Switch
                checked={settings.showPhone}
                onCheckedChange={(checked) => handleSettingChange('showPhone', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Receive notifications on your device</div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Email Updates</div>
                <div className="text-xs text-muted-foreground">Receive updates via email</div>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onPageChange("profile-edit")}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile Details
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.success("Password change requested!")}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.success("Profile data exported!")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </motion.div>
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
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={() => onPageChange("dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            {renderProfileTab()}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            {renderSettingsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};