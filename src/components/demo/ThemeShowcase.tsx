// Theme showcase component to demonstrate dynamic theming
import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Palette,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  Award,
  Target,
} from 'lucide-react';

export const ThemeShowcase: React.FC = () => {
  const { currentTheme, isDarkMode, availableThemes, applyTheme } = useTheme();

  const showcaseItems = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Progress Tracking",
      value: "89%",
      change: "+12%",
      color: "primary",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Class Attendance",
      value: "156",
      change: "+8",
      color: "secondary",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Achievements",
      value: "24",
      change: "+3",
      color: "accent",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Dynamic Theme Showcase</h1>
        <p className="text-muted-foreground">
          Experience the power of dynamic theming
        </p>
        {currentTheme && (
          <Badge variant="secondary" className="mt-2">
            {currentTheme.name} • {isDarkMode ? 'Dark' : 'Light'} Mode
          </Badge>
        )}
      </motion.div>

      {/* Color Palette Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Current Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm mx-auto mb-2"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
                <p className="text-xs font-medium">Primary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm mx-auto mb-2"
                  style={{ backgroundColor: 'var(--secondary)' }}
                />
                <p className="text-xs font-medium">Secondary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm mx-auto mb-2"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                <p className="text-xs font-medium">Accent</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm mx-auto mb-2"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <p className="text-xs font-medium">Muted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* UI Components Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="font-semibold text-lg">UI Components</h3>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${item.color}/10 flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                        <p className="text-lg font-semibold">{item.value}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Interactive Elements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reading Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Assignment Completion</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary Action</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </div>

            {/* User List */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Activity</p>
              {[
                { name: "Alice Johnson", action: "submitted assignment", time: "2 min ago" },
                { name: "Bob Smith", action: "joined class", time: "5 min ago" },
                { name: "Carol White", action: "commented", time: "10 min ago" },
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{user.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Theme Test */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Quick Theme Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {availableThemes.slice(0, 4).map((theme) => (
                <Button
                  key={theme.id}
                  variant={currentTheme?.id === theme.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyTheme(theme.id)}
                  className="h-auto flex-col p-3 gap-1"
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: isDarkMode ? theme.dark.primary : theme.light.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: isDarkMode ? theme.dark.secondary : theme.light.secondary }}
                    />
                  </div>
                  <span className="text-xs">{theme.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Dynamic Theming Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {[
                "🎨 Real-time color updates",
                "🌙 Automatic dark/light mode",
                "📱 Mobile-optimized interface", 
                "🔄 API-driven theme loading",
                "🎯 Role-based customization",
                "💾 User preference persistence",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/5"
                >
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Love Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl"
      >
        <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Built with ❤️ for dynamic, accessible, and beautiful user experiences
        </p>
      </motion.div>
    </div>
  );
};