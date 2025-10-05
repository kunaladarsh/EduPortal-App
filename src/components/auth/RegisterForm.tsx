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
  User,
  ArrowRight,
  AlertCircle,
  Check,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { UserRole } from "../../types";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onShowTerms?: () => void;
  onShowPrivacy?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSwitchToLogin,
  onShowTerms,
  onShowPrivacy 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-emerald-500" },
    ];

    return levels.find(l => l.strength === strength) || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.email, formData.password, formData.name, formData.role as UserRole);
      
      if (success) {
        toast.success("Account created successfully! 🎉");
      } else {
        setError("An account with this email already exists");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "admin" as UserRole,
      label: "Administrator",
      icon: Shield,
      description: "Full system control",
      gradient: "from-red-500 via-pink-500 to-purple-500",
      bgGradient: "from-red-500/10 to-pink-500/10"
    },
    {
      value: "teacher" as UserRole,
      label: "Teacher",
      icon: BookOpen,
      description: "Manage classes & students",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      value: "student" as UserRole,
      label: "Student",
      icon: GraduationCap,
      description: "Access learning materials",
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--secondary)/5,transparent_50%),radial-gradient(circle_at_bottom_right,var(--accent)/5,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-secondary/10 via-transparent to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/10 via-transparent to-transparent rounded-tl-full" />
        
        <CardContent className="relative p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Full Name</label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-100' : ''}`} />
                
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-4 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Email</label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : ''}`} />
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-4 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
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
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Confirm Password</label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === 'confirmPassword' ? 'opacity-100' : ''}`} />
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base relative z-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  
                  {/* Password Match Indicator */}
                  {passwordsMatch && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/90">Choose your role</label>
                {formData.role && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs text-emerald-500 flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Selected
                  </motion.span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map((role, index) => (
                  <motion.button
                    key={role.value}
                    type="button"
                    onClick={() => handleInputChange('role', role.value)}
                    className="relative group overflow-hidden rounded-xl"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    disabled={isLoading}
                  >
                    {/* Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${role.bgGradient} ${formData.role === role.value ? 'opacity-100' : 'opacity-30'} group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Shine Effect */}
                    <AnimatePresence>
                      {formData.role === role.value && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <div className={`relative flex items-center gap-3 p-3 bg-card/60 backdrop-blur-sm border-2 ${formData.role === role.value ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/30'} rounded-xl transition-all duration-300`}>
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className={`relative p-2 bg-gradient-to-br ${role.gradient} rounded-lg shadow-lg`}>
                          <role.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{role.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{role.description}</p>
                      </div>
                      
                      {/* Selection Indicator */}
                      <AnimatePresence>
                        {formData.role === role.value ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="flex-shrink-0 p-1 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg"
                          >
                            <Check className="h-3.5 w-3.5 text-white" />
                          </motion.div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-border/50 group-hover:border-primary/50 transition-colors" />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Terms & Benefits */}
            <motion.div 
              className="pt-2 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Terms */}
              <div className="px-2.5 py-2 bg-muted/20 rounded-lg border border-border/30 space-y-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer shrink-0"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onShowTerms) {
                          onShowTerms();
                        } else {
                          toast.info("Terms of Service");
                        }
                      }}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Terms of Service
                    </button>
                  </label>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="privacy-checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer shrink-0"
                    disabled={isLoading}
                  />
                  <label htmlFor="privacy-checkbox" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onShowPrivacy) {
                          onShowPrivacy();
                        } else {
                          toast.info("Privacy Policy");
                        }
                      }}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-1.5">
                {[
                  { icon: Sparkles, text: "Premium features included" },
                  { icon: Shield, text: "Bank-level security" },
                  { icon: Users, text: "Join 10K+ users" },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 p-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Create Account Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className="relative w-full h-12 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 overflow-hidden group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !agreedToTerms || !agreedToPrivacy}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <span className="relative flex items-center justify-center gap-2 font-semibold">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};