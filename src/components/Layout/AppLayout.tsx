import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
} from '@fluentui/react-components';
import {
  Navigation20Regular,
  DocumentTable20Regular,
  DocumentOnePage20Regular,
  DataUsage20Regular,
  DatabaseSearch20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
  Home20Regular,
} from '@fluentui/react-icons';

interface AppLayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  isDarkMode,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <Home20Regular />, label: 'Dashboard' },
    { path: '/compile-report', icon: <DocumentTable20Regular />, label: 'Compile Report' },
    { path: '/execute-page', icon: <DocumentOnePage20Regular />, label: 'Execute Page' },
    { path: '/entity-graph', icon: <DataUsage20Regular />, label: 'Entity Graph' },
    { path: '/metadata-snapshot', icon: <DatabaseSearch20Regular />, label: 'Metadata Snapshot' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        height: '64px', 
        padding: '0 24px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#0078d4',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Navigation20Regular />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Excel Generator</h1>
          <span style={{ 
            padding: '2px 8px', 
            borderRadius: '4px', 
            backgroundColor: '#107c10', 
            color: 'white', 
            fontSize: '12px',
            fontWeight: 600 
          }}>
            Power Apps
          </span>
        </div>
        <Button
          appearance="subtle"
          icon={isDarkMode ? <WeatherSunny20Regular /> : <WeatherMoon20Regular />}
          onClick={onToggleTheme}
          style={{ color: 'white' }}
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <nav style={{ 
          width: '240px', 
          borderRight: '1px solid #e0e0e0', 
          backgroundColor: '#fafafa', 
          padding: '16px 8px',
          overflowY: 'auto'
        }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              appearance={isActive(item.path) ? 'primary' : 'subtle'}
              icon={item.icon}
              onClick={() => navigate(item.path)}
              style={{ 
                width: '100%', 
                justifyContent: 'flex-start', 
                marginBottom: '4px',
                textAlign: 'left'
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
