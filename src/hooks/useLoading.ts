import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: (message?: string, variant?: 'book' | 'exam' | 'study' | 'achievement') => void;
  stopLoading: () => void;
  loadingMessage: string;
  loadingVariant: 'book' | 'exam' | 'study' | 'achievement';
}

export const useLoading = (initialMessage: string = "Loading..."): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(initialMessage);
  const [loadingVariant, setLoadingVariant] = useState<'book' | 'exam' | 'study' | 'achievement'>('book');

  const startLoading = useCallback((message?: string, variant: 'book' | 'exam' | 'study' | 'achievement' = 'book') => {
    if (message) {
      setLoadingMessage(message);
    }
    setLoadingVariant(variant);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    loadingMessage,
    loadingVariant,
  };
};

export default useLoading;