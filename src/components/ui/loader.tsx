import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

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
              fill="hsl(217 91% 45%)"
              stroke="hsl(217 91% 35%)"
              strokeWidth="2"
            />
            
            {/* Book spine shadow */}
            <path 
              className="spine-shadow" 
              d="M11,0 L11,120 L15,120 L15,0 Z" 
              fill="hsl(217 91% 25%)"
            />
            
            {/* Page lines */}
            <g className="page-lines" stroke="hsl(217 91% 60%)" strokeWidth="1" opacity="0.6">
              <line x1="25" y1="35" x2="75" y2="35" />
              <line x1="25" y1="45" x2="70" y2="45" />
              <line x1="25" y1="55" x2="75" y2="55" />
              <line x1="25" y1="65" x2="65" y2="65" />
            </g>
          </g>
        </svg>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .book-loader {
            animation: book-flip 2s infinite;
          }
          
          .page-fold {
            animation: page-fold 2s infinite;
            transform-origin: left center;
          }
          
          @keyframes book-flip {
            0%, 20% { transform: rotateY(0deg) rotateX(0deg); }
            25%, 45% { transform: rotateY(-25deg) rotateX(10deg); }
            50%, 70% { transform: rotateY(0deg) rotateX(0deg); }
            75%, 95% { transform: rotateY(25deg) rotateX(-10deg); }
            100% { transform: rotateY(0deg) rotateX(0deg); }
          }
          
          @keyframes page-fold {
            0%, 20% { transform: rotateY(0deg); }
            25%, 45% { transform: rotateY(-15deg); }
            50%, 70% { transform: rotateY(0deg); }
            75%, 95% { transform: rotateY(15deg); }
            100% { transform: rotateY(0deg); }
          }
        `
      }} />
    </div>
  );
};

export default Loader;