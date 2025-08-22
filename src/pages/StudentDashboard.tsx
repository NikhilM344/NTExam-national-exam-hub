import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLoadingContext } from "@/context/LoadingContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";

// inside the dashboard body, near the top:
<div className="mb-6">
  <AnnouncementBanner />
</div>

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
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "exams" | "profile">("profile");

  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();

  useEffect(() => {
    (async () => {
      // 1) Legacy localStorage key used earlier
      const legacy = localStorage.getItem("studentLogin");
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (parsed?.isLoggedIn && parsed?.studentData) {
            setStudentData(parsed.studentData as StudentData);
            // Try to read paid flag from legacy storage if present
            const paidFlag =
              parsed?.isPaid ??
              parsed?.studentData?.isPaid ??
              (localStorage.getItem("isPaid") === "true") ??
              (localStorage.getItem("paymentStatus") === "paid");
            setIsPaid(!!paidFlag);
            setActiveTab(!!paidFlag ? "overview" : "profile");
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore parse errors
        }
      }

      // 2) Newer flags set by your current login code
      const loggedIn = localStorage.getItem("studentLoggedIn") === "true";
      const email = (localStorage.getItem("studentEmail") || "").toLowerCase();

      if (loggedIn && email) {
        // If registrationData exists locally, prefer it
        const reg = localStorage.getItem("registrationData");
        if (reg) {
          try {
            const parsed = JSON.parse(reg);
            if (parsed?.personalInfo) {
              setStudentData(parsed as StudentData);
              // Paid status from local flags if any
              const paidFlag =
                parsed?.isPaid ??
                (localStorage.getItem("isPaid") === "true") ??
                (localStorage.getItem("paymentStatus") === "paid");
              setIsPaid(!!paidFlag);
              setActiveTab(!!paidFlag ? "overview" : "profile");
              setIsLoading(false);
              return;
            }
          } catch {
            // ignore parse errors
          }
        }

        // Fallback: fetch from Supabase by email (DEV: need SELECT policy)
        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (!error && data) {
          setStudentData(toClientStudentData(data));
          // If your registrations table has is_paid, use it; else default false
          const paidFlag =
            (typeof data.is_paid === "boolean" ? data.is_paid : undefined) ??
            (localStorage.getItem("isPaid") === "true") ??
            (localStorage.getItem("paymentStatus") === "paid");
          setIsPaid(!!paidFlag);
          setActiveTab(!!paidFlag ? "overview" : "profile");
          setIsLoading(false);
          return;
        }
      }

      // 3) No valid session → send to login
      window.location.href = "/login";
    })();
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

  const handleLogout = async () => {
    // If you kept Auth somewhere else you can still: await supabase.auth.signOut();
    localStorage.removeItem("studentLogin");
    localStorage.removeItem("studentLoggedIn");
    localStorage.removeItem("studentEmail");
    // localStorage.removeItem("registrationData"); // optional
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    window.location.href = "/login";
  };

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
    startLoading(`Preparing your ${type} for download...`, "achievement");
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
    // Make sure registrationId & fees are set earlier in your flow
    window.location.href = "/payment";
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
          <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Overview Tab (LOCKED until paid) */}
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
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleDownload("Fees Receipt")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Fees Receipt
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleDownload("Hall Ticket")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Hall Ticket
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleDownload("Certificate")}>
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
                      Registered
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
                      <p className="text-sm text-muted-foreground">Successfully registered for {classGrade} exam</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="bg-primary p-2 rounded-full">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Payment Confirmed</p>
                      <p className="text-sm text-muted-foreground">Exam fees payment processed successfully</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab (LOCKED until paid) */}
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
                  <Button className="w-full bg-gradient-primary hover:opacity-90" onClick={() => handleDownload("Fees Receipt")}>
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
                  <Button className="w-full bg-gradient-primary hover:opacity-90" onClick={() => handleDownload("Hall Ticket")}>
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
                  <Button className="w-full bg-gradient-primary hover:opacity-90" onClick={() => handleDownload("Certificate")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exams Tab (LOCKED until paid) */}
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

          {/* Profile Tab (Always accessible) */}
          <TabsContent value="profile" className="space-y-6">
            {/* If unpaid, highlight pay section at top of profile too */}
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
                  {/* Personal Information */}
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
                          {(studentData?.personalInfo?.address ?? "")}
                          {studentData?.personalInfo?.city ? `, ${studentData.personalInfo.city}` : ""}
                          {studentData?.personalInfo?.state ? `, ${studentData.personalInfo.state}` : ""}
                          {studentData?.personalInfo?.postalCode ? ` - ${studentData.personalInfo.postalCode}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* School Information */}
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
                          {(studentData?.schoolInfo?.schoolAddress ?? "")}
                          {studentData?.schoolInfo?.schoolCity ? `, ${studentData.schoolInfo.schoolCity}` : ""}
                          {studentData?.schoolInfo?.schoolState ? `, ${studentData.schoolInfo.schoolState}` : ""}
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
