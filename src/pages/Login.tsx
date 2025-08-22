import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLoadingContext } from "@/context/LoadingContext";
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Login = () => {
  // student state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // admin state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();

  // --- Student login (your existing behavior) ---
  const handleStudentLogin = async (e: React.FormEvent) => {
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
      // TODO: replace with your real check (registrations table, etc.)
      await new Promise((r) => setTimeout(r, 800));
      localStorage.setItem("studentLoggedIn", "true");
      localStorage.setItem("studentEmail", email.toLowerCase());
      toast({ title: "Welcome Back!", description: "Logged in successfully." });
      navigate("/student-dashboard");
    } catch {
      toast({
        title: "Login Failed",
        description: "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  // --- Admin login (Supabase RPC -> admin_login) ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    startLoading("Verifying admin credentials...");
    try {
      const { data, error } = await supabase.rpc("admin_login", {
        p_email: adminEmail.toLowerCase(),
        p_password: adminPassword,
      });

      if (error) throw error;
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid admin credentials.");
      }

      // data[0] has { id, email, role }
      const admin = data[0];
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ id: admin.id, email: admin.email, role: admin.role }),
      );

      toast({ title: "Admin login successful", description: `Welcome, ${admin.email}` });
      // Navigate to admin dashboard route (you can change this path if needed)
      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Admin Login Failed",
        description: err?.message || "Please check your credentials.",
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
        <h1>StudyStar Login - Student & Admin</h1>
        <p>Secure portal for students and administrators.</p>
      </div>

      {/* Logo Header */}
      <header className="p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/lovable-uploads/9f424a06-0649-4c27-99a1-0db75774e2e1.png"
              alt="Navoday Talent Exam Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <div className="ml-3">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                NTExam
              </h1>
              <p className="text-xs text-white/70 hidden sm:block">Navoday Talent Exam</p>
            </div>
          </div>

          {/* Back to Home */}
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
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white mb-2">Login</h1>
            <p className="text-white/80 text-sm">Choose Student or Admin</p>
          </div>

          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-foreground">Welcome</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Sign in to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                {/* Student Tab */}
                <TabsContent value="student" className="space-y-4 mt-4">
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Student Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-soft"
                      size="lg"
                    >
                      Sign In as Student
                    </Button>
                  </form>
                </TabsContent>

                {/* Admin Tab */}
                <TabsContent value="admin" className="space-y-4 mt-4">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                        Admin Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@example.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                        Admin Password
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="••••••••"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Sign In as Admin
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-white/70 text-sm">
              New to StudyStar?{" "}
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
    </div>
  );
};

export default Login;
