import { useState, useEffect } from 'react';
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
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if student is logged in
    const loginData = localStorage.getItem('studentLogin');
    if (!loginData) {
      window.location.href = '/';
      return;
    }

    const parsedData = JSON.parse(loginData);
    if (!parsedData.isLoggedIn) {
      window.location.href = '/';
      return;
    }

    setStudentData(parsedData.studentData);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentLogin');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/';
  };

  const handleDownload = (type: string) => {
    toast({
      title: "Download Started",
      description: `Your ${type} is being prepared for download.`,
    });
    // In a real app, this would trigger actual file download
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Change Request",
      description: "A password reset link has been sent to your registered email.",
    });
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
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome, {studentData.personalInfo.fullName}
              </h1>
              <p className="text-white/90">
                Student Dashboard - NTexam National Talent Exam
              </p>
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Actions */}
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
                    onClick={() => handleDownload('Fees Receipt')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Fees Receipt
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleDownload('Hall Ticket')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Hall Ticket
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleDownload('Certificate')}
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
                      Registered
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {studentData.schoolInfo.classGrade} Exam
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {studentData.examDetails.examDate || 'Date TBA'}
                    </p>
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
                    {studentData.examDetails.subjects.map((subject: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
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
                <CardTitle className="text-xl font-bold text-foreground">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="bg-success p-2 rounded-full">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Registration Completed</p>
                      <p className="text-sm text-muted-foreground">Successfully registered for {studentData.schoolInfo.classGrade} exam</p>
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

          {/* Documents Tab */}
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
                    onClick={() => handleDownload('Fees Receipt')}
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
                    onClick={() => handleDownload('Hall Ticket')}
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
                    onClick={() => handleDownload('Certificate')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exams Tab */}
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
                    Take your official NTexam National Talent Exam. Available for {studentData.schoolInfo.classGrade}.
                  </p>
                  <Button 
                    className="w-full bg-white text-success hover:bg-white/90"
                    onClick={() => window.location.href = '/exam'}
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
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
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
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    <FileText className="h-4 w-4 mr-2" />
                    View Syllabus
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
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
                        <span>{studentData.personalInfo.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date of Birth:</span>
                        <span>{studentData.personalInfo.dateOfBirth}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Gender:</span>
                        <span className="capitalize">{studentData.personalInfo.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{studentData.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{studentData.personalInfo.contactNumber}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">Address:</span>
                        <span>{studentData.personalInfo.address}, {studentData.personalInfo.city}, {studentData.personalInfo.state} - {studentData.personalInfo.postalCode}</span>
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
                        <span>{studentData.schoolInfo.schoolName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Class:</span>
                        <span>{studentData.schoolInfo.classGrade}</span>
                      </div>
                      {studentData.schoolInfo.rollNumber && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Roll Number:</span>
                          <span>{studentData.schoolInfo.rollNumber}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">School Address:</span>
                        <span>{studentData.schoolInfo.schoolAddress}, {studentData.schoolInfo.schoolCity}, {studentData.schoolInfo.schoolState}</span>
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