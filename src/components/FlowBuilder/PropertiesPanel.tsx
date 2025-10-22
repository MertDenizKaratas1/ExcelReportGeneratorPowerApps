import React from 'react';
import { Node } from 'reactflow';
import {
  Input,
  Label,
  Dropdown,
  Option,
  Button,
  Checkbox,
  Badge,
  Switch,
  SpinButton,
  RadioGroup,
  Radio,
} from '@fluentui/react-components';
import {
  Add20Regular,
  Dismiss20Regular,
  Database20Regular,
  Filter20Regular,
  Calculator20Regular,
  Settings20Regular,
  Branch20Regular,
  DocumentTable20Regular,
  DocumentArrowDown20Regular,
} from '@fluentui/react-icons';
import { DUMMY_METADATA } from '../../data/dummyData';
import { FlowNodeData } from '../../types/flowTypes';
import { EntitySummary } from '../../services/metadataService';
import { useLoading } from '../../contexts/LoadingContext';

interface PropertiesPanelProps {
  node: Node | null;
  onUpdate: (nodeId: string, data: Partial<FlowNodeData>) => void;
  availableEntities?: EntitySummary[];
  isLoadingEntities?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  node, 
  onUpdate, 
  availableEntities = [], 
  isLoadingEntities = false 
}) => {
  const { showLoading, hideLoading } = useLoading();

  // Helper function to delay execution
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (!node) {
    return (
      <div className="n8n-properties-panel n8n-panel">
        <div className="n8n-panel-header">
          <div className="n8n-panel-header-icon">
            <Settings20Regular />
          </div>
          <h3 className="n8n-panel-title">Properties</h3>
        </div>
        <div className="n8n-panel-content" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: 'var(--color-text-muted)',
        }}>
          <Settings20Regular style={{ fontSize: '32px', marginBottom: '12px' }} />
          <p>Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<FlowNodeData>) => {
    onUpdate(node.id, updates);
  };

  const handleEntitySelection = async (entityName: string) => {
    showLoading('Loading entity...', 'entity');
    await delay(2000);
    handleUpdate({
      entity: entityName,
      attributes: []
    });
    hideLoading();
  };

  const getNodeIcon = () => {
    switch (node.data.type) {
      case 'entity': return <Database20Regular />;
      case 'filter': return <Filter20Regular />;
      case 'join': return <Branch20Regular />;
      case 'transform': 
      case 'aggregate': return <Calculator20Regular />;
      case 'sheet': return <DocumentTable20Regular />;
      case 'export': return <DocumentArrowDown20Regular />;
      default: return <Settings20Regular />;
    }
  };

  const renderEntityProperties = () => {
    const selectedEntity = node.data.entity ? DUMMY_METADATA.entities.find((e: any) => e.logicalName === node.data.entity) : null;
    const entityGraph = selectedEntity ? DUMMY_METADATA.graphs[selectedEntity.logicalName] : null;

    // Use real entities if available, fallback to dummy data
    const entitiesToShow = availableEntities.length > 0 ? availableEntities : DUMMY_METADATA.entities;

    return (
      <>
        <div className="n8n-form-section">
          <Label className="n8n-form-label">Entity Selection</Label>
          <Dropdown
            placeholder={isLoadingEntities ? "Loading entities..." : "Select entity"}
            value={node.data.entity || ''}
            disabled={isLoadingEntities}
            onOptionSelect={(_, data) => {
              const entityName = data.optionValue as string;
              handleEntitySelection(entityName);
            }}
            className="n8n-form-control"
          >
            {entitiesToShow.map((entity: any) => (
              <Option 
                key={entity.logicalName} 
                value={entity.logicalName} 
                text={`${entity.displayName} (${entity.logicalName})`}
              >
                {entity.displayName} ({entity.logicalName})
                {entity.isCustom && <Badge size="small" color="brand" style={{ marginLeft: '8px' }}>Custom</Badge>}
              </Option>
            ))}
          </Dropdown>
          {availableEntities.length > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--colorNeutralForeground2)', marginTop: '4px' }}>
              {availableEntities.length} entities loaded from Power Apps
            </div>
          )}
        </div>

        {selectedEntity && entityGraph && (
          <>
            <div className="n8n-form-section">
              <Label className="n8n-form-label">
                Attributes
                <Badge size="small" color="informative">
                  {node.data.attributes?.length || 0} selected
                </Badge>
              </Label>
              <div className="n8n-checkbox-group">
                {entityGraph.attributes.map((attr: any) => (
                  <div key={attr.logicalName} className="n8n-checkbox-item">
                    <Checkbox
                      checked={node.data.attributes?.includes(attr.logicalName) || false}
                      onChange={(_, data) => {
                        const currentAttrs = node.data.attributes || [];
                        const newAttrs = data.checked
                          ? [...currentAttrs, attr.logicalName]
                          : currentAttrs.filter((a: string) => a !== attr.logicalName);
                        handleUpdate({ attributes: newAttrs });
                      }}
                      className="n8n-checkbox"
                    />
                    <div className="n8n-checkbox-label">
                      <div className="n8n-checkbox-title">{attr.displayName}</div>
                      <div className="n8n-checkbox-subtitle">({attr.logicalName}) • {attr.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="n8n-form-section">
              <Label className="n8n-form-label">Row Limit (Preview)</Label>
              <SpinButton
                value={node.data.rowCap || 100}
                onChange={(_, data) => handleUpdate({ rowCap: data.value || undefined })}
                min={1}
                max={10000}
                className="n8n-form-control"
              />
            </div>
          </>
        )}
      </>
    );
  };

  const renderFilterProperties = () => (
    <div className="n8n-form-section">
      <div className="n8n-form-section-header">
        <Label className="n8n-form-label">Filter Conditions</Label>
        <Button
          size="small"
          appearance="subtle"
          icon={<Add20Regular />}
          onClick={() => {
            const newCondition = { attribute: '', operator: 'eq', value: '' };
            const conditions = [...(node.data.conditions || []), newCondition];
            handleUpdate({ conditions });
          }}
          className="n8n-button-icon"
        >
          Add
        </Button>
      </div>
      
      <div className="n8n-conditions-list">
        {(node.data.conditions || []).map((condition: any, index: number) => (
          <div key={index} className="n8n-condition-row">
            <div className="n8n-condition-fields">
              <Input
                placeholder="Attribute"
                value={condition.attribute}
                onChange={(_, data) => {
                  const conditions = [...(node.data.conditions || [])];
                  conditions[index] = { ...condition, attribute: data.value };
                  handleUpdate({ conditions });
                }}
                className="n8n-form-control-small"
              />
              
              <Dropdown
                value={condition.operator || 'eq'}
                onOptionSelect={(_, data) => {
                  const conditions = [...(node.data.conditions || [])];
                  conditions[index] = { ...condition, operator: data.optionValue };
                  handleUpdate({ conditions });
                }}
                className="n8n-form-control-small"
              >
                <Option value="eq">Equals</Option>
                <Option value="ne">Not Equals</Option>
                <Option value="gt">Greater Than</Option>
                <Option value="lt">Less Than</Option>
                <Option value="like">Contains</Option>
              </Dropdown>
              
              <Input
                value={condition.value}
                onChange={(_, data) => {
                  const conditions = [...(node.data.conditions || [])];
                  conditions[index] = { ...condition, value: data.value };
                  handleUpdate({ conditions });
                }}
                placeholder="Value"
                className="n8n-form-control-small"
              />
            </div>
            
            <Button
              size="small"
              appearance="subtle"
              icon={<Dismiss20Regular />}
              onClick={() => {
                const conditions = (node.data.conditions || []).filter((_: any, i: number) => i !== index);
                handleUpdate({ conditions });
              }}
              className="n8n-button-icon n8n-button-danger"
            />
          </div>
        ))}
      </div>
      
      {(!node.data.conditions || node.data.conditions.length === 0) && (
        <div className="n8n-empty-state">
          <p>No filter conditions defined</p>
          <p className="n8n-text-muted">Click "Add" to create your first condition</p>
        </div>
      )}
    </div>
  );

  const renderJoinProperties = () => (
    <>
      <div className="n8n-form-section">
        <Label className="n8n-form-label">Relationship</Label>
        <Dropdown
          placeholder="Select relationship"
          value={node.data.relation?.schemaName || ''}
          onOptionSelect={(_, data) => {
            const schemaName = data.optionValue as string;
            if (schemaName) {
              const employeeGraph = DUMMY_METADATA.graphs.employee;
              const oneToMany = employeeGraph.relationships.oneToMany.find((r: any) => r.schemaName === schemaName);
              
              if (oneToMany) {
                handleUpdate({
                  relation: {
                    kind: 'oneToMany',
                    schemaName,
                    from: oneToMany.referencedAttribute,
                    to: oneToMany.referencingAttribute,
                    target: oneToMany.referencedEntity,
                  }
                });
              }
            }
          }}
          className="n8n-form-control"
        >
          {DUMMY_METADATA.graphs.employee?.relationships.oneToMany.map((rel: any) => (
            <Option key={rel.schemaName} value={rel.schemaName}>
              {rel.displayName}
            </Option>
          ))}
        </Dropdown>
      </div>

      <div className="n8n-form-section">
        <Label className="n8n-form-label">Join Type</Label>
        <RadioGroup
          value={node.data.joinType || 'inner'}
          onChange={(_, data) => handleUpdate({ joinType: data.value as 'inner' | 'outer' })}
          className="n8n-radio-group"
        >
          <Radio value="inner" label="Inner Join" />
          <Radio value="outer" label="Outer Join" />
        </RadioGroup>
      </div>
    </>
  );

  const renderSheetProperties = () => (
    <>
      <div className="n8n-form-section">
        <Label className="n8n-form-label">Sheet Name</Label>
        <Input
          value={node.data.name || ''}
          onChange={(_, data) => handleUpdate({ name: data.value })}
          placeholder="Enter sheet name..."
          className="n8n-form-control"
        />
      </div>

      <div className="n8n-form-section">
        <Label className="n8n-form-label">Options</Label>
        <div className="n8n-switch-group">
          <div className="n8n-switch-item">
            <Switch
              checked={node.data.freeze?.firstRow || false}
              onChange={(_, data) => 
                handleUpdate({ 
                  freeze: { 
                    ...node.data.freeze, 
                    firstRow: data.checked 
                  }
                })
              }
            />
            <span>Freeze first row</span>
          </div>
          <div className="n8n-switch-item">
            <Switch
              checked={node.data.styles?.zebraRows || false}
              onChange={(_, data) => 
                handleUpdate({ 
                  styles: { 
                    ...node.data.styles, 
                    zebraRows: data.checked 
                  }
                })
              }
            />
            <span>Zebra rows</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderExportProperties = () => (
    <>
      <div className="n8n-form-section">
        <Label className="n8n-form-label">Export Format</Label>
        <RadioGroup
          value={node.data.format || 'xlsx'}
          onChange={(_, data) => handleUpdate({ format: data.value as 'xlsx' | 'csv' })}
          className="n8n-radio-group"
        >
          <Radio value="xlsx" label="Excel (.xlsx)" />
          <Radio value="csv" label="CSV (.csv)" />
        </RadioGroup>
      </div>

      <div className="n8n-form-section">
        <Label className="n8n-form-label">File Name Template</Label>
        <Input
          placeholder="e.g., Report_{yyyyMMdd}.xlsx"
          value={node.data.fileName || ''}
          onChange={(_, data) => handleUpdate({ fileName: data.value })}
          className="n8n-form-control"
        />
      </div>
    </>
  );

  const renderPropertiesContent = () => {
    switch (node.data.type) {
      case 'entity':
        return renderEntityProperties();
      case 'filter':
        return renderFilterProperties();
      case 'join':
        return renderJoinProperties();
      case 'sheet':
        return renderSheetProperties();
      case 'export':
        return renderExportProperties();
      default:
        return (
          <div className="n8n-empty-state">
            <p>Properties for {node.data.type} nodes coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="n8n-properties-panel n8n-panel">
      <div className="n8n-panel-header">
        <div className="n8n-panel-header-icon">
          {getNodeIcon()}
        </div>
        <div className="n8n-panel-header-content">
          <h3 className="n8n-panel-title">
            {node.data.type || 'Node'} Properties
          </h3>
          <p className="n8n-panel-subtitle">{node.id}</p>
        </div>
      </div>
      
      <div className="n8n-panel-content">
        {renderPropertiesContent()}
      </div>
    </div>
  );
};