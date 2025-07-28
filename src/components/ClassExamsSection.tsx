import { Clock, Users, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ClassExamsSection = () => {
  const examClasses = [
    {
      id: 1,
      class: "Class 6",
      subject: "Mathematics & Science",
      duration: "2 hours",
      participants: 1250,
      registrationEnd: "15 Mar 2024",
      examDate: "25 Mar 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 2,
      class: "Class 7",
      subject: "Math, Science & English",
      duration: "2.5 hours",
      participants: 980,
      registrationEnd: "18 Mar 2024",
      examDate: "28 Mar 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-green-400 to-blue-500"
    },
    {
      id: 3,
      class: "Class 8",
      subject: "All Subjects",
      duration: "3 hours",
      participants: 1580,
      registrationEnd: "20 Mar 2024",
      examDate: "30 Mar 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 4,
      class: "Class 9",
      subject: "Core Subjects",
      duration: "3 hours",
      participants: 2100,
      registrationEnd: "22 Mar 2024",
      examDate: "2 Apr 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-orange-400 to-red-500"
    },
    {
      id: 5,
      class: "Class 10",
      subject: "Board Preparation",
      duration: "3.5 hours",
      participants: 3200,
      registrationEnd: "25 Mar 2024",
      examDate: "5 Apr 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-pink-400 to-purple-500"
    },
    {
      id: 6,
      class: "Class 12",
      subject: "Competitive Prep",
      duration: "4 hours",
      participants: 1890,
      registrationEnd: "28 Mar 2024",
      examDate: "8 Apr 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      color: "from-teal-400 to-blue-500"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Class-wise Active Exams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your class and register for upcoming competitive exams. 
            Join thousands of students in their journey to academic excellence.
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examClasses.map((exam) => (
            <Card 
              key={exam.id} 
              className="relative overflow-hidden shadow-card hover:shadow-winner transition-all duration-300 hover:scale-105 bg-gradient-card border-0"
            >
              {/* Class Badge */}
              <div className={`absolute top-0 right-0 bg-gradient-to-r ${exam.color} p-3 rounded-bl-xl`}>
                <span className="text-white font-bold text-sm">{exam.class}</span>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                  {exam.subject}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Exam Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Duration
                    </div>
                    <span className="font-medium text-foreground">{exam.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Registered
                    </div>
                    <span className="font-medium text-foreground">{exam.participants.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      Exam Date
                    </div>
                    <span className="font-medium text-foreground">{exam.examDate}</span>
                  </div>
                </div>

                {/* Fees */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Registration Fees</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Boys: <span className="font-medium text-foreground">₹{exam.fees.boys}</span></span>
                    <span className="text-muted-foreground">Girls: <span className="font-medium text-foreground">₹{exam.fees.girls}</span></span>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Registration ends on</p>
                  <p className="text-sm font-semibold text-warning">{exam.registrationEnd}</p>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className={`w-full bg-gradient-to-r ${exam.color} hover:opacity-90 text-white font-semibold transition-all duration-300`}
                >
                  Register Now
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
          >
            View All Upcoming Exams
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClassExamsSection;