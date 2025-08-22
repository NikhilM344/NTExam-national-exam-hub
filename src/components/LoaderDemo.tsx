import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoadingContext } from '@/context/LoadingContext';
import { BookOpen, PenTool, GraduationCap, Trophy } from 'lucide-react';

const LoaderDemo = () => {
  const { startLoading, stopLoading } = useLoadingContext();

  const demoLoaders = [
    {
      variant: 'book' as const,
      title: 'Book Loader',
      description: 'Default educational loader with animated book',
      icon: BookOpen,
      message: 'Loading educational content...',
      color: 'text-primary'
    },
    {
      variant: 'exam' as const,
      title: 'Exam Loader',
      description: 'Perfect for exam-related actions',
      icon: PenTool,
      message: 'Preparing your exam environment...',
      color: 'text-secondary'
    },
    {
      variant: 'study' as const,
      title: 'Study Loader',
      description: 'Great for study materials and resources',
      icon: BookOpen,
      message: 'Loading study materials...',
      color: 'text-accent'
    },
    {
      variant: 'achievement' as const,
      title: 'Achievement Loader',
      description: 'For awards, certificates, and achievements',
      icon: Trophy,
      message: 'Preparing your achievements...',
      color: 'text-warning'
    }
  ];

  const handleDemoLoader = (variant: 'book' | 'exam' | 'study' | 'achievement', message: string) => {
    startLoading(message, variant);
    
    // Auto-stop after 3 seconds for demo
    setTimeout(() => {
      stopLoading();
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Educational Loader Showcase
        </h2>
        <p className="text-muted-foreground text-lg">
          Experience different loading animations for various educational contexts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {demoLoaders.map((loader) => (
          <Card key={loader.variant} className="shadow-card bg-gradient-card border-0 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-muted/50 w-fit">
                <loader.icon className={`h-8 w-8 ${loader.color}`} />
              </div>
              <CardTitle className="text-lg font-bold text-foreground">
                {loader.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {loader.description}
              </p>
              <Button 
                onClick={() => handleDemoLoader(loader.variant, loader.message)}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="sm"
              >
                Demo {loader.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/30 rounded-xl p-6 border">
        <h3 className="text-xl font-bold text-foreground mb-4">Usage Examples</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Registration Process</h4>
            <code className="bg-muted p-2 rounded text-xs block">
              startLoading("Processing registration...", "study")
            </code>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Exam Start</h4>
            <code className="bg-muted p-2 rounded text-xs block">
              startLoading("Setting up exam...", "exam")
            </code>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Download Certificate</h4>
            <code className="bg-muted p-2 rounded text-xs block">
              startLoading("Preparing certificate...", "achievement")
            </code>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">General Loading</h4>
            <code className="bg-muted p-2 rounded text-xs block">
              startLoading("Loading content...", "book")
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;