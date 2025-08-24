import { useNavigate } from "react-router-dom";
import { Clock, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ClassExamsSection = () => {
  const navigate = useNavigate();

  const examClasses = [
    {
      id: 1,
      class: "Class 6",
      subject: "Mathematics & Science Fundamentals",
      duration: "2 hours",
      participants: 1250,
      registrationEnd: "15 Mar 2024",
      examDate: "25 Mar 2024",
      fees: { boys: 350, girls: 250 },
      isActive: true,
      badgeColor: "from-blue-400 to-purple-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      description: "Build strong foundation in core mathematics and science concepts for Class 6 students"
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
      badgeColor: "from-green-400 to-blue-500",
      buttonColor: "bg-green-600 hover:bg-green-700"
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
      badgeColor: "from-purple-400 to-pink-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
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
      badgeColor: "from-orange-400 to-red-500",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
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
      badgeColor: "from-pink-400 to-purple-500",
      buttonColor: "bg-pink-600 hover:bg-pink-700"
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
      badgeColor: "from-teal-400 to-blue-500",
      buttonColor: "bg-teal-600 hover:bg-teal-700"
    }
  ];

  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle relative overflow-hidden"
      id="exams"
      itemScope
      itemType="https://schema.org/EducationalEvent"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            National Level Exams
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6" itemProp="name">
            Class-wise  NTE Exam
          </h2>
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            itemProp="description"
          >
            Register for India's premier online  NTE Exam designed for Classes 6-12.
            Join over 50,000+ students nationwide and compete for academic excellence.
          </p>
        </header>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {examClasses.map((exam, index) => (
            <Card
              key={exam.id}
              className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              itemScope
              itemType="https://schema.org/ExamEvent"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Class Badge */}
              <div className={`absolute top-0 right-0 bg-gradient-to-r ${exam.badgeColor} p-3 rounded-bl-2xl shadow-lg`}>
                <span className="text-white font-bold text-sm drop-shadow-sm">{exam.class}</span>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold text-foreground mb-3 pr-16">
                  {exam.subject}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-success/15 text-success border-success/20 font-medium">
                    Active Registration
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 relative z-10">
                {/* Exam Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Duration
                    </div>
                    <span className="font-semibold text-foreground">{exam.duration}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-1.5 bg-secondary/10 rounded-md">
                        <Users className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      Registered
                    </div>
                    <span className="font-semibold text-foreground">{exam.participants.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-1.5 bg-warning/10 rounded-md">
                        <Award className="h-3.5 w-3.5 text-warning" />
                      </div>
                      Exam Date
                    </div>
                    <span className="font-semibold text-foreground">{exam.examDate}</span>
                  </div>
                </div>

                {/* Fees */}
                <div className="bg-gradient-to-r from-muted/40 to-muted/60 rounded-xl p-4 border border-border/30">
                  <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Registration Fees
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-card/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Boys</p>
                      <p className="font-bold text-foreground">₹{exam.fees.boys}</p>
                    </div>
                    <div className="text-center p-2 bg-card/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Girls</p>
                      <p className="font-bold text-foreground">₹{exam.fees.girls}</p>
                    </div>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="text-center bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Registration closes on</p>
                  <p className="text-sm font-bold text-warning">{exam.registrationEnd}</p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 relative z-10">
                <Button
                  onClick={() => navigate("/registration")}
                  className={`w-full ${exam.buttonColor} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  aria-label={`Register for ${exam.class}`}
                >
                  Register Now
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={() => navigate("/registration")}
          >
            View All Upcoming Exams
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClassExamsSection;
