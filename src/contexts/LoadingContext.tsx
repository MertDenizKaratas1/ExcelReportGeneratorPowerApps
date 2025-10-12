import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  isLoading: boolean;
  message: string;
  operation: string;
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (isLoading: boolean, message?: string, operation?: string) => void;
  showLoading: (message?: string, operation?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading...',
    operation: 'general',
  });

  const setLoading = (isLoading: boolean, message = 'Loading...', operation = 'general') => {
    setLoadingState({
      isLoading,
      message,
      operation,
    });
  };

  const showLoading = (message = 'Loading...', operation = 'general') => {
    setLoading(true, message, operation);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{
      loading,
      setLoading,
      showLoading,
      hideLoading,
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Utility hook for async operations with loading
export const useAsyncWithLoading = () => {
  const { showLoading, hideLoading } = useLoading();

  const executeWithLoading = async <T,>(
    asyncFunction: () => Promise<T>,
    message = 'Loading...',
    operation = 'async'
  ): Promise<T> => {
    try {
      showLoading(message, operation);
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoading();
    }
  };

  return { executeWithLoading };
};