import { useState } from 'react';
import { Menu, X, BookOpen, Trophy, Calendar, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', icon: BookOpen },
    { label: 'About Us', href: '#about', icon: BookOpen },
    { label: 'Syllabus & Sample Papers', href: '#syllabus', icon: BookOpen },
    { label: 'Exam Calendar', href: '#calendar', icon: Calendar },
    { label: 'Achievers & Winners', href: '#achievers', icon: Trophy },
    { label: 'Contact Us', href: '#contact', icon: Phone },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-xl shadow-soft">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          <div>
            <h1 className="text-lg font-bold text-primary">NTexam</h1>
            <p className="text-xs text-muted-foreground">National Talent Exam</p>
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

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              <a href="/registration">Register</a>
            </Button>
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
                <Button variant="outline" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="w-full bg-gradient-primary hover:opacity-90">
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;