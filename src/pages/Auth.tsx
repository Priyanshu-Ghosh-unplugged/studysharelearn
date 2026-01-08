import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { GraduationCap, BookOpen, ArrowLeft, Mail, Lock, User } from 'lucide-react';

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });
const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter"
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter"
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number"
  });
const nameSchema = z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          // Generic message - don't reveal if account exists (prevents enumeration)
          toast({
            title: "Authentication failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in."
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          // Generic message - don't reveal if email is already registered (prevents enumeration)
          toast({
            title: "Registration failed",
            description: "Unable to create account. Please try a different email or contact support.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account created!",
            description: `Welcome to StudyShare as a ${role}!`
          });
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
              <span className="text-secondary">▲</span>
              StudyShare
            </div>
            <p className="text-muted-foreground">
              {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
            </p>
          </div>

          {/* Role selector (signup only) */}
          {!isLogin && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">I want to:</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === 'student'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium block">Learn</span>
                  <span className="text-xs text-muted-foreground">Find a tutor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === 'tutor'
                      ? 'border-secondary bg-secondary/5 text-secondary'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium block">Teach</span>
                  <span className="text-xs text-muted-foreground">Become a tutor</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-destructive text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
