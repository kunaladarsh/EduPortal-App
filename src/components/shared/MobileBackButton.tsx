import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useNavigation } from "../../contexts/NavigationContext";

interface MobileBackButtonProps {
  onBack?: () => void;
  title?: string;
  className?: string;
}

export const MobileBackButton: React.FC<MobileBackButtonProps> = ({ 
  onBack, 
  title,
  className = ""
}) => {
  const { goBack } = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Use the navigation context which handles Android back button properly
      const handled = goBack();
      if (!handled) {
        // Fallback behavior (exit app or go to home)
        window.location.href = '/';
      }
    }
  };

  return (
    <motion.div 
      className={`sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {title && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
      </div>
    </motion.div>
  );
};