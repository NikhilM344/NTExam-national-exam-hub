import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, Clock, Target, TrendingUp, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  timeSpent: number;
}

const ExamResult = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isResultDeclared] = useState(true); // Mock: Admin has declared results

  useEffect(() => {
    // Check if student is logged in
    const student = localStorage.getItem('studentData');
    if (!student) {
      navigate('/login');
      return;
    }

    const parsedStudent = JSON.parse(student);
    setStudentData(parsedStudent);

    // Get exam result
    const result = localStorage.getItem('examResult');
    if (!result) {
      toast({
        title: "No Result Found",
        description: "No exam result found. Please take the exam first.",
        variant: "destructive"
      });
      navigate('/student-dashboard');
      return;
    }

    setExamResult(JSON.parse(result));
  }, [navigate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  const getReward = (percentage: number): string | null => {
    if (percentage >= 95) return 'Gold Medal 🥇';
    if (percentage >= 85) return 'Silver Medal 🥈';
    if (percentage >= 75) return 'Bronze Medal 🥉';
    if (percentage >= 60) return 'Certificate of Merit 📜';
    return null;
  };

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Outstanding Performance! 🌟';
    if (percentage >= 80) return 'Excellent Work! 👏';
    if (percentage >= 70) return 'Good Job! 👍';
    if (percentage >= 60) return 'Well Done! ✅';
    return 'Keep Practicing! 💪';
  };

  if (!studentData || !examResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!isResultDeclared) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-card">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-warning-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-warning mb-2">Results Pending</h2>
            <p className="text-muted-foreground mb-6">
              Your exam results are being evaluated. Results will be declared soon by the admin.
            </p>
            <Button onClick={() => navigate('/student-dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reward = getReward(examResult.percentage);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Exam Results</h1>
          <Button
            variant="secondary"
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Congratulations Card */}
          <Card className="shadow-winner border-2 border-secondary/20">
            <CardContent className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-success-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Congratulations, {studentData.personalInfo.fullName}!
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                {getPerformanceMessage(examResult.percentage)}
              </p>
              {reward && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  🎉 {reward}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-primary">{examResult.score}</p>
                <p className="text-sm text-muted-foreground">Total Score</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                </div>
                <p className="text-2xl font-bold text-secondary">{examResult.percentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Percentage</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-success-foreground" />
                </div>
                <p className="text-2xl font-bold text-success">{getGrade(examResult.percentage)}</p>
                <p className="text-sm text-muted-foreground">Grade</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="text-center py-6">
                <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-warning-foreground" />
                </div>
                <p className="text-2xl font-bold text-warning">{formatTime(examResult.timeSpent)}</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <p className="text-3xl font-bold text-success">{examResult.correctAnswers}</p>
                  <p className="text-success-foreground">Correct Answers</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-3xl font-bold text-destructive">{examResult.wrongAnswers}</p>
                  <p className="text-destructive-foreground">Wrong Answers</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-muted-foreground">{examResult.totalQuestions}</p>
                  <p className="text-muted-foreground">Total Questions</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Accuracy</span>
                  <span>{examResult.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-success h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${examResult.percentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank and Achievement */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement & Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-primary rounded-lg text-primary-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3" />
                  <p className="text-2xl font-bold">Rank #1</p>
                  <p className="text-primary-foreground/80">in {studentData.schoolInfo.classGrade}</p>
                </div>
                {reward && (
                  <div className="text-center p-6 bg-gradient-success rounded-lg text-success-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-lg font-bold">{reward}</p>
                    <p className="text-success-foreground/80">Well Deserved!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/student-dashboard')}
              variant="outline"
              size="lg"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              Print Result
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;