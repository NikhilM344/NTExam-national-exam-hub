import React from 'react';
import { Loader } from '@/components/ui/loader';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ 
  isLoading, 
  message = "Loading..." 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader size="lg" />
        <p className="text-lg font-medium text-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;