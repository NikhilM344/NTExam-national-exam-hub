import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Trophy, Calendar, Phone, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const loginData = localStorage.getItem('studentLogin');
    if (loginData) {
      const parsed = JSON.parse(loginData);
      if (parsed.isLoggedIn) {
        setIsLoggedIn(true);
        setStudentData(parsed.studentData);
      }
    }
  }, []);

  const handleLogin = () => {
    // Simulate login validation (frontend only)
    if (loginForm.email && loginForm.password) {
      // Store login state
      const loginData = {
        email: loginForm.email,
        password: loginForm.password,
        isLoggedIn: true,
        studentData: { personalInfo: { email: loginForm.email, fullName: 'Student User' } }
      };
      localStorage.setItem('studentLogin', JSON.stringify(loginData));
      
      setIsLoggedIn(true);
      setStudentData(loginData.studentData);
      setIsLoginOpen(false);
      setLoginForm({ email: '', password: '' });
      
      toast({
        title: "Login Successful!",
        description: "Welcome back! You can now access your dashboard.",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentLogin');
    setIsLoggedIn(false);
    setStudentData(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDashboard = () => {
    window.location.href = '/student-dashboard';
  };

  const navItems = [
    { label: 'Home', href: '#home', icon: BookOpen },
    { label: 'About Us', href: '#about', icon: BookOpen },
    { label: 'Syllabus & Sample Papers', href: '#syllabus', icon: BookOpen },
    { label: 'Exam Calendar', href: '#calendar', icon: Calendar },
    { label: 'Achievers & Winners', href: '#achievers', icon: Trophy },
    { label: 'Contact Us', href: '#contact', icon: Phone },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center" itemScope itemType="https://schema.org/Organization">
            <img 
              src="/lovable-uploads/9f424a06-0649-4c27-99a1-0db75774e2e1.png" 
              alt="National Talent Exam Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12"
              itemProp="logo"
            />
            <div className="ml-3">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent" itemProp="name">NTexam</h1>
              <p className="text-xs text-muted-foreground hidden sm:block" itemProp="description">National Talent Exam</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Login/Register/Dashboard Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Student Login</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full">
                        Login
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  <a href="/registration">Register</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 shadow-card">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 inline mr-2" />
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button size="sm" className="w-full bg-gradient-primary hover:opacity-90">
                      <a href="/registration">Register</a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;