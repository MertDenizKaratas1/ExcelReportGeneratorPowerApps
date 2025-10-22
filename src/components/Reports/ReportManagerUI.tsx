import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  Card,
  CardPreview,
  Text,
  Badge,
  Spinner,
  SearchBox,
  Dropdown,
  Option,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Field,
  Textarea,
  tokens,
  makeStyles
} from '@fluentui/react-components';
import {
  Add24Regular,
  DocumentCopy24Regular,
  Delete24Regular,
  Open24Regular,
  CloudArrowDown24Regular,
  CloudArrowUp24Regular,
  Search24Regular
} from '@fluentui/react-icons';
import { ReportManager } from '../../services/reportManager';
import { ReportDefinition, ReportListItem } from '../../types/reportTypes';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    height: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM
  },
  filters: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: tokens.spacingVerticalM,
    flex: 1,
    overflowY: 'auto'
  },
  reportCard: {
    height: '200px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8
    }
  },
  cardContent: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    height: '100%'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS
  },
  cardActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    '&:hover': {
      opacity: 1
    }
  },
  cardMeta: {
    marginTop: 'auto',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXXS,
    marginTop: tokens.spacingVerticalXS
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: tokens.spacingVerticalL,
    textAlign: 'center'
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  importButton: {
    position: 'relative'
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  }
});

interface ReportManagerUIProps {
  onOpenReport: (report: ReportDefinition) => void;
  onCreateNew: () => void;
}

