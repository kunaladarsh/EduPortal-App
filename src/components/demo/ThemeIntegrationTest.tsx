// Component to test theme integration across all UI elements
import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Palette,
  Check,
  X,
  Star,
  Heart,
  Zap,
  Sparkles,
  TestTube,
} from 'lucide-react';

export const ThemeIntegrationTest: React.FC = () => {
  const { currentTheme, isDarkMode, availableThemes, applyTheme } = useTheme();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <TestTube className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Theme Integration Test</h1>
        <p className="text-muted-foreground">
          Testing dynamic colors across all UI components
        </p>
        {currentTheme && (
          <Badge variant="secondary">
            {currentTheme.name} • {isDarkMode ? 'Dark' : 'Light'}
          </Badge>
        )}
      </motion.div>

      {/* Quick Theme Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Theme Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {availableThemes.slice(0, 4).map((theme) => (
              <Button
                key={theme.id}
                variant={currentTheme?.id === theme.id ? "default" : "outline"}
                size="sm"
                onClick={() => applyTheme(theme.id)}
                className="h-auto p-3 flex flex-col gap-2"
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
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: isDarkMode ? theme.dark.accent : theme.light.accent }}
                  />
                </div>
                <span className="text-xs">{theme.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Test Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Variables Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { name: 'Primary', var: 'var(--primary)', textVar: 'var(--primary-foreground)' },
              { name: 'Secondary', var: 'var(--secondary)', textVar: 'var(--secondary-foreground)' },
              { name: 'Accent', var: 'var(--accent)', textVar: 'var(--accent-foreground)' },
              { name: 'Muted', var: 'var(--muted)', textVar: 'var(--muted-foreground)' },
              { name: 'Card', var: 'var(--card)', textVar: 'var(--card-foreground)' },
              { name: 'Background', var: 'var(--background)', textVar: 'var(--foreground)' },
              { name: 'Border', var: 'var(--border)', textVar: 'var(--foreground)' },
              { name: 'Destructive', var: 'var(--destructive)', textVar: 'var(--destructive-foreground)' },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div 
                  className="w-full h-12 rounded-lg border flex items-center justify-center text-xs font-medium"
                  style={{ 
                    backgroundColor: color.var,
                    color: color.textVar,
                  }}
                >
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UI Components Test */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">UI Components Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buttons */}
          <div>
            <p className="text-sm font-medium mb-2">Buttons</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="destructive" size="sm">Destructive</Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-sm font-medium mb-2">Badges</p>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Form Elements */}
          <div>
            <p className="text-sm font-medium mb-2">Form Elements</p>
            <div className="space-y-2">
              <Input placeholder="Test input field" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Toggle Switch</span>
                <Switch />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <p className="text-sm font-medium mb-2">Progress</p>
            <Progress value={65} className="h-2" />
          </div>

          {/* User Cards */}
          <div>
            <p className="text-sm font-medium mb-2">User Components</p>
            <div className="space-y-2">
              {[
                { name: "Alice Johnson", role: "Student", color: "primary" },
                { name: "Bob Smith", role: "Teacher", color: "secondary" },
                { name: "Carol White", role: "Admin", color: "accent" },
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <Avatar>
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <p className="text-sm font-medium mb-2">Alerts</p>
            <div className="space-y-2">
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Theme successfully applied!
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>
                  Error alert with destructive styling.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: <Star className="w-5 h-5" />, title: "Achievements", value: "24", change: "+3", color: "primary" },
          { icon: <Heart className="w-5 h-5" />, title: "Favorites", value: "89", change: "+12", color: "secondary" },
          { icon: <Zap className="w-5 h-5" />, title: "Energy", value: "156", change: "+8", color: "accent" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `var(--${stat.color})`,
                        color: `var(--${stat.color}-foreground)`
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-lg font-semibold">{stat.value}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{stat.change}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Integration Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl"
      >
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          🎉 Dynamic theming is working perfectly! All colors update in real-time.
        </p>
      </motion.div>
    </div>
  );
};