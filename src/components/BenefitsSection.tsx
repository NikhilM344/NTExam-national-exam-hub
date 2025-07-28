import { Brain, Target, Users, Award, BookOpen, Trophy, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Brain,
      title: "Enhanced Learning",
      description: "Develop critical thinking and problem-solving skills through challenging exam questions",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: Target,
      title: "Goal Achievement",
      description: "Set and achieve academic milestones with structured exam preparation and feedback",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: Users,
      title: "Peer Competition",
      description: "Compete with thousands of students nationwide and learn from healthy competition",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Award,
      title: "Recognition & Rewards",
      description: "Earn certificates, medals, and recognition for outstanding performance in exams",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Quality Study Material",
      description: "Access comprehensive syllabus, sample papers, and expertly crafted study resources",
      color: "from-pink-400 to-purple-500"
    },
    {
      icon: Trophy,
      title: "Success Tracking",
      description: "Monitor your progress with detailed analytics and performance reports",
      color: "from-teal-400 to-blue-500"
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Students Enrolled", icon: Users },
    { number: "5,000+", label: "Winners Produced", icon: Trophy },
    { number: "95%", label: "Success Rate", icon: Star },
    { number: "100+", label: "Schools Participating", icon: BookOpen }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Benefits of Participating in the{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NTexam
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our comprehensive exam platform and unlock your potential. Experience the 
            advantages that have helped thousands of students achieve academic excellence.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden shadow-card hover:shadow-winner transition-all duration-500 hover:scale-105 bg-gradient-card border-0 group"
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.color} mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>

                {/* Check Mark */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </CardContent>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}></div>
            </Card>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-8">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Our Impact in Numbers
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="mb-3">
                  <achievement.icon className="h-8 w-8 mx-auto text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1 group-hover:scale-110 transition-transform duration-300">
                  {achievement.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-winner">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Success Journey?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have already begun their path to academic excellence. 
              Register today and experience the benefits of NTexam firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-soft">
                <Trophy className="h-5 w-5 inline mr-2" />
                Register Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;