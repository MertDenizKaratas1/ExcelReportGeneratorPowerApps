import React from 'react';
import { Node } from 'reactflow';
import {
  Text,
  Field,
  Input,
  Dropdown,
  Option,
  Textarea,
  SpinButton,
  RadioGroup,
  Radio,
  Switch,
  Button,
} from '@fluentui/react-components';
import { DUMMY_METADATA } from '../../data/dummyData';
import { FlowNodeData } from '../../types/flowTypes';

interface PropertiesPanelProps {
  node: Node;
  onUpdate: (nodeId: string, data: Partial<FlowNodeData>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ node, onUpdate }) => {
  const handleUpdate = (updates: Partial<FlowNodeData>) => {
    onUpdate(node.id, updates);
  };

  const renderEntityProperties = () => {
    const selectedEntity = node.data.entity ? DUMMY_METADATA.entities.find((e: any) => e.logicalName === node.data.entity) : null;
    const entityGraph = selectedEntity ? DUMMY_METADATA.graphs[selectedEntity.logicalName] : null;

    // Debug logging
    console.log('DUMMY_METADATA.entities:', DUMMY_METADATA.entities);
    console.log('Number of entities:', DUMMY_METADATA.entities.length);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="Entity" required>
          <Dropdown
            placeholder="Select entity"
            value={node.data.entity || ''}
            onOptionSelect={(_, data) => {
              const entityName = data.optionValue as string;
              console.log('Selected entity:', entityName);
              handleUpdate({ 
                entity: entityName,
                attributes: [] // Reset attributes when entity changes
              });
            }}
          >
            {DUMMY_METADATA.entities.map((entity: any) => (
              <Option key={entity.logicalName} value={entity.logicalName} text={`${entity.displayName} (${entity.logicalName})`}>
                {entity.displayName} ({entity.logicalName})
              </Option>
            ))}
          </Dropdown>
        </Field>

        {selectedEntity && entityGraph && (
          <>
            <Field label="Available Attributes">
              <div style={{ 
                maxHeight: '150px', 
                overflowY: 'auto', 
                border: '1px solid #e0e0e0', 
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: '#fafafa'
              }}>
                {entityGraph.attributes.map(attr => (
                  <div key={attr.logicalName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <input
                      type="checkbox"
                      id={`attr-${attr.logicalName}`}
                      checked={node.data.attributes?.includes(attr.logicalName) || false}
                      onChange={(e) => {
                        const currentAttrs = node.data.attributes || [];
                        const newAttrs = e.target.checked
                          ? [...currentAttrs, attr.logicalName]
                          : currentAttrs.filter((a: string) => a !== attr.logicalName);
                        handleUpdate({ attributes: newAttrs });
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    <label htmlFor={`attr-${attr.logicalName}`} style={{ 
                      fontSize: '12px', 
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      <strong>{attr.displayName}</strong> ({attr.logicalName})
                      <br />
                      <span style={{ color: '#666', fontSize: '11px' }}>
                        Type: {attr.type}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </Field>

            <Field label="Selected Columns">
              <Textarea
                placeholder="Selected attributes will appear here..."
                value={node.data.attributes?.join(', ') || ''}
                readOnly
                rows={3}
              />
            </Field>

            <Field label="Order By">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(node.data.orderBy || []).map((order: any, index: number) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Dropdown
                      placeholder="Select attribute"
                      value={order.attribute || ''}
                      onOptionSelect={(_, data) => {
                        const newOrderBy = [...(node.data.orderBy || [])];
                        newOrderBy[index] = { ...newOrderBy[index], attribute: data.optionValue as string };
                        handleUpdate({ orderBy: newOrderBy });
                      }}
                      style={{ flex: 1 }}
                    >
                      {entityGraph.attributes.map(attr => (
                        <Option key={attr.logicalName} value={attr.logicalName} text={attr.displayName}>
                          {attr.displayName}
                        </Option>
                      ))}
                    </Dropdown>
                    <Dropdown
                      value={order.desc ? 'desc' : 'asc'}
                      onOptionSelect={(_, data) => {
                        const newOrderBy = [...(node.data.orderBy || [])];
                        newOrderBy[index] = { ...newOrderBy[index], desc: data.optionValue === 'desc' };
                        handleUpdate({ orderBy: newOrderBy });
                      }}
                      style={{ width: '80px' }}
                    >
                      <Option value="asc" text="ASC">ASC</Option>
                      <Option value="desc" text="DESC">DESC</Option>
                    </Dropdown>
                    <Button
                      appearance="subtle"
                      onClick={() => {
                        const newOrderBy = [...(node.data.orderBy || [])];
                        newOrderBy.splice(index, 1);
                        handleUpdate({ orderBy: newOrderBy });
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  appearance="outline"
                  onClick={() => {
                    const newOrderBy = [...(node.data.orderBy || []), { attribute: '', desc: false }];
                    handleUpdate({ orderBy: newOrderBy });
                  }}
                >
                  Add Order By
                </Button>
              </div>
            </Field>
          </>
        )}

        <Field label="Row Cap for Preview">
          <SpinButton
            value={node.data.rowCap || 100}
            onChange={(_, data) => handleUpdate({ rowCap: data.value || undefined })}
            min={1}
            max={10000}
          />
        </Field>

        <Field label="Timezone">
          <RadioGroup
            value={node.data.timezone || 'user'}
            onChange={(_, data) => handleUpdate({ timezone: data.value as 'user' | 'utc' })}
          >
            <Radio value="user" label="User Local Time" />
            <Radio value="utc" label="UTC" />
          </RadioGroup>
        </Field>
      </div>
    );
  };

  const renderFilterProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text style={{ fontWeight: 600 }}>Filter Conditions</Text>
      <Text style={{ fontSize: '12px', color: '#666' }}>
        Configure AND/OR conditions to filter your data
      </Text>
      
      {/* Simplified filter UI for demo */}
      <Field label="Attribute">
        <Input
          placeholder="e.g., statecode"
          value={node.data.conditions?.[0]?.attribute || ''}
          onChange={(_, data) => {
            const conditions = node.data.conditions || [{ attribute: '', operator: 'eq', value: '' }];
            conditions[0] = { ...conditions[0], attribute: data.value };
            handleUpdate({ conditions });
          }}
        />
      </Field>

      <Field label="Operator">
        <Dropdown
          placeholder="Select operator"
          value={node.data.conditions?.[0]?.operator || 'eq'}
          onOptionSelect={(_, data) => {
            const conditions = node.data.conditions || [{ attribute: '', operator: 'eq', value: '' }];
            conditions[0] = { ...conditions[0], operator: data.optionValue as any };
            handleUpdate({ conditions });
          }}
        >
          <Option value="eq">Equals</Option>
          <Option value="ne">Not Equals</Option>
          <Option value="gt">Greater Than</Option>
          <Option value="ge">Greater Than or Equal</Option>
          <Option value="lt">Less Than</Option>
          <Option value="le">Less Than or Equal</Option>
          <Option value="like">Like</Option>
        </Dropdown>
      </Field>

      <Field label="Value">
        <Input
          placeholder="Enter value"
          value={node.data.conditions?.[0]?.value || ''}
          onChange={(_, data) => {
            const conditions = node.data.conditions || [{ attribute: '', operator: 'eq', value: '' }];
            conditions[0] = { ...conditions[0], value: data.value };
            handleUpdate({ conditions });
          }}
        />
      </Field>
    </div>
  );

  const renderJoinProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Field label="Relationship">
        <Dropdown
          placeholder="Select relationship"
          value={node.data.relation?.schemaName || ''}
          onOptionSelect={(_, data) => {
            // Find the relationship details
            const schemaName = data.optionValue as string;
            if (schemaName) {
              const employeeGraph = DUMMY_METADATA.graphs.employee;
              const oneToMany = employeeGraph.relationships.oneToMany.find(r => r.schemaName === schemaName);
              
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
        >
          {DUMMY_METADATA.graphs.employee?.relationships.oneToMany.map(rel => (
            <Option key={rel.schemaName} value={rel.schemaName}>
              {rel.displayName}
            </Option>
          ))}
        </Dropdown>
      </Field>

      <Field label="Alias">
        <Input
          placeholder="Optional alias"
          value={node.data.alias || ''}
          onChange={(_, data) => handleUpdate({ alias: data.value })}
        />
      </Field>

      <Field label="Join Type">
        <RadioGroup
          value={node.data.joinType || 'inner'}
          onChange={(_, data) => handleUpdate({ joinType: data.value as 'inner' | 'outer' })}
        >
          <Radio value="inner" label="Inner Join" />
          <Radio value="outer" label="Outer Join" />
        </RadioGroup>
      </Field>

      <Field label="Child Fields">
        <Textarea
          placeholder="Enter child fields (comma-separated)"
          value={node.data.childFields?.join(', ') || ''}
          onChange={(_, data) => 
            handleUpdate({ 
              childFields: data.value.split(',').map(s => s.trim()).filter(s => s)
            })
          }
        />
      </Field>

      <Field label="Many-Handling Policy">
        <RadioGroup
          value={node.data.policy?.kind || 'expand'}
          onChange={(_, data) => {
            const kind = data.value as 'expand' | 'summarize' | 'concat' | 'childSheet';
            handleUpdate({ 
              policy: { ...node.data.policy, kind }
            });
          }}
        >
          <Radio value="expand" label="Expand rows (default)" />
          <Radio value="summarize" label="Summarize" />
          <Radio value="concat" label="Concatenate" />
          <Radio value="childSheet" label="Child sheet" />
        </RadioGroup>
      </Field>
    </div>
  );

  const renderTransformProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text style={{ fontWeight: 600 }}>Transform Expressions</Text>
      <Text style={{ fontSize: '12px', color: '#666' }}>
        Define computed columns using expressions
      </Text>
      
      <Field label="Expression Alias">
        <Input
          placeholder="e.g., FullName"
          value={node.data.expressions?.[0]?.alias || ''}
          onChange={(_, data) => {
            const expressions = node.data.expressions || [{ alias: '', expression: '' }];
            expressions[0] = { ...expressions[0], alias: data.value };
            handleUpdate({ expressions });
          }}
        />
      </Field>

      <Field label="Expression">
        <Textarea
          placeholder="e.g., FirstName + ' ' + LastName"
          value={node.data.expressions?.[0]?.expression || ''}
          onChange={(_, data) => {
            const expressions = node.data.expressions || [{ alias: '', expression: '' }];
            expressions[0] = { ...expressions[0], expression: data.value };
            handleUpdate({ expressions });
          }}
        />
      </Field>
    </div>
  );

  const renderAggregateProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Field label="Group By">
        <Textarea
          placeholder="Enter group by fields (comma-separated)"
          value={node.data.groupBy?.join(', ') || ''}
          onChange={(_, data) => 
            handleUpdate({ 
              groupBy: data.value.split(',').map(s => s.trim()).filter(s => s)
            })
          }
        />
      </Field>

      <Field label="Measure Function">
        <Dropdown
          placeholder="Select function"
          value={node.data.measures?.[0]?.func || 'count'}
          onOptionSelect={(_, data) => {
            const measures = node.data.measures || [{ func: 'count', alias: 'Count' }];
            measures[0] = { ...measures[0], func: data.optionValue };
            handleUpdate({ measures });
          }}
        >
          <Option value="count">COUNT</Option>
          <Option value="sum">SUM</Option>
          <Option value="avg">AVG</Option>
          <Option value="min">MIN</Option>
          <Option value="max">MAX</Option>
        </Dropdown>
      </Field>

      <Field label="Measure Alias">
        <Input
          placeholder="e.g., TotalCount"
          value={node.data.measures?.[0]?.alias || ''}
          onChange={(_, data) => {
            const measures = node.data.measures || [{ func: 'count', alias: '' }];
            measures[0] = { ...measures[0], alias: data.value };
            handleUpdate({ measures });
          }}
        />
      </Field>
    </div>
  );

  const renderSheetProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Field label="Sheet Name">
        <Input
          placeholder="e.g., Employees"
          value={node.data.name || ''}
          onChange={(_, data) => handleUpdate({ name: data.value })}
        />
      </Field>

      <Field label="Mode">
        <RadioGroup
          value={node.data.mode || 'main'}
          onChange={(_, data) => handleUpdate({ mode: data.value as 'main' | 'child' })}
        >
          <Radio value="main" label="Main Sheet" />
          <Radio value="child" label="Child Sheet" />
        </RadioGroup>
      </Field>

      <Field label="Freeze First Row">
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
      </Field>

      <Field label="Zebra Rows">
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
      </Field>
    </div>
  );

  const renderExportProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Field label="Format">
        <RadioGroup
          value={node.data.format || 'xlsx'}
          onChange={(_, data) => handleUpdate({ format: data.value as 'xlsx' | 'csv' })}
        >
          <Radio value="xlsx" label="Excel (.xlsx)" />
          <Radio value="csv" label="CSV" />
        </RadioGroup>
      </Field>

      <Field label="Layout">
        <RadioGroup
          value={node.data.layout || 'singleSheet'}
          onChange={(_, data) => handleUpdate({ layout: data.value as 'singleSheet' | 'multiSheet' })}
        >
          <Radio value="singleSheet" label="Single Sheet" />
          <Radio value="multiSheet" label="Multi Sheet" />
        </RadioGroup>
      </Field>

      <Field label="File Name Template">
        <Input
          placeholder="e.g., Employees_{yyyyMMdd}.xlsx"
          value={node.data.fileName || ''}
          onChange={(_, data) => handleUpdate({ fileName: data.value })}
        />
      </Field>
    </div>
  );

  const renderProperties = () => {
    switch (node.data.type) {
      case 'entity':
        return renderEntityProperties();
      case 'filter':
        return renderFilterProperties();
      case 'join':
        return renderJoinProperties();
      case 'transform':
        return renderTransformProperties();
      case 'aggregate':
        return renderAggregateProperties();
      case 'sheet':
        return renderSheetProperties();
      case 'export':
        return renderExportProperties();
      default:
        return (
          <Text style={{ color: '#666', fontStyle: 'italic' }}>
            Properties for {node.data.type || node.type} node coming soon...
          </Text>
        );
    }
  };

  return (
    <div style={{
      width: '320px',
      borderLeft: '1px solid #e0e0e0',
      backgroundColor: '#fafafa',
      padding: '16px',
      overflowY: 'auto',
      height: '100%',
    }}>
      <Text as="h2" style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
        Properties
      </Text>
      <Text style={{ marginBottom: '16px', fontSize: '12px', color: '#666' }}>
        Node: {node.id} ({node.data.type || node.type})
      </Text>
      
      {renderProperties()}
    </div>
  );
};