import React, { useState, useMemo } from 'react';
import {
  Input,
  Button,
  Dropdown,
  Option,
  Badge,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Search20Regular,
  Add20Regular,
  MoreVertical20Regular,
  Edit20Regular,
  Delete20Regular,
  Copy20Regular,
  Archive20Regular,
  ArrowDownload20Regular,
  Eye20Regular,
  DocumentTable20Regular,
  Calendar20Regular,
  Person20Regular,
  Tag20Regular,
  ChartMultiple20Regular,
  Grid20Regular,
  List20Regular,
  ArrowClockwise20Regular,
} from '@fluentui/react-icons';
import { useLoading } from '../../contexts/LoadingContext';
import { DUMMY_REPORTS, REPORT_CATEGORIES, REPORT_STATUSES, Report } from '../../data/dummyReports';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'lastModified' | 'createdDate' | 'downloadCount' | 'recordCount';
type SortOrder = 'asc' | 'desc';

export const ReportsPage: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('lastModified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Helper function for delays
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    let filtered = DUMMY_REPORTS.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Categories' || report.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort reports
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'lastModified':
          valueA = new Date(a.lastModified).getTime();
          valueB = new Date(b.lastModified).getTime();
          break;
        case 'createdDate':
          valueA = new Date(a.createdDate).getTime();
          valueB = new Date(b.createdDate).getTime();
          break;
        case 'downloadCount':
          valueA = a.downloadCount || 0;
          valueB = b.downloadCount || 0;
          break;
        case 'recordCount':
          valueA = a.recordCount || 0;
          valueB = b.recordCount || 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedStatus, sortField, sortOrder]);

  // Event handlers
  const handleCreateNewReport = async () => {
    showLoading('Creating new report...', 'workflow');
    await delay(1500);
    hideLoading();
    // Navigate to flow builder
    window.location.hash = '#/flow-builder';
  };

  const handleEditReport = async (reportId: string) => {
    showLoading('Loading report...', 'workflow');
    await delay(1200);
    hideLoading();
    // Navigate to flow builder with report ID
    window.location.hash = `#/flow-builder/${reportId}`;
  };

  const handleDeleteReport = async (reportId: string) => {
    showLoading('Deleting report...', 'api');
    await delay(1000);
    hideLoading();
    // Handle deletion logic here
    console.log('Delete report:', reportId);
  };

  const handleDuplicateReport = async (reportId: string) => {
    showLoading('Duplicating report...', 'workflow');
    await delay(1500);
    hideLoading();
    // Handle duplication logic here
    console.log('Duplicate report:', reportId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Report['status']) => {
    const statusConfig = REPORT_STATUSES.find(s => s.key === status);
    return (
      <Badge 
        appearance="filled" 
        color={statusConfig?.color as any || 'gray'}
        size="small"
      >
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: Report['complexity']) => {
    const config = {
      simple: { color: 'success', label: 'Simple' },
      medium: { color: 'warning', label: 'Medium' },
      complex: { color: 'danger', label: 'Complex' }
    };
    
    return (
      <Badge 
        appearance="outline" 
        color={config[complexity].color as any}
        size="small"
      >
        {config[complexity].label}
      </Badge>
    );
  };

  const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <div className="n8n-report-card">
      <div className="n8n-report-card-header">
        <div className="n8n-report-card-title">
          <DocumentTable20Regular className="n8n-report-icon" />
          <h3>{report.name}</h3>
        </div>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button 
              appearance="subtle" 
              icon={<MoreVertical20Regular />}
              size="small"
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Edit20Regular />} onClick={() => handleEditReport(report.id)}>
                Edit Report
              </MenuItem>
              <MenuItem icon={<Copy20Regular />} onClick={() => handleDuplicateReport(report.id)}>
                Duplicate
              </MenuItem>
              <MenuItem icon={<ArrowDownload20Regular />}>
                Export
              </MenuItem>
              <MenuItem icon={<Eye20Regular />}>
                Preview
              </MenuItem>
              {report.status === 'archived' ? (
                <MenuItem icon={<ArrowClockwise20Regular />}>
                  Restore
                </MenuItem>
              ) : (
                <MenuItem icon={<Archive20Regular />}>
                  Archive
                </MenuItem>
              )}
              <MenuItem icon={<Delete20Regular />} onClick={() => handleDeleteReport(report.id)}>
                Delete
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      <div className="n8n-report-card-content">
        <p className="n8n-report-description">{report.description}</p>
        
        <div className="n8n-report-meta">
          <div className="n8n-report-meta-row">
            <Calendar20Regular />
            <span>Modified: {formatDate(report.lastModified)}</span>
          </div>
          <div className="n8n-report-meta-row">
            <Person20Regular />
            <span>By: {report.createdBy}</span>
          </div>
          <div className="n8n-report-meta-row">
            <ChartMultiple20Regular />
            <span>{report.nodeCount} nodes</span>
          </div>
        </div>

        <div className="n8n-report-tags">
          {report.tags.slice(0, 3).map(tag => (
            <Badge key={tag} appearance="outline" size="small">
              <Tag20Regular style={{ fontSize: '10px', marginRight: '4px' }} />
              {tag}
            </Badge>
          ))}
          {report.tags.length > 3 && (
            <Badge appearance="outline" size="small">
              +{report.tags.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      <div className="n8n-report-card-footer">
        <div className="n8n-report-badges">
          {getStatusBadge(report.status)}
          {getComplexityBadge(report.complexity)}
        </div>
        
        <div className="n8n-report-stats">
          {report.recordCount !== undefined && (
            <span className="n8n-stat">
              {report.recordCount.toLocaleString()} records
            </span>
          )}
          {report.downloadCount !== undefined && (
            <span className="n8n-stat">
              {report.downloadCount} downloads
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const ReportListItem: React.FC<{ report: Report }> = ({ report }) => (
    <div className="n8n-report-list-item">
      <div className="n8n-report-list-main">
        <div className="n8n-report-list-info">
          <DocumentTable20Regular className="n8n-report-icon" />
          <div className="n8n-report-list-details">
            <h4>{report.name}</h4>
            <p>{report.description}</p>
          </div>
        </div>
        
        <div className="n8n-report-list-meta">
          <div className="n8n-report-list-stats">
            <span>{report.category}</span>
            <span>{formatDate(report.lastModified)}</span>
            <span>{report.createdBy}</span>
            <span>{report.recordCount?.toLocaleString() || 0} records</span>
          </div>
          
          <div className="n8n-report-list-badges">
            {getStatusBadge(report.status)}
            {getComplexityBadge(report.complexity)}
          </div>
        </div>
      </div>
      
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button 
            appearance="subtle" 
            icon={<MoreVertical20Regular />}
            size="small"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<Edit20Regular />} onClick={() => handleEditReport(report.id)}>
              Edit Report
            </MenuItem>
            <MenuItem icon={<Copy20Regular />} onClick={() => handleDuplicateReport(report.id)}>
              Duplicate
            </MenuItem>
            <MenuItem icon={<ArrowDownload20Regular />}>
              Export
            </MenuItem>
            <MenuItem icon={<Delete20Regular />} onClick={() => handleDeleteReport(report.id)}>
              Delete
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );

  return (
    <div className="n8n-reports-page">
      {/* Header */}
      <div className="n8n-reports-header">
        <div className="n8n-reports-title">
          <DocumentTable20Regular className="n8n-page-icon" />
          <div>
            <h1>Reports</h1>
            <p>Manage and create Excel reports using visual workflow builder</p>
          </div>
        </div>
        
        <Button 
          appearance="primary" 
          icon={<Add20Regular />}
          onClick={handleCreateNewReport}
        >
          Create New Report
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="n8n-reports-controls">
        <div className="n8n-reports-filters">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            contentBefore={<Search20Regular />}
            className="n8n-search-input"
          />
          
          <Dropdown
            placeholder="Category"
            value={selectedCategory}
            onOptionSelect={(_, data) => setSelectedCategory(data.optionText || 'All Categories')}
          >
            {REPORT_CATEGORIES.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Dropdown>
          
          <Dropdown
            placeholder="Status"
            value={REPORT_STATUSES.find(s => s.key === selectedStatus)?.label || 'All Status'}
            onOptionSelect={(_, data) => {
              const status = REPORT_STATUSES.find(s => s.label === data.optionText);
              setSelectedStatus(status?.key || 'all');
            }}
          >
            {REPORT_STATUSES.map(status => (
              <Option key={status.key} value={status.label}>
                {status.label}
              </Option>
            ))}
          </Dropdown>
        </div>

        <div className="n8n-reports-view-controls">
          <div className="n8n-view-toggle">
            <Button
              appearance={viewMode === 'grid' ? 'primary' : 'subtle'}
              icon={<Grid20Regular />}
              onClick={() => setViewMode('grid')}
              size="small"
            />
            <Button
              appearance={viewMode === 'list' ? 'primary' : 'subtle'}
              icon={<List20Regular />}
              onClick={() => setViewMode('list')}
              size="small"
            />
          </div>
          
          <Dropdown
            value={`${sortField} (${sortOrder})`}
            onOptionSelect={(_, data) => {
              const [field, order] = data.optionValue?.toString().split('|') || [];
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
          >
            <Option value="lastModified|desc">Last Modified (Newest)</Option>
            <Option value="lastModified|asc">Last Modified (Oldest)</Option>
            <Option value="name|asc">Name (A-Z)</Option>
            <Option value="name|desc">Name (Z-A)</Option>
            <Option value="downloadCount|desc">Most Downloaded</Option>
            <Option value="recordCount|desc">Most Records</Option>
          </Dropdown>
        </div>
      </div>

      {/* Results Summary */}
      <div className="n8n-reports-summary">
        <span>{filteredReports.length} reports found</span>
        {searchQuery && (
          <span>for "{searchQuery}"</span>
        )}
        {selectedCategory !== 'All Categories' && (
          <Badge appearance="outline" size="small">
            {selectedCategory}
          </Badge>
        )}
        {selectedStatus !== 'all' && (
          <Badge appearance="outline" size="small">
            {REPORT_STATUSES.find(s => s.key === selectedStatus)?.label}
          </Badge>
        )}
      </div>

      {/* Reports Content */}
      <div className={`n8n-reports-content ${viewMode}`}>
        {filteredReports.length === 0 ? (
          <div className="n8n-empty-state">
            <DocumentTable20Regular style={{ fontSize: '64px', opacity: 0.3 }} />
            <h3>No reports found</h3>
            <p>Try adjusting your search criteria or create a new report.</p>
            <Button 
              appearance="primary" 
              icon={<Add20Regular />}
              onClick={handleCreateNewReport}
            >
              Create Your First Report
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="n8n-reports-grid">
                {filteredReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="n8n-reports-list">
                {filteredReports.map(report => (
                  <ReportListItem key={report.id} report={report} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};