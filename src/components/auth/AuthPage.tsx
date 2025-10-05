import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { TermsPage } from './TermsPage';
import { PrivacyPage } from './PrivacyPage';
import { 
  GraduationCap, 
  Sparkles, 
  Shield, 
  Zap,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Globe,
  Rocket
} from 'lucide-react';

type AuthView = 'auth' | 'terms' | 'privacy';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentView, setCurrentView] = useState<AuthView>('auth');
  const { config: appConfig } = useAppConfig();

  const features = [
    {
      icon: BookOpen,
      title: "Smart Learning",
      subtitle: "AI-powered education",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      color: "text-blue-500",
      bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent"
    },
    {
      icon: Users,
      title: "Stay Connected",
      subtitle: "Real-time collaboration",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      color: "text-purple-500",
      bgGradient: "from-purple-500/10 via-purple-500/5 to-transparent"
    },
    {
      icon: Award,
      title: "Track Progress",
      subtitle: "Achieve your goals",
      gradient: "from-emerald-500 via-emerald-600 to-teal-500",
      color: "text-emerald-500",
      bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent"
    },
  ];

  const stats = [
    { value: "10K+", label: "Students", icon: Users },
    { value: "500+", label: "Teachers", icon: BookOpen },
    { value: "4.9", label: "Rating", icon: Star },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Show Terms or Privacy page
  if (currentView === 'terms') {
    return <TermsPage onBack={() => setCurrentView('auth')} />;
  }

  if (currentView === 'privacy') {
    return <PrivacyPage onBack={() => setCurrentView('auth')} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Gradient Orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-tr from-accent/20 via-secondary/15 to-transparent rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl" />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
              opacity: 0.2,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-area-top safe-area-bottom">
        {/* Hero Section */}
        <motion.div 
          className="px-6 pt-8 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo & Brand */}
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2 
              }}
            >
              {appConfig.logoUrl ? (
                <img 
                  src={appConfig.logoUrl} 
                  alt={appConfig.appName}
                  className="h-32 w-32 object-contain mx-auto block"
                />
              ) : (
                <GraduationCap className="h-32 w-32 text-primary" />
              )}
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-center">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {appConfig.appName}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Transform your learning journey with our powerful platform
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex items-center justify-between gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex-1 relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >

              </motion.div>
            ))}
          </motion.div>

          {/* Feature Showcase */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="relative"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative p-6 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].bgGradient}`} />
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />

                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].gradient} rounded-2xl blur-xl opacity-50`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <div className={`relative p-4 bg-gradient-to-br ${features[activeFeature].gradient} rounded-2xl shadow-lg`}>
                        {React.createElement(features[activeFeature].icon, {
                          className: "h-7 w-7 text-white"
                        })}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-0.5 text-lg">
                        {features[activeFeature].title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {features[activeFeature].subtitle}
                      </p>
                    </div>

                    {/* Pulse Indicator */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className={`w-2 h-2 rounded-full ${features[activeFeature].color.replace('text-', 'bg-')}`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            {/* <div className="flex justify-center gap-2 mt-4">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className="group"
                >
                  <div className={`h-1 rounded-full transition-all duration-300 ${
                    index === activeFeature 
                      ? 'w-8 bg-primary' 
                      : 'w-1.5 bg-border group-hover:bg-primary/50'
                  }`} />
                </button>
              ))}
            </div> */}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: Shield, text: "Secure" },
              { icon: Zap, text: "Fast" },
              { icon: Globe, text: "Global" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Auth Section */}
        <div className="flex-1 px-6 pb-6">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Tab Switcher */}
            <div className="relative mb-5 p-1 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/30">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-br from-card to-card/90 rounded-xl shadow-lg border border-border/50"
                animate={{
                  x: isLogin ? 4 : 'calc(100% + 4px)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35
                }}
              />
              
              <div className="relative grid grid-cols-2 gap-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`relative z-10 py-3.5 px-4 rounded-xl transition-all duration-200 ${
                    isLogin 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="font-semibold text-sm">Sign In</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`relative z-10 py-3.5 px-4 rounded-xl transition-all duration-200 ${
                    !isLogin 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="font-semibold text-sm">Sign Up</span>
                </button>
              </div>
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm 
                    onSwitchToLogin={() => setIsLogin(true)}
                    onShowTerms={() => setCurrentView('terms')}
                    onShowPrivacy={() => setCurrentView('privacy')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          className="px-6 pb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-muted-foreground">
            © 2025 {appConfig.appName}. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <button 
              onClick={() => setCurrentView('terms')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Terms of Service
            </button>
            <span className="text-xs text-border">•</span>
            <button 
              onClick={() => setCurrentView('privacy')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
