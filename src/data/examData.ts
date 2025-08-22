export interface ExamQuestion {
  id: string;
  question: string;
  questionGuj: string;
  options: string[];
  optionsGuj: string[];
  correctAnswer: number;
  standard: string;
  subject: string;
  setNumber: number;
}

export interface ExamSchedule {
  id: string;
  standard: string;
  date: string;
  time: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  isActive: boolean;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  standard: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number; // in seconds
  rank: number;
  percentage: number;
  reward?: string;
  completedAt: string;
}

// Mock exam schedules
export const examSchedules: ExamSchedule[] = [
  {
    id: "exam-1",
    standard: "Class 5",
    date: "2024-08-15",
    time: "10:00",
    duration: 60,
    totalQuestions: 100,
    totalMarks: 100,
    isActive: true
  },
  {
    id: "exam-2", 
    standard: "Class 6",
    date: "2024-08-16",
    time: "10:00",
    duration: 60,
    totalQuestions: 100,
    totalMarks: 100,
    isActive: true
  },
  {
    id: "exam-3",
    standard: "Class 7",
    date: "2024-08-17",
    time: "10:00",
    duration: 60,
    totalQuestions: 100,
    totalMarks: 100,
    isActive: true
  }
];

// Mock exam questions - Set 1 for Class 5
export const examQuestions: ExamQuestion[] = [
  {
    id: "q1",
    question: "What is 25 + 37?",
    questionGuj: "25 + 37 = કેટલું?",
    options: ["52", "62", "72", "82"],
    optionsGuj: ["52", "62", "72", "82"],
    correctAnswer: 1,
    standard: "Class 5",
    subject: "Mathematics",
    setNumber: 1
  },
  {
    id: "q2",
    question: "Which planet is known as the Red Planet?",
    questionGuj: "કયો ગ્રહ લાલ ગ્રહ તરીકે ઓળખાય છે?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    optionsGuj: ["શુક્ર", "મંગળ", "ગુરુ", "શનિ"],
    correctAnswer: 1,
    standard: "Class 5",
    subject: "Science",
    setNumber: 1
  },
  {
    id: "q3",
    question: "What is the capital of India?",
    questionGuj: "ભારતની રાજધાની કઈ છે?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    optionsGuj: ["મુંબઈ", "દિલ્હી", "કોલકાતા", "ચેન્નઈ"],
    correctAnswer: 1,
    standard: "Class 5",
    subject: "Social Studies",
    setNumber: 1
  },
  {
    id: "q4",
    question: "How many sides does a triangle have?",
    questionGuj: "ત્રિકોણની કેટલી બાજુઓ હોય છે?",
    options: ["2", "3", "4", "5"],
    optionsGuj: ["2", "3", "4", "5"],
    correctAnswer: 1,
    standard: "Class 5",
    subject: "Mathematics",
    setNumber: 1
  },
  {
    id: "q5",
    question: "Which gas do plants absorb from the atmosphere?",
    questionGuj: "છોડ વાતાવરણમાંથી કયો ગેસ શોષે છે?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    optionsGuj: ["ઓક્સિજન", "કાર્બન ડાયોક્સાઇડ", "નાઇટ્રોજન", "હાઇડ્રોજન"],
    correctAnswer: 1,
    standard: "Class 5",
    subject: "Science",
    setNumber: 1
  }
];

// Generate more questions to reach 100 questions
export const generateMoreQuestions = (baseQuestions: ExamQuestion[], standard: string): ExamQuestion[] => {
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "General Knowledge"];
  const mathQuestions = [
    {
      question: "What is 15 × 4?",
      questionGuj: "15 × 4 = કેટલું?",
      options: ["50", "60", "70", "80"],
      optionsGuj: ["50", "60", "70", "80"],
      correctAnswer: 1
    },
    {
      question: "What is 100 ÷ 5?",
      questionGuj: "100 ÷ 5 = કેટલું?",
      options: ["15", "20", "25", "30"],
      optionsGuj: ["15", "20", "25", "30"],
      correctAnswer: 1
    }
  ];
  
  const scienceQuestions = [
    {
      question: "What is the hardest natural substance?",
      questionGuj: "સૌથી કઠણ કુદરતી પદાર્થ કયો છે?",
      options: ["Gold", "Iron", "Diamond", "Silver"],
      optionsGuj: ["સોનું", "લોખંડ", "હીરો", "ચાંદી"],
      correctAnswer: 2
    },
    {
      question: "How many bones are there in an adult human body?",
      questionGuj: "પુખ્ત વયના માનવ શરીરમાં કેટલાં હાડકાં હોય છે?",
      options: ["106", "206", "306", "406"],
      optionsGuj: ["106", "206", "306", "406"],
      correctAnswer: 1
    }
  ];

  const allQuestions: ExamQuestion[] = [...baseQuestions];
  
  // Generate additional questions to reach 100
  for (let i = baseQuestions.length; i < 100; i++) {
    const questionTemplates = i % 2 === 0 ? mathQuestions : scienceQuestions;
    const template = questionTemplates[i % questionTemplates.length];
    
    allQuestions.push({
      id: `q${i + 1}`,
      question: template.question,
      questionGuj: template.questionGuj,
      options: template.options,
      optionsGuj: template.optionsGuj,
      correctAnswer: template.correctAnswer,
      standard: standard,
      subject: subjects[i % subjects.length],
      setNumber: 1
    });
  }
  
  return allQuestions;
};

// Mock results data
export const mockResults: ExamResult[] = [
  {
    id: "result-1",
    studentId: "student-1",
    examId: "exam-1",
    standard: "Class 5",
    score: 85,
    totalQuestions: 100,
    correctAnswers: 85,
    wrongAnswers: 15,
    timeSpent: 3420, // 57 minutes
    rank: 1,
    percentage: 85,
    reward: "Gold Medal",
    completedAt: "2024-08-15T11:00:00Z"
  }
];

export const getExamByStandard = (standard: string): ExamSchedule | undefined => {
  return examSchedules.find(exam => exam.standard === standard && exam.isActive);
};

export const getQuestionsForExam = (standard: string, setNumber: number = 1): ExamQuestion[] => {
  const baseQuestions = examQuestions.filter(q => q.standard === standard && q.setNumber === setNumber);
  return generateMoreQuestions(baseQuestions, standard);
};

export const getResultForStudent = (studentId: string, examId: string): ExamResult | undefined => {
  return mockResults.find(result => result.studentId === studentId && result.examId === examId);
};