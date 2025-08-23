// src/pages/Login.tsx
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
import { Phone, Lock, ArrowLeft, Shield, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

/** Must match the shape the StudentDashboard expects */
type StudentData = {
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    contactNumber?: string;
    email?: string | null;
  };
  schoolInfo?: {
    schoolName?: string;
    schoolAddress?: string;
    schoolCity?: string;
    schoolState?: string;
    schoolPostalCode?: string;
    classGrade?: string;
    rollNumber?: string;
  };
  examDetails?: {
    subjects?: string[];
    examCenter?: string;
    examDate?: string;
  };
  parentInfo?: {
    parentName?: string;
    parentContactNumber?: string;
    parentEmail?: string;
  };
  termsAccepted?: boolean;
  isPaid?: boolean;
};

type LoginRow = {
  id: string;
  contact_number: string | null;
  email: string | null;
  password_hash: string | null;
};

// ---------- helpers ----------
const STUDENT_SESSION_KEYS = [
  "studentLogin",
  "studentLoggedIn",
  "studentEmail",
  "studentPhone",
  "registrationData",
  "registrationId",
  "isPaid",
  "paymentStatus",
];

const clearStudentSession = () => {
  for (const k of STUDENT_SESSION_KEYS) localStorage.removeItem(k);
};

const normalizePhone = (val: string) => {
  const digits = (val || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const isBcrypt = (s: string | null | undefined) => !!s && s.startsWith("$2");
const verifyPassword = async (input: string, stored: string | null) => {
  if (!stored) return false;
  if (isBcrypt(stored)) {
    try {
      return await bcrypt.compare(input, stored);
    } catch {
      return false;
    }
  }
  // plaintext fallback for legacy rows
  return input === stored;
};

const toStudentData = (row: any): StudentData => ({
  personalInfo: {
    fullName: row?.full_name ?? "",
    dateOfBirth: row?.date_of_birth ?? "",
    gender: row?.gender ?? "",
    address: row?.address ?? "",
    city: row?.city ?? "",
    state: row?.state ?? "",
    postalCode: row?.postal_code ?? "",
    contactNumber: row?.contact_number ?? "",
    email: row?.email ?? null,
  },
  schoolInfo: {
    schoolName: row?.school_name ?? "",
    schoolAddress: row?.school_address ?? "",
    schoolCity: row?.school_city ?? "",
    schoolState: row?.school_state ?? "",
    schoolPostalCode: row?.school_postal_code ?? "",
    classGrade: row?.class_grade ?? "",
    rollNumber: row?.roll_number ?? "",
  },
  examDetails: {
    subjects: Array.isArray(row?.subjects) ? row.subjects : [],
    examCenter: row?.exam_center ?? "",
    examDate: row?.exam_date ?? "",
  },
  parentInfo: {
    parentName: row?.parent_name ?? "",
    parentContactNumber: row?.parent_contact_number ?? "",
    parentEmail: row?.parent_email ?? "",
  },
  termsAccepted: !!row?.terms_accepted,
  isPaid: typeof row?.is_paid === "boolean" ? row.is_paid : false,
});

const Login: React.FC = () => {
  // --- Student state (phone + password) ---
  const [phone, setPhone] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // --- Admin state (email + password) ---
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();

  // Look in `logins` by contact_number_normalized
  const findInLogins = async (p10: string): Promise<LoginRow | null> => {
    const { data, error } = await supabase
      .from("logins")
      .select("id, contact_number, email, password_hash")
      .eq("contact_number_normalized", p10)
      .maybeSingle();
    if (error) {
      console.warn("logins select error:", error.message);
      return null;
    }
    return data as LoginRow | null;
  };

  // Get the most recent registration for that phone (handles +91, spaces, dashes)
  const findLatestRegistrationForPhone = async (rawPhone: string, p10: string) => {
    // Try exact first, newest first
    let q1 = supabase
      .from("registrations")
      .select("*")
      .eq("contact_number", rawPhone)
      .order("created_at", { ascending: false })
      .limit(1);
    const exact = await q1;
    if (!exact.error && exact.data && exact.data.length) return exact.data[0];

    // Ends-with match, newest first
    let q2 = supabase
      .from("registrations")
      .select("*")
      .ilike("contact_number", `%${p10}`)
      .order("created_at", { ascending: false })
      .limit(1);
    const like = await q2;
    if (!like.error && like.data && like.data.length) return like.data[0];

    if (exact.error) console.warn("registrations exact error:", exact.error.message);
    if (like.error) console.warn("registrations like error:", like.error.message);
    return null;
  };

  // ---------- Student login without RPC ----------
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const p10 = normalizePhone(phone);
    if (!p10) {
      toast({
        title: "Missing Information",
        description: "Please enter your mobile number.",
        variant: "destructive",
      });
      return;
    }
    if (!studentPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    // 🔒 Clear any previous user's session FIRST
    clearStudentSession();

    startLoading("Verifying your credentials...");
    try {
      // 1) Try `logins`
      let loginCandidate = await findInLogins(p10);

      // 2) Pull registration row (latest for this phone) for dashboard hydration
      const registrationRow =
        (await findLatestRegistrationForPhone(loginCandidate?.contact_number || phone.trim(), p10)) ||
        null;

      // 3) Decide which stored password to check
      const storedHash =
        (loginCandidate && loginCandidate.password_hash) ||
        (registrationRow && registrationRow.password_hash) ||
        null;

      if (!storedHash) {
        stopLoading();
        toast({
          title: "Invalid credentials",
          description: "The mobile number or password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }

      const passOk = await verifyPassword(studentPassword, storedHash);
      if (!passOk) {
        stopLoading();
        toast({
          title: "Invalid credentials",
          description: "The mobile number or password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }

      // 4) Build StudentData and persist ONLY this user's details
      let studentData: StudentData;
      if (registrationRow) {
        studentData = toStudentData(registrationRow);
        // Save the exact registration row ID so StudentDashboard fetches fresh data
        if (registrationRow.id) {
          localStorage.setItem("registrationId", registrationRow.id);
        }
        // Save email for dashboard fallback path if you use it
        if (registrationRow.email) {
          localStorage.setItem("studentEmail", (registrationRow.email || "").toLowerCase());
        }
      } else {
        // Minimal fallback from `logins`
        studentData = {
          personalInfo: {
            fullName: "",
            dateOfBirth: "",
            gender: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            contactNumber: loginCandidate?.contact_number || phone.trim(),
            email: loginCandidate?.email || null,
          },
          schoolInfo: {},
          examDetails: {},
          parentInfo: {},
          termsAccepted: false,
          isPaid: false,
        };
        if (loginCandidate?.email) {
          localStorage.setItem("studentEmail", loginCandidate.email.toLowerCase());
        }
      }

      // Persist the NEW session only
      localStorage.setItem(
        "studentLogin",
        JSON.stringify({
          isLoggedIn: true,
          studentData,
          isPaid: !!studentData.isPaid,
        })
      );
      localStorage.setItem("studentLoggedIn", "true");
      if (studentData?.personalInfo?.contactNumber) {
        localStorage.setItem("studentPhone", studentData.personalInfo.contactNumber);
      }
      localStorage.setItem("registrationData", JSON.stringify(studentData));

      stopLoading();
      toast({ title: "Welcome!", description: "Login successful." });

      // 5) Redirect to dashboard (replace + hard fallback)
      navigate("/student-dashboard", { replace: true });
      setTimeout(() => {
        if (window.location.pathname !== "/student-dashboard") {
          window.location.href = "/student-dashboard";
        }
      }, 0);
    } catch (err: any) {
      console.error(err);
      stopLoading();
      toast({
        title: "Login Failed",
        description: err?.message || "Could not verify your credentials.",
        variant: "destructive",
      });
    }
  };

  // ---------- Admin login (as you had) ----------
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

      const admin = data[0]; // { id, email, role }
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ id: admin.id, email: admin.email, role: admin.role })
      );

      stopLoading();
      toast({ title: "Admin login successful", description: `Welcome, ${admin.email}` });
      navigate("/admin", { replace: true });
    } catch (err: any) {
      stopLoading();
      toast({
        title: "Admin Login Failed",
        description: err?.message || "Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="sr-only">
        <h1>StudyStar Login - Student & Admin</h1>
        <p>Secure portal for students and administrators.</p>
      </div>

      <header className="p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
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
              <p className="text-xs text-white/70 hidden sm:block">
                Navoday Talent Exam
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

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
                      <Label htmlFor="student-phone" className="text-sm font-medium text-foreground">
                        Mobile Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="student-phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter your 10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                          required
                          aria-describedby="phone-help"
                        />
                      </div>
                      <p id="phone-help" className="text-xs text-muted-foreground">
                        Use the mobile number you registered with
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="student-password"
                          type="password"
                          placeholder="Enter your password"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          className="pl-10 bg-background border-input focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tip: If you forgot, try DDMMYYYY (if your account was created that way).
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
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
