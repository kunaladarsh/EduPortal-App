import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  Bell,
  FileText,
  BarChart3,
  Settings,
  ClipboardList,
  UserPlus,
  Megaphone,
  PieChart,
  Library,
  CheckCircle,
  Shield,
  Monitor,
  Database,
  Palette,
  Key,
  Layers
} from "lucide-react";

interface MobileServicesHubProps {
  onPageChange: (page: string) => void;
  onBack?: () => void;
}

export const MobileServicesHub: React.FC<MobileServicesHubProps> = ({ onPageChange, onBack }) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getServiceCategories = () => {
    switch (user?.role) {
      case "student":
        return [
          "All", "Learning", "Assessment", "Communication", "Resources", "Tools"
        ];
      case "teacher":
        return [
          "All", "Teaching", "Assessment", "Management", "Communication", "Analytics"
        ];
      case "admin":
        return [
          "All", "Management", "Analytics", "System", "Security", "Configuration"
        ];
      default:
        return ["All"];
    }
  };

  const getAllServices = useMemo(() => {
    const baseServices = [];
    
    switch (user?.role) {
      case "student":
        baseServices.push(
          { id: "assignments", name: "Assignments", description: "View and submit tasks", icon: ClipboardList, category: "Learning", color: "from-blue-500 to-cyan-500", popular: true },
          { id: "grades", name: "Grades", description: "Check your performance", icon: BarChart3, category: "Assessment", color: "from-green-500 to-emerald-500", popular: true },
          { id: "calendar", name: "Schedule", description: "Your class timetable", icon: Calendar, category: "Learning", color: "from-purple-500 to-pink-500", popular: true },
          { id: "library", name: "Library", description: "Digital resources", icon: Library, category: "Resources", color: "from-orange-500 to-red-500", popular: true },
          { id: "messages", name: "Messages", description: "Chat with teachers", icon: MessageSquare, category: "Communication", color: "from-blue-600 to-purple-600" },
          { id: "announcements", name: "Announcements", description: "School updates", icon: Megaphone, category: "Communication", color: "from-yellow-500 to-orange-500" },
          { id: "documents", name: "Documents", description: "Study materials", icon: FileText, category: "Resources", color: "from-indigo-500 to-blue-500" },
          { id: "profile", name: "Profile", description: "Manage your info", icon: Users, category: "Tools", color: "from-gray-500 to-gray-600" },
          { id: "settings", name: "Settings", description: "App preferences", icon: Settings, category: "Tools", color: "from-slate-500 to-gray-500" },
          { id: "notifications", name: "Notifications", description: "All your alerts", icon: Bell, category: "Communication", color: "from-red-500 to-pink-500" }
        );
        break;
        
      case "teacher":
        baseServices.push(
          { id: "teacher_classes", name: "My Classes", description: "Manage your classes", icon: BookOpen, category: "Teaching", color: "from-blue-500 to-indigo-500", popular: true },
          { id: "attendance", name: "Attendance", description: "Take attendance", icon: CheckCircle, category: "Management", color: "from-green-500 to-teal-500", popular: true },
          { id: "grades", name: "Gradebook", description: "Grade assignments", icon: BarChart3, category: "Assessment", color: "from-purple-500 to-violet-500", popular: true },
          { id: "announcements", name: "Announcements", description: "Post updates", icon: Megaphone, category: "Communication", color: "from-orange-500 to-amber-500", popular: true },
          { id: "reports", name: "Reports", description: "Performance analytics", icon: PieChart, category: "Analytics", color: "from-indigo-500 to-purple-500" },
          { id: "assignments", name: "Assignments", description: "Create and manage", icon: ClipboardList, category: "Assessment", color: "from-blue-600 to-cyan-600" },
          { id: "messages", name: "Messages", description: "Student communication", icon: MessageSquare, category: "Communication", color: "from-pink-500 to-red-500" },
          { id: "calendar", name: "Calendar", description: "Schedule management", icon: Calendar, category: "Management", color: "from-violet-500 to-purple-500" },
          { id: "documents", name: "Resources", description: "Teaching materials", icon: FileText, category: "Teaching", color: "from-teal-500 to-cyan-500" },
          { id: "profile", name: "Profile", description: "Manage your info", icon: Users, category: "Tools", color: "from-gray-500 to-gray-600" },
          { id: "settings", name: "Settings", description: "App preferences", icon: Settings, category: "Tools", color: "from-slate-500 to-gray-500" },
          { id: "notifications", name: "Notifications", description: "All your alerts", icon: Bell, category: "Communication", color: "from-red-500 to-pink-500" }
        );
        break;
        
      case "admin":
        baseServices.push(
          { id: "user-management", name: "User Management", description: "Manage all users", icon: UserPlus, category: "Management", color: "from-blue-500 to-cyan-500", popular: true },
          { id: "classes", name: "Class Management", description: "Manage all classes", icon: BookOpen, category: "Management", color: "from-green-500 to-emerald-500", popular: true },
          { id: "reports", name: "Analytics", description: "System reports", icon: PieChart, category: "Analytics", color: "from-purple-500 to-pink-500", popular: true },
          { id: "feature-management", name: "Features", description: "System configuration", icon: Settings, category: "Configuration", color: "from-orange-500 to-red-500", popular: true },
          { id: "announcements", name: "Announcements", description: "School-wide updates", icon: Megaphone, category: "Management", color: "from-orange-600 to-red-600" },
          { id: "calendar", name: "Calendar", description: "System calendar", icon: Calendar, category: "Management", color: "from-violet-500 to-purple-500" },
          { id: "messages", name: "Messages", description: "System communication", icon: MessageSquare, category: "Management", color: "from-pink-500 to-red-500" },
          { id: "documents", name: "Documents", description: "System documents", icon: FileText, category: "Management", color: "from-indigo-500 to-blue-500" },
          { id: "profile", name: "Profile", description: "Manage your info", icon: Users, category: "Tools", color: "from-gray-500 to-gray-600" },
          { id: "settings", name: "Settings", description: "App preferences", icon: Settings, category: "Tools", color: "from-slate-500 to-gray-500" },
          { id: "notifications", name: "Notifications", description: "System alerts", icon: Bell, category: "System", color: "from-pink-500 to-rose-500" }
        );
        break;
    }
    
    return baseServices.filter(service => 
      isFeatureEnabled(service.id) || 
      service.id === "profile" || 
      service.id === "settings" || 
      service.id === "notifications"
    );
  }, [user?.role, isFeatureEnabled]);

  const categories = getServiceCategories();
  const allServices = getAllServices;

  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allServices, searchQuery, selectedCategory]);

  const popularServices = useMemo(() => {
    return allServices.filter(service => service.popular);
  }, [allServices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-white/20 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <h1 className="text-lg font-semibold">All Services</h1>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 bg-white/20 rounded-xl"
            >
              {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pl-12 h-12 rounded-2xl backdrop-blur-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map(category => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-white text-primary"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-6 -mt-4 relative z-10">
        {/* Popular Services */}
        {selectedCategory === "All" && !searchQuery && popularServices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Popular Services</h2>
              <Badge className="bg-primary/10 text-primary">Most Used</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {popularServices.slice(0, 4).map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPageChange(service.id)}
                    className="group"
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Services */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedCategory === "All" ? "All Services" : selectedCategory}
            </h2>
            <Badge variant="outline">
              {filteredServices.length} services
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-3"}
            >
              {filteredServices.map((service, index) => {
                const Icon = service.icon;
                
                if (viewMode === "list") {
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onPageChange(service.id)}
                      className="w-full group"
                    >
                      <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-primary transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-gray-500 text-xs">
                                {service.description}
                              </p>
                            </div>
                            {service.popular && (
                              <Badge className="bg-primary/10 text-primary text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.button>
                  );
                }

                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPageChange(service.id)}
                    className="group"
                  >
                    <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                      <CardContent className="p-4">
                        {service.popular && (
                          <Badge className="absolute top-2 right-2 bg-primary/10 text-primary text-xs">
                            Popular
                          </Badge>
                        )}
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No services found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileServicesHub;