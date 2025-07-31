import React, { createContext, useContext, ReactNode } from 'react';
import { useLoading } from '@/hooks/useLoading';
import { GlobalLoader } from '@/components/GlobalLoader';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const loading = useLoading();

  return (
    <LoadingContext.Provider value={loading}>
      {children}
      <GlobalLoader isLoading={loading.isLoading} message={loading.loadingMessage} />
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;