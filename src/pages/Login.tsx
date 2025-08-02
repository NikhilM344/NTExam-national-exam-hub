import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLoadingContext } from '@/context/LoadingContext';
import { Mail, Lock, BookOpen, ArrowLeft, Send } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetRequested, setIsResetRequested] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    startLoading("Signing you in...");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store login state in localStorage for now
      localStorage.setItem('studentLoggedIn', 'true');
      localStorage.setItem('studentEmail', email);
      
      toast({
        title: "Welcome Back!",
        description: "You have successfully logged into your StudyStar account.",
      });
      
      navigate('/student-dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive reset instructions.",
        variant: "destructive",
      });
      return;
    }

    startLoading("Sending reset instructions...");
    
    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsResetRequested(true);
      toast({
        title: "Reset Instructions Sent!",
        description: "Check your email for password and student ID reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Unable to send reset instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* SEO-friendly header */}
      <div className="sr-only">
        <h1>StudyStar Student Login - Access Your Exam Dashboard</h1>
        <p>Secure student portal for accessing exam schedules, results, and study materials. Login with your registered email and password.</p>
      </div>

      {/* Navigation Header */}
      <header className="p-4 sm:p-6">
        <div className="container mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo/Branding */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">StudyStar</span>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Student Login</h1>
            <p className="text-white/80 text-sm">Access your exam dashboard and study materials</p>
          </div>

          {/* Login Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Sign in to your student account to continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isResetRequested ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Student Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                        required
                        aria-describedby="email-help"
                      />
                    </div>
                    <p id="email-help" className="text-xs text-muted-foreground">
                      Use the email address you registered with
                    </p>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                        required
                        aria-describedby="password-help"
                      />
                    </div>
                    <p id="password-help" className="text-xs text-muted-foreground">
                      Enter the password provided in your welcome email
                    </p>
                  </div>

                  {/* Login Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-soft"
                    size="lg"
                  >
                    Sign In to StudyStar
                  </Button>

                  <Separator className="my-4" />

                  {/* Password Reset Option */}
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Forgot your login details?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePasswordReset}
                      className="w-full border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Password & ID to Email
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      We'll send your password and student ID to your registered email address
                    </p>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <Mail className="h-8 w-8 text-success mx-auto mb-2" />
                    <h3 className="font-medium text-success">Reset Instructions Sent!</h3>
                    <p className="text-sm text-success/80 mt-1">
                      Check your email inbox for your password and student ID
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsResetRequested(false)}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-center">
            <p className="text-white/70 text-sm">
              New to StudyStar?{' '}
              <Link 
                to="/registration" 
                className="text-accent hover:text-accent/80 font-medium underline underline-offset-2"
              >
                Register for an exam
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-white/60 text-xs">
          © 2024 StudyStar Exam Hub. Secure student portal for academic excellence.
        </p>
      </footer>
    </div>
  );
};

export default Login;