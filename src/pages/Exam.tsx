import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, User, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ExamQuestion, getExamByStandard, getQuestionsForExam } from '@/data/examData';

type Language = 'english' | 'gujarati';

const Exam = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [language, setLanguage] = useState<Language>('english');
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  useEffect(() => {
    // Check if student is logged in
    const student = localStorage.getItem('studentData');
    if (!student) {
      navigate('/login');
      return;
    }

    const parsedStudent = JSON.parse(student);
    setStudentData(parsedStudent);

    // Get exam for student's standard
    const exam = getExamByStandard(parsedStudent.schoolInfo.classGrade);
    if (!exam) {
      toast({
        title: "No Exam Available",
        description: "No exam is currently scheduled for your class.",
        variant: "destructive"
      });
      navigate('/student-dashboard');
      return;
    }

    setExamData(exam);
    const examQuestions = getQuestionsForExam(parsedStudent.schoolInfo.classGrade);
    setQuestions(examQuestions);
  }, [navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (examStarted && timeLeft > 0 && !examCompleted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !examCompleted) {
      handleSubmitExam();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, examStarted, examCompleted]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    toast({
      title: "Exam Started",
      description: "Your exam has begun. Good luck!",
    });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    setExamCompleted(true);
    
    // Calculate results
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const result = {
      score: correctAnswers,
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
      percentage: (correctAnswers / questions.length) * 100,
      timeSpent: 3600 - timeLeft
    };

    // Store result in localStorage for now
    localStorage.setItem('examResult', JSON.stringify(result));

    toast({
      title: "Exam Submitted",
      description: "Your exam has been submitted successfully. Results will be declared soon.",
    });

    setTimeout(() => {
      navigate('/exam-result');
    }, 2000);
  };

  if (!studentData || !examData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              StudyStar Exam Portal
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {examData.standard}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-muted-foreground">{examData.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Questions</p>
                  <p className="text-muted-foreground">{examData.totalQuestions} questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Student</p>
                  <p className="text-muted-foreground">{studentData.personalInfo.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Total Marks</p>
                  <p className="text-muted-foreground">{examData.totalMarks} marks</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Exam Language</h3>
              <RadioGroup 
                value={language} 
                onValueChange={(value: Language) => setLanguage(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english" className="font-medium">English</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="gujarati" id="gujarati" />
                  <Label htmlFor="gujarati" className="font-medium">ગુજરાતી</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h4 className="font-semibold text-warning-foreground mb-2">Important Instructions:</h4>
              <ul className="text-sm space-y-1 text-warning-foreground">
                <li>• Exam duration is {examData.duration} minutes</li>
                <li>• Each question carries 1 mark</li>
                <li>• No negative marking</li>
                <li>• Exam will auto-submit after {examData.duration} minutes</li>
                <li>• Results will be declared later by admin</li>
              </ul>
            </div>

            <Button 
              onClick={handleStartExam}
              className="w-full text-lg py-6 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-card">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-success-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-success mb-2">Exam Completed!</h2>
            <p className="text-muted-foreground mb-6">
              Your exam has been submitted successfully. Results will be declared soon by the admin.
            </p>
            <Button onClick={() => navigate('/student-dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">StudyStar Exam</h1>
            <Badge variant="secondary">{examData.standard}</Badge>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Question</p>
              <p className="font-bold">{currentQuestion + 1} / {questions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1}
                  </CardTitle>
                  <Badge variant="outline">
                    {language === 'english' ? 'English' : 'ગુજરાતી'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {language === 'english' ? currentQ.question : currentQ.questionGuj}
                </div>

                <RadioGroup
                  value={answers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleAnswerChange(currentQuestion, parseInt(value))}
                  className="space-y-3"
                >
                  {(language === 'english' ? currentQ.options : currentQ.optionsGuj).map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {String.fromCharCode(65 + index)}. {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitExam}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : answers[index] !== undefined ? "secondary" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0 text-xs"
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-border rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-2xl font-bold text-primary">
                      {Object.keys(answers).length}/{questions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Questions Answered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;