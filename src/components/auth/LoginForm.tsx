import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Fingerprint,
  Smartphone,
  Chrome,
  Apple,
  CheckCircle2,
  Shield
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success("Welcome back! 🎉");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const socialOptions = [
    { 
      icon: Chrome, 
      label: "Google", 
      gradient: "from-red-500 to-orange-500",
      hoverGradient: "from-red-600 to-orange-600"
    },
    { 
      icon: Apple, 
      label: "Apple", 
      gradient: "from-gray-700 to-gray-900",
      hoverGradient: "from-gray-800 to-black"
    },
    { 
      icon: Smartphone, 
      label: "Phone", 
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "from-blue-600 to-cyan-600"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Premium Card */}
      <Card className="w-full border-0 bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)/5,transparent_50%),radial-gradient(circle_at_bottom_left,var(--secondary)/5,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 via-transparent to-transparent rounded-tr-full" />
        
        <CardContent className="relative p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Email</label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : ''}`} />
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    className="h-14 pl-12 pr-4 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Password</label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-100' : ''}`} />
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="h-14 pl-12 pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                onClick={() => toast.info("Password reset link will be sent to your email")}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>

            {/* Sign In Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="relative w-full h-14 bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 overflow-hidden group rounded-xl"
                disabled={isLoading}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <span className="relative flex items-center justify-center gap-2 font-semibold">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-xs text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Biometric & Social Login */}
          <div className="space-y-3">
            {/* Biometric */}
            <motion.button
              onClick={() => toast.info("Biometric authentication will be available soon")}
              className="w-full group relative overflow-hidden rounded-xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />
              
              <div className="relative flex items-center justify-center gap-3 p-3.5 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl group-hover:border-primary/30 transition-all">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground/90 group-hover:text-foreground">Use Biometric Login</span>
              </div>
            </motion.button>

            {/* Social Options */}
            <div className="grid grid-cols-3 gap-3">
              {socialOptions.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => toast.info(`${option.label} sign-in coming soon`)}
                  className="group relative overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative p-4 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl group-hover:border-border/50 transition-all">
                    <option.icon className="h-6 w-6 mx-auto text-foreground/60 group-hover:text-foreground transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <motion.div 
            className="mt-6 p-4 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl border border-emerald-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg">
                <Shield className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground/90 mb-0.5">Secure & Private</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your data is encrypted end-to-end. We never share your information.
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            </div>
          </motion.div>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
                disabled={isLoading}
              >
                Sign up for free
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};