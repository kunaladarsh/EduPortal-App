import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigationFeatures } from '../../contexts/FeatureContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Home, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Shield,
  BookOpen,
  UserCheck,
  Award,
  Calendar,
  BarChart3,
  User,
  Bell,
  BookMarked,
  HardDrive
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';

interface MobileNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const navigationFeatures = useNavigationFeatures();
  const [isOpen, setIsOpen] = useState(false);

  const getNavItems = () => {
    // Convert feature configs to navigation items
    const iconMap: Record<string, any> = {
      Home,
      User,
      Settings,
      Bell,
      ClipboardList,
      Award,
      UserCheck,
      Calendar,
      MessageSquare,
      BookOpen,
      BookMarked,
      HardDrive,
      GraduationCap,
      BarChart3,
    };

    return navigationFeatures.map(feature => ({
      id: feature.id,
      label: feature.name,
      icon: iconMap[feature.icon] || Settings,
      description: feature.description
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'teacher': return 'default';
      case 'student': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return BookOpen;
      case 'student': return Users;
      default: return Users;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = getNavItems();

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  const RoleIcon = getRoleIcon(user?.role || '');

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-card to-card/80 backdrop-blur-lg">
          <div className="flex flex-col h-full max-h-screen">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-4">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      EduPortal
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                      Navigate through your classroom dashboard and access all features
                    </SheetDescription>
                  </div>
                </div>
                
                {/* User Profile */}
                <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-xl">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                      {getInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <Badge variant={getRoleBadgeColor(user?.role || '') as any} className="mt-1 text-xs">
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="space-y-2 pb-4">
                {/* Feature Management for Admin */}
                {user?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Button
                      variant={currentPage === 'feature-management' ? 'default' : 'ghost'}
                      className={`w-full justify-start h-auto p-4 ${
                        currentPage === 'feature-management' 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => handleNavClick('feature-management')}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-lg ${
                          currentPage === 'feature-management' 
                            ? 'bg-primary-foreground/20' 
                            : 'bg-accent/50'
                        }`}>
                          <Settings className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium">Feature Management</div>
                          <div className={`text-xs ${
                            currentPage === 'feature-management' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            Configure app features
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                )}
                
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      className={`w-full justify-start h-auto p-4 ${
                        currentPage === item.id 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-lg ${
                          currentPage === item.id 
                            ? 'bg-primary-foreground/20' 
                            : 'bg-accent/50'
                        }`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${
                            currentPage === item.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-6 pt-4 border-t border-border/50 bg-gradient-to-t from-card/95 to-transparent">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 text-destructive hover:text-destructive hover:bg-destructive/10 group"
                  onClick={logout}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">Sign Out</div>
                      <div className="text-xs text-destructive/70">
                        Exit your session
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};