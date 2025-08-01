import { Star, Trophy, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner" itemScope itemType="https://schema.org/WPHeader">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" aria-hidden="true" />
      
      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block" aria-hidden="true">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 animate-float">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-warning opacity-60" />
        </div>
        <div className="absolute top-20 sm:top-40 right-8 sm:right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-accent opacity-60" />
        </div>
        <div className="absolute bottom-20 sm:bottom-32 left-8 sm:left-20 animate-float" style={{ animationDelay: '2s' }}>
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-success opacity-60" />
        </div>
        <div className="absolute bottom-12 sm:bottom-20 right-6 sm:right-16 animate-float" style={{ animationDelay: '0.5s' }}>
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-secondary opacity-60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Heading */}
          <header className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" itemProp="headline">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
                NTexam
              </span>{' '}
              <span className="block sm:inline">National Talent Exam</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium" itemProp="description">
              India's Premier Online Competitive Exam Platform for Students
            </p>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join over 50,000 students preparing for competitive exams with our comprehensive 
              study materials, practice tests, and expert guidance. Build your academic future with NTexam!
            </p>
          </header>

          {/* CTA Buttons */}
          <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center" role="navigation" aria-label="Main actions">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-card transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-white/30"
              aria-label="Start your competitive exam journey with NTexam"
            >
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Exam Preparation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-white/30"
              aria-label="Explore exam syllabus and study materials"
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              View Syllabus & Sample Papers
            </Button>
          </nav>

          {/* Achievement Stats */}
          <div className="mt-8 sm:mt-12" itemScope itemType="https://schema.org/Organization">
            <h2 className="sr-only">NTexam Platform Statistics and Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-white" itemProp="numberOfEmployees">50,000+</div>
                <div className="text-xs sm:text-sm text-white/80">Active Students</div>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-white">5,000+</div>
                <div className="text-xs sm:text-sm text-white/80">Award Winners</div>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-white">100+</div>
                <div className="text-xs sm:text-sm text-white/80">Study Topics</div>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold text-white">98%</div>
                <div className="text-xs sm:text-sm text-white/80">Success Rate</div>
              </div>
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