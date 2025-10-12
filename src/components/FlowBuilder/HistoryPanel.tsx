import React from 'react';
import {
  Button,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  TableCellLayout,
  Badge,
  Text,
} from '@fluentui/react-components';
import {
  Dismiss20Regular,
  Clock20Regular,
} from '@fluentui/react-icons';
import { DUMMY_HISTORY } from '../../data/dummyData';
import { HistoryEntry } from '../../types/flowTypes';

interface HistoryPanelProps {
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: HistoryEntry['status']) => {
    const props = {
      running: { color: 'brand' as const, text: 'Running' },
      completed: { color: 'success' as const, text: 'Completed' },
      failed: { color: 'danger' as const, text: 'Failed' },
    };
    
    const config = props[status];
    return (
      <Badge color={config.color} size="small">
        {config.text}
      </Badge>
    );
  };

  const columns = [
    createTableColumn<HistoryEntry>({
      columnId: 'runId',
      compare: (a, b) => a.runId.localeCompare(b.runId),
      renderHeaderCell: () => 'Run ID',
      renderCell: (item) => (
        <TableCellLayout>
          <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            {item.runId}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<HistoryEntry>({
      columnId: 'reportName',
      compare: (a, b) => a.reportName.localeCompare(b.reportName),
      renderHeaderCell: () => 'Report Name',
      renderCell: (item) => (
        <TableCellLayout>
          {item.reportName}
        </TableCellLayout>
      ),
    }),
    createTableColumn<HistoryEntry>({
      columnId: 'started',
      compare: (a, b) => new Date(a.started).getTime() - new Date(b.started).getTime(),
      renderHeaderCell: () => 'Started',
      renderCell: (item) => (
        <TableCellLayout media={<Clock20Regular />}>
          <Text style={{ fontSize: '12px' }}>
            {formatDate(item.started)}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<HistoryEntry>({
      columnId: 'ended',
      compare: (a, b) => {
        if (!a.ended && !b.ended) return 0;
        if (!a.ended) return 1;
        if (!b.ended) return -1;
        return new Date(a.ended).getTime() - new Date(b.ended).getTime();
      },
      renderHeaderCell: () => 'Ended',
      renderCell: (item) => (
        <TableCellLayout>
          <Text style={{ fontSize: '12px' }}>
            {item.ended ? formatDate(item.ended) : '-'}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<HistoryEntry>({
      columnId: 'rows',
      compare: (a, b) => a.rows - b.rows,
      renderHeaderCell: () => 'Rows',
      renderCell: (item) => (
        <TableCellLayout>
          <Text style={{ fontSize: '12px', textAlign: 'right' }}>
            {item.rows.toLocaleString()}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<HistoryEntry>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (item) => (
        <TableCellLayout>
          {getStatusBadge(item.status)}
        </TableCellLayout>
      ),
    }),
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e0e0e0',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Run History
        </Text>
        <Button
          appearance="subtle"
          icon={<Dismiss20Regular />}
          onClick={onClose}
        />
      </div>
      
      <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
        <Text style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
          Last 10 report generation runs
        </Text>
        
        <DataGrid
          items={DUMMY_HISTORY}
          columns={columns}
          sortable
          getRowId={(item) => item.runId}
          style={{ height: 'calc(100% - 60px)' }}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<HistoryEntry>>
            {({ item, rowId }) => (
              <DataGridRow<HistoryEntry> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    </div>
  );
};