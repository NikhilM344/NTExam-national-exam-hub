import { Trophy, Star, Award, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const WinnersSection = () => {
  const navigate = useNavigate();

  const winners = [
    {
      id: 1,
      name: "Arya Sharma",
      class: "Class 8",
      subject: "Mathematics",
      position: "1st",
      score: "98/100",
      school: "Delhi Public School",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThtBPHKPM_-cMjNuMAsk_-SXPBLPH5nx6r4CkhlQqCuZTtsSCyq6juabo&s",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqkFxOajDQzpUHqG0nGSS9iqBmf3y6pFLPozl9e7BIUgLvjJpQHZyArQs&s",
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
      image: "https://thumbs.dreamstime.com/b/smiling-indian-kid-girl-wear-school-uniform-stand-lilac-background-portrait-smiling-smart-indian-hispanic-preteen-girl-196261572.jpg",
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
      image: "data:image/jpeg;base64,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",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgXYPrd5BzTne5K7hW24V8IFolUqSPUXOXrZtv-0tQgVJ-m0yIhJOCCdo&s",
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgXYPrd5BzTne5K7hW24V8IFolUqSPUXOXrZtv-0tQgVJ-m0yIhJOCCdo&s",
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
            Meet our exceptional students who achieved academic excellence in  NTE Exam Exam. 
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
              {/* ✅ Navigate to /registration on click */}
              <button
                onClick={() => navigate('/registration')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group inline-flex items-center justify-center"
              >
                <Trophy className="h-5 w-5 inline mr-2 group-hover:rotate-12 transition-transform" />
                Register for Exams
              </button>

              {/* Keep as button or turn into a Link if you have a winners page */}
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
