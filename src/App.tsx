import React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { FlowBuilder } from './components/FlowBuilder/FlowBuilder';
import { ReportsPage } from './components/Reports/ReportsPage';
import { LoadingProvider } from './contexts/LoadingContext';
import { GlobalLoadingOverlay } from './components/LoadingOverlay/GlobalLoadingOverlay';
import './App.css';

function App() {
  const [isDarkMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState('reports');

  // Simple routing based on hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash.startsWith('/flow-builder')) {
        setCurrentPage('flow-builder');
      } else if (hash === '/reports' || hash === '') {
        setCurrentPage('reports');
      }
    };

    // Set initial page
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'flow-builder':
        return <FlowBuilder />;
      case 'reports':
      default:
        return <ReportsPage />;
    }
  };

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <LoadingProvider>
        <div style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', minHeight: '100vh' }}>
          {renderCurrentPage()}
          <GlobalLoadingOverlay />
        </div>
      </LoadingProvider>
    </FluentProvider>
  );
}

export default App;
