import { Trophy, Star, Award, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WinnersSection = () => {
  const winners = [
    {
      id: 1,
      name: "Arya Sharma",
      class: "Class 8",
      subject: "Mathematics",
      position: "1st",
      score: "98/100",
      school: "Delhi Public School",
      image: "https://images.unsplash.com/photo-1494790108755-2616c27bb8a6?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    },
    {
      id: 2,
      name: "Rohit Kumar",
      class: "Class 10",
      subject: "Science",
      position: "1st",
      score: "97/100",
      school: "St. Xavier's School",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    },
    {
      id: 3,
      name: "Priya Patel",
      class: "Class 9",
      subject: "English",
      position: "1st",
      score: "96/100",
      school: "Kendriya Vidyalaya",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    },
    {
      id: 4,
      name: "Aman Singh",
      class: "Class 7",
      subject: "Mathematics",
      position: "1st",
      score: "95/100",
      school: "Ryan International",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    },
    {
      id: 5,
      name: "Sneha Reddy",
      class: "Class 6",
      subject: "General Knowledge",
      position: "1st",
      score: "94/100",
      school: "DAV Public School",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    },
    {
      id: 6,
      name: "Vikash Jain",
      class: "Class 12",
      subject: "Physics",
      position: "1st",
      score: "99/100",
      school: "Modern School",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f59?w=150&h=150&fit=crop&crop=face",
      badge: "Gold Medal"
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden" id="winners" itemScope itemType="https://schema.org/Person">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-warning/5"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-warning/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 bg-warning/10 text-warning px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Trophy className="h-5 w-5" />
            Hall of Fame
            <Crown className="h-5 w-5" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6" itemProp="name">
            Top Performers & Academic Champions
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" itemProp="description">
            Meet our exceptional students who achieved academic excellence in competitive exams. 
            These inspiring young minds represent the future leaders of India and motivate thousands of students nationwide.
          </p>
        </header>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <Card 
              key={winner.id} 
              className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-warning/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-2xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Position Badge */}
              <div className="absolute top-5 right-5 z-20">
                <div className="bg-gradient-to-r from-warning to-accent p-2.5 rounded-full shadow-lg backdrop-blur-sm">
                  <Crown className="h-5 w-5 text-white drop-shadow-sm" />
                </div>
              </div>

              {/* Rank Number */}
              <div className="absolute top-5 left-5 z-20">
                <div className="bg-primary text-primary-foreground font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardContent className="p-8 text-center relative z-10">
                {/* Winner Photo */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-warning/30 shadow-xl group-hover:scale-110 group-hover:border-warning/60 transition-all duration-500 bg-gradient-to-br from-warning/20 to-primary/20 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={winner.image} 
                        alt={winner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Floating Stars */}
                  <div className="absolute -top-2 -right-2 animate-pulse-soft">
                    <Star className="h-7 w-7 text-warning fill-current drop-shadow-md" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 animate-pulse-soft" style={{ animationDelay: '1s' }}>
                    <Star className="h-5 w-5 text-accent fill-current drop-shadow-md" />
                  </div>
                </div>

                {/* Winner Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {winner.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/15 text-primary border-primary/20 font-semibold px-3 py-1"
                    >
                      {winner.class}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground font-medium">{winner.school}</p>
                  </div>

                  {/* Subject & Score */}
                  <div className="bg-gradient-to-r from-muted/60 to-muted/40 rounded-xl p-4 space-y-3 border border-border/30">
                    <div className="flex items-center justify-center gap-2">
                      <div className="p-1.5 bg-accent/10 rounded-full">
                        <Award className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground">{winner.subject}</span>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                      {winner.score}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-warning text-white border-warning/20 shadow-md"
                    >
                      {winner.badge}
                    </Badge>
                  </div>

                  {/* Achievement Quote */}
                  <div className="text-xs text-muted-foreground italic bg-muted/30 rounded-lg p-3 border-l-4 border-primary/30">
                    "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                  </div>
                </div>
              </CardContent>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-warning via-accent to-success"></div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-10 bg-gradient-to-br from-card/60 to-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/30 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-warning/5"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Join the Champions
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Be the Next Winner!
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Join our upcoming exams and showcase your talents. Winners get certificates, 
              prizes, and recognition on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group">
                <Trophy className="h-5 w-5 inline mr-2 group-hover:rotate-12 transition-transform" />
                Register for Exams
              </button>
              <button className="border-2 border-primary/30 bg-card/50 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                View All Winners
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinnersSection;