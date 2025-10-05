import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ThemedButton,
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  GradientButton,
  OutlineButton,
  GhostButton,
} from "../ui/themed-button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  Settings,
  Plus,
  Check,
  X,
  Star,
  Send,
  Save,
  Trash2,
  Edit,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemedButtonShowcaseProps {
  onBack?: () => void;
}

export const ThemedButtonShowcase: React.FC<ThemedButtonShowcaseProps> = ({ onBack }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-24">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </motion.button>
            )}
            <div>
              <h1 className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Themed Button Showcase
              </h1>
              <p className="text-sm text-muted-foreground">
                Dynamic color-changing buttons
              </p>
            </div>
          </div>
          
          <GradientButton size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? "Light" : "Dark"} Mode
          </GradientButton>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-r from-blue-50/50 to-sky-50/50 dark:from-blue-900/10 dark:to-sky-900/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
                  <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Theme-Aware Buttons</h3>
                  <p className="text-xs text-muted-foreground">
                    All buttons automatically adapt to your theme changes with smooth transitions.
                    Toggle between light and dark mode to see the colors update instantly!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Primary Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Primary Buttons</span>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Main Actions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton size="sm">Small</PrimaryButton>
                <PrimaryButton size="md">Medium</PrimaryButton>
              </div>
              <PrimaryButton size="lg" fullWidth>
                Large Full Width
              </PrimaryButton>
              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton leftIcon={<Heart className="w-4 h-4" />}>
                  With Icon
                </PrimaryButton>
                <PrimaryButton rightIcon={<Download className="w-4 h-4" />}>
                  Download
                </PrimaryButton>
              </div>
              <PrimaryButton
                fullWidth
                isLoading={loadingStates.primary}
                onClick={() => handleLoadingDemo("primary")}
              >
                Click to Load
              </PrimaryButton>
              <PrimaryButton fullWidth disabled>
                Disabled Button
              </PrimaryButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Secondary Buttons</span>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  Alternative
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <SecondaryButton size="sm">Save</SecondaryButton>
                <SecondaryButton size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
                  Share
                </SecondaryButton>
                <SecondaryButton size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                  Settings
                </SecondaryButton>
              </div>
              <SecondaryButton
                fullWidth
                isLoading={loadingStates.secondary}
                onClick={() => handleLoadingDemo("secondary")}
              >
                Loading Demo
              </SecondaryButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accent Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Accent Buttons</span>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Highlights
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AccentButton leftIcon={<Plus className="w-4 h-4" />}>
                  Add New
                </AccentButton>
                <AccentButton rightIcon={<Send className="w-4 h-4" />}>
                  Send
                </AccentButton>
              </div>
              <AccentButton fullWidth size="lg">
                Call to Action
              </AccentButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gradient Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Gradient Buttons</span>
                <Badge className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-primary border-primary/20">
                  Premium
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <GradientButton fullWidth leftIcon={<Star className="w-4 h-4" />}>
                Featured Action
              </GradientButton>
              <GradientButton fullWidth size="lg">
                Premium Feature
              </GradientButton>
              <GradientButton
                fullWidth
                isLoading={loadingStates.gradient}
                onClick={() => handleLoadingDemo("gradient")}
              >
                Loading Gradient
              </GradientButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Outline Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Outline Buttons</span>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  Subtle
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <OutlineButton leftIcon={<Check className="w-4 h-4" />}>
                  Approve
                </OutlineButton>
                <OutlineButton leftIcon={<X className="w-4 h-4" />}>
                  Cancel
                </OutlineButton>
              </div>
              <OutlineButton fullWidth>Outline Full Width</OutlineButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ghost Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Ghost Buttons</span>
                <Badge variant="outline" className="border-muted text-muted-foreground">
                  Minimal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <GhostButton size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  Save
                </GhostButton>
                <GhostButton size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                  Edit
                </GhostButton>
                <GhostButton size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </GhostButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Icon Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Icon-Only Buttons</span>
                <Badge className="bg-muted text-muted-foreground">
                  Compact
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <ThemedButton variant="primary" size="icon">
                  <Heart className="w-5 h-5" />
                </ThemedButton>
                <ThemedButton variant="secondary" size="icon">
                  <Share2 className="w-5 h-5" />
                </ThemedButton>
                <ThemedButton variant="accent" size="icon">
                  <Plus className="w-5 h-5" />
                </ThemedButton>
                <ThemedButton variant="gradient" size="icon">
                  <Star className="w-5 h-5" />
                </ThemedButton>
                <ThemedButton variant="outline" size="icon">
                  <Eye className="w-5 h-5" />
                </ThemedButton>
                <ThemedButton variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </ThemedButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Grid Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="border-0 bg-gradient-to-br from-muted/20 to-muted/5 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Practical Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <GradientButton fullWidth size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                Create New Class
              </GradientButton>
              <div className="grid grid-cols-2 gap-3">
                <PrimaryButton leftIcon={<Download className="w-4 h-4" />}>
                  Export
                </PrimaryButton>
                <SecondaryButton leftIcon={<Share2 className="w-4 h-4" />}>
                  Share
                </SecondaryButton>
              </div>
              <OutlineButton fullWidth>View Details</OutlineButton>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-6"
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-green-100/50 dark:from-chart-4/20 dark:to-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">
                  Theme-Responsive Design
                </span>
                <Unlock className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-xs text-muted-foreground">
                All buttons use CSS variables for colors, ensuring seamless theme transitions.
                Try switching between light and dark mode above! 🎨
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
