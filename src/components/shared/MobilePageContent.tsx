import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";

interface MobilePageContentProps {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBackButton?: boolean;
}

export const MobilePageContent: React.FC<MobilePageContentProps> = ({
  title,
  children,
  onBack,
  rightAction,
  showBackButton = true
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 safe-area-top"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          </div>

          <div className="w-10 h-10 flex items-center justify-center">
            {rightAction || (
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="pb-safe"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};