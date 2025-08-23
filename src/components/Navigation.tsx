// src/components/Navigation.tsx
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  BookOpen,
  Trophy,
  Calendar,
  Phone,
  User,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const legacy = localStorage.getItem("studentLogin");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        if (parsed?.isLoggedIn) {
          setIsLoggedIn(true);
          setStudentData(parsed.studentData);
          return;
        }
      } catch {}
    }
    const logged = localStorage.getItem("studentLoggedIn") === "true";
    if (logged) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentLogin");
    localStorage.removeItem("studentLoggedIn");
    localStorage.removeItem("studentEmail");
    setIsLoggedIn(false);
    setStudentData(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleDashboard = () => {
    window.location.href = "/student-dashboard";
  };

  const navItems = [
    { label: "Home", href: "/", icon: BookOpen },
    { label: "About Us", href: "/about-us", icon: BookOpen },
    { label: "Syllabus & Sample Papers", href: "#syllabus", icon: BookOpen },
    { label: "Exam Calendar", href: "#calendar", icon: Calendar },
    { label: "Achievers & Winners", href: "#achievers", icon: Trophy },
    { label: "Gallery", href: "/gallery", icon: ImageIcon },
    { label: "Contact Us", href: "#contact", icon: Phone },
  ];

  return (
    <nav
      className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* FULL-WIDTH container, no centering */}
      <div className="w-full px-0 md:px-3 lg:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo pinned to the far left */}
          <div className="flex items-center" itemScope itemType="https://schema.org/Organization">
            <img
              src="/lovable-uploads/9f424a06-0649-4c27-99a1-0db75774e2e1.png"
              alt="Navoday Talent Exam Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
              itemProp="logo"
            />
            <div className="ml-3">
              <h1
                className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent"
                itemProp="name"
              >
                NTExam
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block" itemProp="description">
                Navoday Talent Exam
              </p>
            </div>
          </div>

          {/* Desktop Navigation (pulled left, no extra left margin) */}
          <div className="hidden md:block flex-1">
            <div
              className="
                flex items-center gap-6
                flex-nowrap whitespace-nowrap overflow-x-auto
              "
              style={{ scrollbarWidth: "thin" }}
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="
                    inline-flex items-center gap-2
                    px-3.5 py-2 rounded-md text-sm font-medium
                    text-foreground/90 hover:text-primary
                    hover:bg-muted transition-colors
                    whitespace-nowrap
                  "
                >
                  <item.icon className="h-4 w-4 opacity-80" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions (no left margin so it hugs nav nicely) */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={handleDashboard}
              aria-label="Open Profile / Dashboard"
              title="login"
            >
              <User className="h-4 w-4" />
            </Button>

            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button size="sm" className="bg-gradient-primary/70 hover:opacity-90">
                <a href="/registration" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  New Registration
                </a>
              </Button>
            )}
          </div>

          {/* Mobile menu button (still on the right) */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1.5 bg-card rounded-lg mt-2 shadow-card">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="
                    text-foreground hover:text-primary
                    block px-3 py-2 rounded-md text-base font-medium
                    transition-colors hover:bg-muted
                  "
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 inline mr-2" />
                  {item.label}
                </a>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 space-y-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                  aria-label="Open Profile / Dashboard"
                  title="Profile"
                >
                  <User className="h-4 w-4" />
                </Button>

                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full bg-gradient-primary/70 hover:opacity-90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <a href="/registration" className="w-full">
                      New Register
                    </a>
                  </Button>
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
