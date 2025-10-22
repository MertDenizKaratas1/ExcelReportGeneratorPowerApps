import React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { ReportBuilderDashboard } from './components/Dashboard/ReportBuilderDashboard';
import { LoadingProvider } from './contexts/LoadingContext';
import { GlobalLoadingOverlay } from './components/LoadingOverlay/GlobalLoadingOverlay';
import './App.css';

function App() {
  const [isDarkMode] = React.useState(false);

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <LoadingProvider>
        <div style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', minHeight: '100vh' }}>
          <ReportBuilderDashboard />
          <GlobalLoadingOverlay />
        </div>
      </LoadingProvider>
    </FluentProvider>
  );
}

export default App;
