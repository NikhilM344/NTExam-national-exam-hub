import { Star, Trophy, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Star className="h-8 w-8 text-warning opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Trophy className="h-10 w-10 text-accent opacity-60" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <BookOpen className="h-6 w-6 text-success opacity-60" />
        </div>
        <div className="absolute bottom-20 right-16 animate-float" style={{ animationDelay: '0.5s' }}>
          <Users className="h-8 w-8 text-secondary opacity-60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
                NTexam
              </span>{' '}
              National Talent Exam
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-medium">
              Your Gateway to Academic Excellence
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of students preparing for competitive exams with our comprehensive 
              study materials, mock tests, and expert guidance. Start your journey to success today!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-xl shadow-card transition-transform hover:scale-105"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-transform hover:scale-105"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Syllabus
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80">Winners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/80">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;