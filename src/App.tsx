import React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { ReportBuilderDashboard } from './components/Dashboard/ReportBuilderDashboard';
import { LoadingProvider } from './contexts/LoadingContext';
import { GlobalLoadingOverlay } from './components/LoadingOverlay/GlobalLoadingOverlay';
import { WelcomePage } from './components/Welcome/WelcomePage';
import './App.css';

function App() {
  const [isDarkMode] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(true);

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <LoadingProvider>
        <div style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', minHeight: '100vh' }}>
          {showWelcome ? (
            <WelcomePage
              onGetStarted={() => setShowWelcome(false)}
              onBrowseReports={() => setShowWelcome(false)}
              onImportSample={() => setShowWelcome(false)}
            />
          ) : (
            <>
              <ReportBuilderDashboard />
              <GlobalLoadingOverlay />
            </>
          )}
        </div>
      </LoadingProvider>
    </FluentProvider>
  );
}

export default App;
