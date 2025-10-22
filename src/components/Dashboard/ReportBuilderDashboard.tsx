import React, { useState, useCallback } from 'react';
import { FlowBuilder } from '../FlowBuilder/FlowBuilder';
import { ReportManagerUI } from '../Reports/ReportManagerUI';
import { ReportDefinition } from '../../types/reportTypes';
import { ReportManager } from '../../services/reportManager';
import { ReportJsonConverter } from '../../services/reportJsonConverter';
import {
  Button,
  Text,
  tokens,
  makeStyles
} from '@fluentui/react-components';
import {
  ArrowLeft24Regular,
  Save24Regular,
  Eye24Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: tokens.colorNeutralBackground1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    background: tokens.colorNeutralBackground1,
    gap: tokens.spacingHorizontalM
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS
  },
  content: {
    flex: 1,
    overflow: 'hidden'
  },
  jsonPanel: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    background: tokens.colorNeutralBackground2,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  },
  jsonHeader: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  jsonContent: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingVerticalS
  },
  jsonCode: {
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '12px',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
});

export const ReportBuilderDashboard: React.FC = () => {
  const styles = useStyles();
  const [currentView, setCurrentView] = useState<'manager' | 'builder'>('manager');
  const [currentReport, setCurrentReport] = useState<ReportDefinition | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleOpenReport = useCallback((report: ReportDefinition) => {
    setCurrentReport(report);
    setCurrentView('builder');
    setHasUnsavedChanges(false);
  }, []);

  const handleCreateNew = useCallback(() => {
    // Create a sample report for quick start
    const sampleReport = ReportJsonConverter.createSampleReport();
    setCurrentReport(sampleReport);
    setCurrentView('builder');
    setHasUnsavedChanges(false);
  }, []);

  const handleBackToManager = useCallback(() => {
    if (hasUnsavedChanges && window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
      setCurrentView('manager');
      setCurrentReport(null);
      setHasUnsavedChanges(false);
    } else if (!hasUnsavedChanges) {
      setCurrentView('manager');
      setCurrentReport(null);
    }
  }, [hasUnsavedChanges]);

  const handleReportChange = useCallback((updatedReport: ReportDefinition) => {
    setCurrentReport(updatedReport);
    setHasUnsavedChanges(true);
  }, []);

  const handleSaveReport = useCallback((report: ReportDefinition) => {
    ReportManager.saveReport(report);
    setCurrentReport(report);
    setHasUnsavedChanges(false);
  }, []);

  const handleToggleJsonPreview = useCallback(() => {
    setShowJsonPreview(!showJsonPreview);
  }, [showJsonPreview]);

  const renderHeader = () => {
    if (currentView === 'manager') {
      return null; // ReportManagerUI handles its own header
    }

    return (
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Button
            appearance="subtle"
            icon={<ArrowLeft24Regular />}
            onClick={handleBackToManager}
          >
            Reports
          </Button>
          <Text>/</Text>
          <Text weight="semibold">
            {currentReport?.name || 'Untitled Report'}
            {hasUnsavedChanges && '*'}
          </Text>
        </div>
        
        <div className={styles.actions}>
          <Button
            appearance="secondary"
            icon={<Eye24Regular />}
            onClick={handleToggleJsonPreview}
          >
            {showJsonPreview ? 'Hide' : 'Show'} JSON
          </Button>
          
          <Button
            appearance="primary"
            icon={<Save24Regular />}
            onClick={() => currentReport && handleSaveReport(currentReport)}
            disabled={!hasUnsavedChanges}
          >
            Save Report
          </Button>
        </div>
      </div>
    );
  };

  const renderJsonPreview = () => {
    if (!showJsonPreview || !currentReport) return null;

    return (
      <div className={styles.jsonPanel}>
        <div className={styles.jsonHeader}>
          <Text weight="semibold">JSON Preview</Text>
          <Button
            appearance="subtle"
            size="small"
            onClick={handleToggleJsonPreview}
          >
            ✕
          </Button>
        </div>
        <div className={styles.jsonContent}>
          <pre className={styles.jsonCode}>
            {JSON.stringify(currentReport, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderHeader()}
      
      <div className={styles.content}>
        {currentView === 'manager' ? (
          <ReportManagerUI
            onOpenReport={handleOpenReport}
            onCreateNew={handleCreateNew}
          />
        ) : (
          <FlowBuilder
            initialReport={currentReport || undefined}
            onReportChange={handleReportChange}
            onReportSave={handleSaveReport}
          />
        )}
      </div>

      {renderJsonPreview()}
    </div>
  );
};