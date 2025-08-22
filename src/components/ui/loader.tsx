import React from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, PenTool, GraduationCap, Trophy } from 'lucide-react';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'book' | 'exam' | 'study' | 'achievement';
}

export const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = 'md', 
  variant = 'book' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  if (variant === 'exam') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="exam-loader">
          <div className="exam-paper">
            <div className="paper-bg bg-card border-2 border-primary/20 rounded-lg shadow-soft">
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <PenTool className="w-4 h-4" />
                  <span className="text-sm font-semibold">NTExam</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-muted rounded animate-pulse"></div>
                  <div className="h-1 bg-muted rounded animate-pulse delay-100"></div>
                  <div className="h-1 bg-muted rounded animate-pulse delay-200"></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary animate-bounce delay-100"></div>
                  <div className="w-3 h-3 rounded-full bg-accent animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'study') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="study-loader">
          <div className="relative">
            <BookOpen className="w-full h-full text-primary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-secondary rounded animate-ping"></div>
                <div className="w-2 h-2 bg-accent rounded animate-ping delay-100"></div>
                <div className="w-2 h-2 bg-warning rounded animate-ping delay-200"></div>
                <div className="w-2 h-2 bg-success rounded animate-ping delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'achievement') {
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        <div className="achievement-loader">
          <div className="relative flex items-center justify-center">
            <div className="absolute">
              <Trophy className="w-full h-full text-secondary animate-pulse" />
            </div>
            <div className="absolute animate-spin">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default book variant (enhanced)
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="book-loader">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 140 120" 
          fill="none"
        >
          <g className="book">
            {/* Book pages */}
            <path 
              className="page page-fold" 
              d="M90,0 L90,120 L11,120 L11,90 C11,85 15,81 20,81 L81,81 C86,81 90,77 90,72 L90,0 Z" 
              fill="rgba(255,255,255,0.9)"
            />
            <path 
              className="page" 
              d="M11,30 L11,120 L90,120 L90,30 C90,25 86,21 81,21 L20,21 C15,21 11,25 11,30 Z" 
              fill="rgba(255,255,255,0.7)"
            />
            <path 
              className="page" 
              d="M11,40 L11,120 L90,120 L90,40 C90,35 86,31 81,31 L20,31 C15,31 11,35 11,40 Z" 
              fill="rgba(255,255,255,0.5)"
            />
            
            {/* Book cover */}
            <path 
              className="cover" 
              d="M11,0 L11,120 L90,120 L90,0 C90,-5 86,-9 81,-9 L20,-9 C15,-9 11,-5 11,0 Z" 
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary-hover))"
              strokeWidth="2"
            />
            
            {/* Book spine shadow */}
            <path 
              className="spine-shadow" 
              d="M11,0 L11,120 L15,120 L15,0 Z" 
              fill="hsl(var(--foreground))"
            />
            
            {/* Page lines */}
            <g className="page-lines" stroke="hsl(var(--secondary))" strokeWidth="1" opacity="0.6">
              <line x1="25" y1="35" x2="75" y2="35" />
              <line x1="25" y1="45" x2="70" y2="45" />
              <line x1="25" y1="55" x2="75" y2="55" />
              <line x1="25" y1="65" x2="65" y2="65" />
            </g>
            
            {/* NTE Logo on cover */}
            <text 
              x="50" 
              y="60" 
              textAnchor="middle" 
              className="text-xs font-bold" 
              fill="hsl(var(--primary-foreground))"
            >
              NTE
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loader;