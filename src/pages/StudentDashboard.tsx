// src/pages/StudentDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  Download,
  FileText,
  Trophy,
  BookOpen,
  Lock,
  LogOut,
  Edit,
  Calendar,
  Award,
  Mail,
  Phone,
  School,
  MapPin,
  ShieldAlert,
  RotateCw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLoadingContext } from "@/context/LoadingContext";
import { useNavigate } from "react-router-dom";

/** Shape your UI expects */
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
    email?: string;
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
};

/** Map DB row -> UI shape */
function toClientStudentData(row: any): StudentData | null {
  if (!row) return null;
  return {
    personalInfo: {
      fullName: row.full_name ?? "",
      dateOfBirth: row.date_of_birth ?? "",
      gender: row.gender ?? "",
      address: row.address ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      postalCode: row.postal_code ?? "",
      contactNumber: row.contact_number ?? "",
      email: row.email ?? "",
    },
    schoolInfo: {
      schoolName: row.school_name ?? "",
      schoolAddress: row.school_address ?? "",
      schoolCity: row.school_city ?? "",
      schoolState: row.school_state ?? "",
      schoolPostalCode: row.school_postal_code ?? "",
      classGrade: row.class_grade ?? "",
      rollNumber: row.roll_number ?? "",
    },
    examDetails: {
      subjects: row.subjects ?? [],
      examCenter: row.exam_center ?? "",
      examDate: row.exam_date ?? "",
    },
    parentInfo: {
      parentName: row.parent_name ?? "",
      parentContactNumber: row.parent_contact_number ?? "",
      parentEmail: row.parent_email ?? "",
    },
    termsAccepted: !!row.terms_accepted,
  };
}

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [activeTab, setActiveTab] =
    useState<"overview" | "documents" | "exams" | "profile">("profile");
  const [noRegistrationMsg, setNoRegistrationMsg] = useState<string | null>(null);

  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();
  const navigate = useNavigate();

  /** Resolve identity we can use to fetch (regId preferred, else email + legacy) */
  const identity = useMemo(() => {
    // 1) registrationId in localStorage or ?rid= in URL
    const url = new URL(window.location.href);
    const ridFromUrl = url.searchParams.get("rid") || "";
    const regId =
      (localStorage.getItem("registrationId") || "").trim() ||
      ridFromUrl.trim();

    // 2) current email in localStorage (set by Login)
    let email = (localStorage.getItem("studentEmail") || "").trim();

    // 3) fallback to legacy object if present
    if (!email) {
      try {
        const legacy = localStorage.getItem("studentLogin");
        if (legacy) {
          const parsed = JSON.parse(legacy);
          email =
            parsed?.studentData?.email ||
            parsed?.email ||
            parsed?.studentData?.personalInfo?.email ||
            "";
        }
      } catch {}
    }

    return {
      regId: regId || null,
      email: email ? email.toLowerCase() : null,
    };
  }, []);

  /** Fetch a single row by registration id */
  const fetchById = async (id: string) => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return data || null;
  };

  /** Fetch newest row by email (case-insensitive) */
  const fetchByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .ilike("email", email) // case-insensitive
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) return null;
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  };

  /** Main loader */
  const loadFromDB = async () => {
    setIsLoading(true);
    setNoRegistrationMsg(null);

    try {
      let row: any = null;
      let idUsed: string | null = null;

      // Preferred: id
      if (identity.regId) {
        row = await fetchById(identity.regId);
        if (row) {
          idUsed = identity.regId;
        }
      }

      // Fallback: email (newest row)
      if (!row && identity.email) {
        row = await fetchByEmail(identity.email);
        if (row) {
          idUsed = row.id as string;
          // cache id for subsequent loads
          localStorage.setItem("registrationId", idUsed);
          if (!localStorage.getItem("studentEmail") && row.email) {
            localStorage.setItem("studentEmail", String(row.email).toLowerCase());
          }
        }
      }

      // Fallback: cached data for display (won't unlock paid sections)
      if (!row) {
        const cached = localStorage.getItem("registrationData");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed?.personalInfo) {
              setStudentData(parsed as StudentData);
              setIsPaid(localStorage.getItem("isPaid") === "true");
              setActiveTab("profile");
              setNoRegistrationMsg(
                "We couldn't find a registration in the database for your account. Showing cached details."
              );
              setIsLoading(false);
              return { idUsed: null as string | null };
            }
          } catch {}
        }
      }

      if (row) {
        // normalize to UI shape
        const client = toClientStudentData(row);
        setStudentData(client);
        const paid = !!row.is_paid;
        setIsPaid(paid);
        setActiveTab(paid ? "overview" : "profile");

        // store for future
        if (idUsed) localStorage.setItem("registrationId", idUsed);
        if (row.email && !localStorage.getItem("studentEmail")) {
          localStorage.setItem("studentEmail", String(row.email).toLowerCase());
        }

        setIsLoading(false);
        return { idUsed };
      }

      // No id and no email or no row for email
      setStudentData(null);
      setIsPaid(false);
      setActiveTab("profile");
      setNoRegistrationMsg(
        identity.email
          ? `No registration found for ${identity.email}.`
          : "No registration found for your account."
      );
      setIsLoading(false);
      return { idUsed: null as string | null };
    } catch (e) {
      console.error("Dashboard load error:", e);
      setStudentData(null);
      setIsPaid(false);
      setActiveTab("profile");
      setNoRegistrationMsg("Unable to load your registration right now.");
      setIsLoading(false);
      return { idUsed: null as string | null };
    }
  };

  // Realtime watch for is_paid flip
  const watchPaidStatus = async (registrationId: string) => {
    const channel = supabase
      .channel(`reg-${registrationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "registrations",
          filter: `id=eq.${registrationId}`,
        },
        (payload) => {
          const row: any = payload.new;
          const paidNow = !!row?.is_paid;
          setStudentData(toClientStudentData(row));
          setIsPaid(paidNow);
          if (paidNow) setActiveTab("overview");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    (async () => {
      const loaded = await loadFromDB();
      if (loaded?.idUsed) {
        cleanup = await watchPaidStatus(loaded.idUsed);
      }
    })();

    return () => {
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Intercept tab change: block if unpaid and not going to profile */
  const handleTabChange = (next: "overview" | "documents" | "exams" | "profile") => {
    if (!isPaid && next !== "profile") {
      setActiveTab("profile");
      toast({
        title: "Payment Required",
        description: "Please complete your payment to access this section.",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(next);
  };

  /** Robust Logout */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
      [
        "studentLogin",
        "studentLoggedIn",
        "studentEmail",
        "registrationId",
        "registrationData",
        "isPaid",
      ].forEach((k) => localStorage.removeItem(k));
      if ((supabase as any).getChannels) {
        (supabase as any).getChannels().forEach((ch: any) => supabase.removeChannel(ch));
      }
    } finally {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      navigate("/login", { replace: true });
    }
  };

  const { startLoading: startL, stopLoading: stopL } = useLoadingContext();

  const handleDownload = (type: string) => {
    if (!isPaid) {
      setActiveTab("profile");
      toast({
        title: "Payment Required",
        description: "Please complete your payment before downloading documents.",
        variant: "destructive",
      });
      return;
    }
    startL(`Preparing your ${type} for download...`, "achievement");
    setTimeout(() => {
      stopLoading();
      toast({
        title: "Download Started",
        description: `Your ${type} is being prepared for download.`,
      });
    }, 1500);
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Change Request",
      description: "A password reset link has been sent to your registered email.",
    });
  };

  const handlePayNow = () => {
    navigate("/payment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Registration Found</h1>
          {noRegistrationMsg ? (
            <p className="text-muted-foreground mb-6">{noRegistrationMsg}</p>
          ) : (
            <p className="text-muted-foreground mb-6">
              We couldn’t find your registration. Please make sure you have registered, or try logging in again.
            </p>
          )}
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate("/login", { replace: true })}>Login</Button>
            <Button variant="outline" onClick={() => navigate("/registration")}>
              New Registration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SAFE derived values
  const name = studentData?.personalInfo?.fullName || "Student";
  const classGrade = studentData?.schoolInfo?.classGrade || "—";
  const examDate = studentData?.examDetails?.examDate || "Date TBA";
  const subjects: string[] = Array.isArray(studentData?.examDetails?.subjects)
    ? (studentData!.examDetails!.subjects as string[])
    : [];

  const lockIfUnpaid = (label: string) => (
    <span className="inline-flex items-center gap-1">
      {label}
      {!isPaid && <Lock className="h-3 w-3 opacity-70" />}
    </span>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {name}</h1>
              <p className="text-white/90">Student Dashboard - NTExam Navoday Talent Exam</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  const loaded = await loadFromDB();
                  if (loaded?.idUsed) {
                    toast({ title: "Status refreshed" });
                  }
                }}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Heads-up if showing cached-only data */}
        {noRegistrationMsg && (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-foreground">Heads up</div>
              <div className="text-sm text-muted-foreground">{noRegistrationMsg}</div>
            </div>
          </div>
        )}

        {/* Unpaid banner */}
        {!isPaid && (
          <div className="mb-6 rounded-lg border border-warning/30 bg-warning/10 p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-foreground">Payment Pending</div>
              <div className="text-sm text-muted-foreground">
                Your account is limited until your exam fee is paid. Complete payment to unlock all sections.
              </div>
            </div>
            <Button onClick={handlePayNow} className="bg-gradient-success text-success-foreground">
              Pay Now
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" onClick={(e) => !isPaid && e.preventDefault()}>
              {lockIfUnpaid("Overview")}
            </TabsTrigger>
            <TabsTrigger value="documents" onClick={(e) => !isPaid && e.preventDefault()}>
              {lockIfUnpaid("Documents")}
            </TabsTrigger>
            <TabsTrigger value="exams" onClick={(e) => !isPaid && e.preventDefault()}>
              {lockIfUnpaid("Exams")}
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Downloads */}
              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleDownload("Fees Receipt")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Fees Receipt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleDownload("Hall Ticket")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Hall Ticket
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleDownload("Certificate")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Certificate
                  </Button>
                </CardContent>
              </Card>

              {/* Exam Status */}
              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Exam Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-success/10 text-success mb-2">
                      {isPaid ? "Paid" : "Registered"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{classGrade} Exam</p>
                    <p className="text-xs text-muted-foreground mt-1">{examDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Subjects */}
              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {subjects.length === 0 ? (
                      <span className="text-xs text-muted-foreground">No subjects selected</span>
                    ) : (
                      subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <p className="text-xs text-muted-foreground">Awards Earned</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card bg-gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="bg-success p-2 rounded-full">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Registration Completed</p>
                      <p className="text-sm text-muted-foreground">
                        Successfully registered for {classGrade} exam
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="bg-primary p-2 rounded-full">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Payment {isPaid ? "Confirmed" : "Pending"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isPaid
                          ? "Exam fees payment processed successfully"
                          : "Awaiting payment confirmation"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Fees Receipt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your payment receipt for exam registration fees.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => handleDownload("Fees Receipt")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Exam Hall Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your hall ticket (available 7 days before exam).
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => handleDownload("Hall Ticket")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Hall Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your participation certificate after exam completion.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => handleDownload("Certificate")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exams */}
          <TabsContent value="exams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card bg-gradient-success border-0 text-success-foreground">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Official Exam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-success-foreground/90">
                    Take your official NTExam Navoday Talent Exam. Available for {classGrade}.
                  </p>
                  <Button
                    className="w-full bg-white text-success hover:bg-white/90"
                    onClick={() => {
                      if (!isPaid) {
                        setActiveTab("profile");
                        toast({
                          title: "Payment Required",
                          description: "Please complete your payment to access the exam.",
                          variant: "destructive",
                        });
                        return;
                      }
                      startLoading("Preparing your exam environment...", "exam");
                      setTimeout(() => {
                        stopLoading();
                        window.location.href = "/exam";
                      }, 2000);
                    }}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Take Exam
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Mock Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice with sample questions and mock tests to prepare for your exam.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      if (!isPaid) {
                        setActiveTab("profile");
                        toast({
                          title: "Payment Required",
                          description: "Please complete your payment to access mock tests.",
                          variant: "destructive",
                        });
                        return;
                      }
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Mock Test
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Syllabus & Sample Papers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access detailed syllabus and sample question papers for better preparation.
                  </p>
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      if (!isPaid) {
                        setActiveTab("profile");
                        toast({
                          title: "Payment Required",
                          description: "Please complete your payment to access syllabus.",
                          variant: "destructive",
                        });
                        return;
                      }
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Syllabus
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile (always accessible) */}
          <TabsContent value="profile" className="space-y-6">
            {!isPaid && (
              <Card className="shadow-card border border-warning/30 bg-warning/10">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-warning" />
                    Complete Your Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Your profile is active, but other sections are locked. Pay now to unlock everything.
                  </p>
                  <Button onClick={handlePayNow} className="bg-gradient-success text-success-foreground">
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-card bg-gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </span>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Personal Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Name:</span>
                        <span>{studentData?.personalInfo?.fullName ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date of Birth:</span>
                        <span>{studentData?.personalInfo?.dateOfBirth ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Gender:</span>
                        <span className="capitalize">{studentData?.personalInfo?.gender ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{studentData?.personalInfo?.email ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{studentData?.personalInfo?.contactNumber ?? ""}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">Address:</span>
                        <span>
                          {studentData?.personalInfo?.address ?? ""}
                          {studentData?.personalInfo?.city ? `, ${studentData.personalInfo.city}` : ""}
                          {studentData?.personalInfo?.state ? `, ${studentData.personalInfo.state}` : ""}
                          {studentData?.personalInfo?.postalCode
                            ? ` - ${studentData.personalInfo.postalCode}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* School */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">School Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">School:</span>
                        <span>{studentData?.schoolInfo?.schoolName ?? ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Class:</span>
                        <span>{studentData?.schoolInfo?.classGrade ?? ""}</span>
                      </div>
                      {studentData?.schoolInfo?.rollNumber ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Roll Number:</span>
                          <span>{studentData.schoolInfo.rollNumber}</span>
                        </div>
                      ) : null}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">School Address:</span>
                        <span>
                          {studentData?.schoolInfo?.schoolAddress ?? ""}
                          {studentData?.schoolInfo?.schoolCity
                            ? `, ${studentData.schoolInfo.schoolCity}`
                            : ""}
                          {studentData?.schoolInfo?.schoolState
                            ? `, ${studentData.schoolInfo.schoolState}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-foreground mb-4">Account Settings</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={handlePasswordChange}>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                    {!isPaid && (
                      <Button onClick={handlePayNow} className="bg-gradient-success text-success-foreground">
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
