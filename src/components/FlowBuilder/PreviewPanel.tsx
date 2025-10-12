import React, { useState } from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  TableColumnDefinition,
  TableCellLayout,
  Button,
  Text,
  Badge,
  TabList,
  Tab,
  SelectTabEvent,
  SelectTabData,
} from '@fluentui/react-components';
import {
  ArrowClockwise20Regular,
  Warning20Regular,
} from '@fluentui/react-icons';
import { PreviewData } from '../../types/flowTypes';

interface PreviewPanelProps {
  data: PreviewData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ data }) => {
  const [selectedTab, setSelectedTab] = useState<string>('preview');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string);
  };

  const handleRefresh = () => {
    // Trigger preview refresh
    console.log('Refreshing preview...');
  };

  // Create columns from data
  const columns: TableColumnDefinition<any>[] = data.columns.map((column, index) => 
    createTableColumn<any>({
      columnId: `col${index}`,
      compare: (a, b) => {
        return 0; // Simple comparison for demo
      },
      renderHeaderCell: () => {
        return column;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            {item.row[index] || ''}
          </TableCellLayout>
        );
      },
    })
  );

  // Convert rows to items for DataGrid
  const items = data.rows.map((row, index) => ({
    id: index.toString(),
    row,
  }));

  const renderMainPreview = () => (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {data.columns.length > 0 ? (
        <DataGrid
          items={items}
          columns={columns}
          sortable
          getRowId={(item) => item.id}
          style={{ minHeight: '200px' }}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<any>>
            {({ item, rowId }) => (
              <DataGridRow<any> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      ) : (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '200px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click Preview to generate preview data
        </div>
      )}
    </div>
  );

  const renderChildSheet = (sheetName: string) => {
    const sheetData = data.sheets?.[sheetName];
    if (!sheetData) return null;

    const sheetColumns = sheetData.columns.map((column, index) => 
      createTableColumn<any>({
        columnId: `sheet-col${index}`,
        compare: (a, b) => 0,
        renderHeaderCell: () => column,
        renderCell: (item) => (
          <TableCellLayout>
            {item.row[index] || ''}
          </TableCellLayout>
        ),
      })
    );

    const sheetItems = sheetData.rows.map((row, index) => ({
      id: `sheet-${index}`,
      row,
    }));

    return (
      <div style={{ flex: 1, overflow: 'auto' }}>
        <DataGrid
          items={sheetItems}
          columns={sheetColumns}
          sortable
          getRowId={(item) => item.id}
          style={{ minHeight: '200px' }}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<any>>
            {({ item, rowId }) => (
              <DataGridRow<any> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    );
  };

  const tabs = ['preview'];
  if (data.sheets) {
    tabs.push(...Object.keys(data.sheets));
  }

  return (
    <div style={{
      height: '300px',
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} size="small">
            <Tab value="preview">Preview</Tab>
            {data.sheets && Object.keys(data.sheets).map(sheetName => (
              <Tab key={sheetName} value={sheetName}>
                {sheetName}
              </Tab>
            ))}
          </TabList>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {data.warnings && data.warnings.length > 0 && (
            <Badge
              icon={<Warning20Regular />}
              color="important"
              size="small"
            >
              {data.warnings.length} warning{data.warnings.length !== 1 ? 's' : ''}
            </Badge>
          )}
          
          <Text style={{ fontSize: '12px', color: '#666' }}>
            Rows: {data.rows.length}
          </Text>
          
          <Button
            appearance="subtle"
            icon={<ArrowClockwise20Regular />}
            size="small"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'preview' && renderMainPreview()}
      {selectedTab !== 'preview' && data.sheets && renderChildSheet(selectedTab)}

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#fff4e6',
          borderTop: '1px solid #ffd93d',
          fontSize: '12px',
        }}>
          <Text style={{ fontWeight: 600, color: '#8a6914' }}>
            Warnings:
          </Text>
          <ul style={{ margin: '4px 0 0 16px', color: '#8a6914' }}>
            {data.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};