export const ReportManagerUI: React.FC<ReportManagerUIProps> = ({
  onOpenReport,
  onCreateNew
}) => {
  const styles = useStyles();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [entities, setEntities] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [newReportEntity, setNewReportEntity] = useState('');
  const [newReportDescription, setNewReportDescription] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    try {
      const reportList = ReportManager.getReportList();
      const allEntities = ReportManager.getAllEntities();
      const allTags = ReportManager.getAllTags();
      
      setReports(reportList);
      setEntities(allEntities);
      setTags(allTags);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = useCallback(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = ReportManager.searchReports(searchQuery.trim());
    }

    // Apply entity filter
    if (selectedEntity) {
      filtered = filtered.filter(report => report.primaryEntity === selectedEntity);
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(report => report.tags.includes(selectedTag));
    }

    setFilteredReports(filtered);
  }, [reports, searchQuery, selectedEntity, selectedTag]);

  // Filter reports when search/filter criteria change
  useEffect(() => {
    filterReports();
  }, [filterReports]);

  const handleOpenReport = async (reportId: string) => {
    const report = ReportManager.getReport(reportId);
    if (report) {
      onOpenReport(report);
    }
  };

  const handleDuplicateReport = (reportId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const duplicated = ReportManager.duplicateReport(reportId);
    if (duplicated) {
      loadReports();
    }
  };

  const handleDeleteReport = (reportId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report?')) {
      ReportManager.deleteReport(reportId);
      loadReports();
    }
  };

  const handleCreateNewReport = () => {
    if (!newReportName.trim() || !newReportEntity.trim()) {
      return;
    }

    const newReport = ReportManager.createNewReport(newReportName.trim(), newReportEntity.trim());
    newReport.description = newReportDescription.trim();
    
    ReportManager.saveReport(newReport);
    setShowNewReportDialog(false);
    setNewReportName('');
    setNewReportEntity('');
    setNewReportDescription('');
    loadReports();
    
    // Open the new report
    onOpenReport(newReport);
  };

  const handleExportReports = () => {
    ReportManager.exportReports();
  };

  const handleImportReports = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      ReportManager.importReports(file).then(result => {
        if (result.success > 0) {
          alert(`Successfully imported ${result.success} reports`);
          loadReports();
        }
        if (result.errors.length > 0) {
          alert(`Import completed with errors:\n${result.errors.join('\n')}`);
        }
      });
    }
    // Reset input
    event.target.value = '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Spinner size="large" />
          <Text>Loading reports...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Text as="h2" size={600} weight="semibold">Excel Report Generator</Text>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={onCreateNew}
          >
            Quick Start
          </Button>
          
          <Dialog open={showNewReportDialog} onOpenChange={(_, data) => setShowNewReportDialog(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <Button icon={<Add24Regular />}>New Report</Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogContent>
                <div className={styles.dialogContent}>
                  <Field label="Report Name" required>
                    <Input
                      value={newReportName}
                      onChange={(_, data) => setNewReportName(data.value)}
                      placeholder="Enter report name..."
                    />
                  </Field>
                  <Field label="Primary Entity" required>
                    <Input
                      value={newReportEntity}
                      onChange={(_, data) => setNewReportEntity(data.value)}
                      placeholder="e.g., employee, account, contact..."
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea
                      value={newReportDescription}
                      onChange={(_, data) => setNewReportDescription(data.value)}
                      placeholder="Describe what this report does..."
                      rows={3}
                    />
                  </Field>
                </div>
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setShowNewReportDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  appearance="primary" 
                  onClick={handleCreateNewReport}
                  disabled={!newReportName.trim() || !newReportEntity.trim()}
                >
                  Create Report
                </Button>
              </DialogActions>
            </DialogSurface>
          </Dialog>

          <Button
            icon={<CloudArrowUp24Regular />}
            onClick={handleExportReports}
          >
            Export
          </Button>

          <div className={styles.importButton}>
            <Button icon={<CloudArrowDown24Regular />}>
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportReports}
              className={styles.hiddenInput}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <SearchBox
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          contentBefore={<Search24Regular />}
        />

        <Dropdown
          placeholder="Filter by Entity"
          value={selectedEntity}
          onOptionSelect={(_, data) => setSelectedEntity(data.optionValue || '')}
        >
          <Option value="">All Entities</Option>
          {entities.map(entity => (
            <Option key={entity} value={entity}>{entity}</Option>
          ))}
        </Dropdown>

        <Dropdown
          placeholder="Filter by Tag"
          value={selectedTag}
          onOptionSelect={(_, data) => setSelectedTag(data.optionValue || '')}
        >
          <Option value="">All Tags</Option>
          {tags.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Dropdown>

        {(searchQuery || selectedEntity || selectedTag) && (
          <Button
            size="small"
            appearance="subtle"
            onClick={() => {
              setSearchQuery('');
              setSelectedEntity('');
              setSelectedTag('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className={styles.emptyState}>
          <Text size={500}>No reports found</Text>
          <Text>Create your first report to get started</Text>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={onCreateNew}
          >
            Create New Report
          </Button>
        </div>
      ) : (
        <div className={styles.reportsGrid}>
          {filteredReports.map(report => (
            <Card
              key={report.id}
              className={styles.reportCard}
              onClick={() => handleOpenReport(report.id)}
            >
              <CardPreview>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text weight="semibold" truncate title={report.name}>
                        {report.name}
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                        {report.primaryEntity}
                      </Text>
                    </div>
                    <div className={styles.cardActions}>
                      <Button
                        size="small"
                        appearance="subtle"
                        icon={<Open24Regular />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReport(report.id);
                        }}
                        title="Open Report"
                      />
                      <Button
                        size="small"
                        appearance="subtle"
                        icon={<DocumentCopy24Regular />}
                        onClick={(e) => handleDuplicateReport(report.id, e)}
                        title="Duplicate Report"
                      />
                      <Button
                        size="small"
                        appearance="subtle"
                        icon={<Delete24Regular />}
                        onClick={(e) => handleDeleteReport(report.id, e)}
                        title="Delete Report"
                      />
                    </div>
                  </div>

                  <Text size={200} style={{ flex: 1, overflow: 'hidden' }}>
                    {report.description || 'No description provided'}
                  </Text>

                  {report.tags.length > 0 && (
                    <div className={styles.tags}>
                      {report.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} size="small" color="informative">
                          {tag}
                        </Badge>
                      ))}
                      {report.tags.length > 3 && (
                        <Badge size="small" color="subtle">
                          +{report.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className={styles.cardMeta}>
                    <Text size={100}>
                      Updated {formatDate(report.updatedAt)} • v{report.reportVersion}
                    </Text>
                  </div>
                </div>
              </CardPreview>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};