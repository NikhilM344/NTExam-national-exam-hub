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
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-background" id="winners" itemScope itemType="https://schema.org/Person">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground" itemProp="name">
              NTexam Top Performers & Academic Champions
            </h2>
            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" itemProp="description">
            Meet our exceptional students who achieved academic excellence in competitive exams. 
            These inspiring young minds represent the future leaders of India and motivate thousands of students nationwide.
          </p>
        </header>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, index) => (
            <Card 
              key={winner.id} 
              className="relative overflow-hidden shadow-winner hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-card border-0 group"
            >
              {/* Position Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-warning to-accent p-2 rounded-full shadow-soft">
                  <Crown className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Rank Number */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-success text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center shadow-soft">
                  {index + 1}
                </div>
              </div>

              <CardContent className="p-6 text-center">
                {/* Winner Photo */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gradient-success shadow-winner group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={winner.image} 
                      alt={winner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Stars */}
                  <div className="absolute -top-2 -right-2 animate-pulse-soft">
                    <Star className="h-6 w-6 text-warning fill-current" />
                  </div>
                </div>

                {/* Winner Details */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{winner.name}</h3>
                  
                  <div className="space-y-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/10 text-primary font-semibold"
                    >
                      {winner.class}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground">{winner.school}</p>
                  </div>

                  {/* Subject & Score */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="font-semibold text-foreground">{winner.subject}</span>
                    </div>
                    <div className="text-2xl font-bold text-success">{winner.score}</div>
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-success text-white"
                    >
                      {winner.badge}
                    </Badge>
                  </div>

                  {/* Achievement Quote */}
                  <div className="text-xs text-muted-foreground italic">
                    "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                  </div>
                </div>
              </CardContent>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-warning via-accent to-success"></div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-card rounded-2xl shadow-card">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Be the Next Winner!
          </h3>
          <p className="text-muted-foreground mb-6">
            Join our upcoming exams and showcase your talents. Winners get certificates, 
            prizes, and recognition on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-soft">
              <Trophy className="h-5 w-5 inline mr-2" />
              Register for Exams
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
              View All Winners
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinnersSection;