import React from 'react';
import {
  DocumentAdd20Regular,
  FolderOpen20Regular,
  Save20Regular,
  Play20Regular,
  CheckmarkCircle20Regular,
  DocumentArrowDown20Regular,
  History20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
} from '@fluentui/react-icons';

interface CommandBarProps {
  onNew: () => void;
  onSave: () => void;
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: () => void;
  onValidate: () => void;
  onExport: () => void;
  onToggleHistory: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onNew,
  onSave,
  onLoad,
  onPreview,
  onValidate,
  onExport,
  onToggleHistory,
  onToggleTheme,
  isDarkMode,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  const handleNewClick = () => {
    onNew();
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      width: '100%'
    }}>
      {/* Left section - Main actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="n8n-button" onClick={handleNewClick}>
          <DocumentAdd20Regular />
          New
        </button>
        
        <button className="n8n-button" onClick={handleOpenClick}>
          <FolderOpen20Regular />
          Open
        </button>
        
        <button className="n8n-button" onClick={onSave}>
          <Save20Regular />
          Save
        </button>
      </div>

      {/* Divider */}
      <div style={{ 
        width: '1px', 
        height: '24px', 
        background: 'var(--color-border)',
        margin: '0 8px'
      }} />

      {/* Center section - Flow actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="n8n-button primary" onClick={onPreview}>
          <Play20Regular />
          Execute
        </button>
        
        <button className="n8n-button" onClick={onValidate}>
          <CheckmarkCircle20Regular />
          Validate
        </button>
        
        <button className="n8n-button" onClick={onExport}>
          <DocumentArrowDown20Regular />
          Export
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right section - Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="n8n-button" onClick={onToggleHistory}>
          <History20Regular />
          History
        </button>
        
        <button 
          className="n8n-button" 
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <WeatherSunny20Regular /> : <WeatherMoon20Regular />}
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={onLoad}
      />
    </div>
  );
};