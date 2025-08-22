import React from 'react';
import { Loader } from '@/components/ui/loader';
import { BookOpen, Clock, Users } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
  variant?: 'book' | 'exam' | 'study' | 'achievement';
}

const educationalMessages = [
  "Preparing your exam materials...",
  "Loading study resources...",
  "Setting up your learning environment...",
  "Fetching exam questions...",
  "Initializing your dashboard...",
  "Connecting to exam portal...",
  "Preparing your test session...",
  "Loading syllabus content...",
];

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ 
  isLoading, 
  message,
  variant = 'book'
}) => {
  if (!isLoading) return null;

  const displayMessage = message || educationalMessages[Math.floor(Math.random() * educationalMessages.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Main Loader */}
        <div className="relative">
          <Loader size="lg" variant={variant} />
          
          {/* Floating Educational Icons */}
          <div className="absolute -top-4 -left-4 animate-bounce delay-100">
            <BookOpen className="w-6 h-6 text-primary opacity-60" />
          </div>
          <div className="absolute -top-4 -right-4 animate-bounce delay-300">
            <Clock className="w-5 h-5 text-secondary opacity-60" />
          </div>
          <div className="absolute -bottom-4 -right-2 animate-bounce delay-500">
            <Users className="w-5 h-5 text-accent opacity-60" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground animate-pulse">
            {displayMessage}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full animate-pulse"></div>
        </div>

        {/* Educational Quote */}
        <div className="text-center text-sm text-muted-foreground italic max-w-md">
          "Education is the most powerful weapon which you can use to change the world."
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;