import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Database20Regular,
  Filter20Regular,
  Branch20Regular,
  Calculator20Regular,
  ChartMultiple20Regular,
  TextBulletListSquare20Regular,
  DocumentTable20Regular,
  Pivot20Regular,
  DocumentArrowDown20Regular,
  Settings20Regular,
  Delete20Regular,
  CheckmarkCircle20Filled,
  ErrorCircle20Filled,
  Warning20Filled,
} from '@fluentui/react-icons';
import { NODE_TEMPLATES } from '../../data/dummyData';

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'entity': return <Database20Regular />;
    case 'filter': return <Filter20Regular />;
    case 'join': return <Branch20Regular />;
    case 'transform': return <Calculator20Regular />;
    case 'aggregate': return <ChartMultiple20Regular />;
    case 'concatenate': return <TextBulletListSquare20Regular />;
    case 'sheet': return <DocumentTable20Regular />;
    case 'pivot': return <Pivot20Regular />;
    case 'export': return <DocumentArrowDown20Regular />;
    default: return <Database20Regular />;
  }
};

const getNodeStatus = (data: any) => {
  if (data.type === 'entity') {
    if (!data.entity) return 'error';
    if (!data.attributes || data.attributes.length === 0) return 'warning';
    return 'success';
  }
  if (data.type === 'filter') {
    if (!data.conditions || data.conditions.length === 0) return 'warning';
    return 'success';
  }
  if (data.type === 'join') {
    if (!data.relation) return 'error';
    return 'success';
  }
  if (data.type === 'export') {
    if (!data.format) return 'warning';
    return 'success';
  }
  return 'success';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckmarkCircle20Filled style={{ color: 'var(--color-success)' }} />;
    case 'warning': return <Warning20Filled style={{ color: 'var(--color-warning)' }} />;
    case 'error': return <ErrorCircle20Filled style={{ color: 'var(--color-error)' }} />;
    default: return null;
  }
};

export const FlowNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const nodeTemplate = NODE_TEMPLATES.find(t => t.type === data.type || t.type === data.label);
  const color = nodeTemplate?.color || 'var(--color-node-default)';
  const title = nodeTemplate?.title || data.label || data.type || 'Unknown';
  const status = getNodeStatus(data);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger node deletion by dispatching a custom event
    const deleteEvent = new CustomEvent('deleteNode', { detail: { nodeId: id } });
    window.dispatchEvent(deleteEvent);
  };

  const getNodeClass = () => {
    if (data.type === 'entity' || data.type === 'filter' || data.type === 'join') return 'entity';
    if (data.type === 'transform' || data.type === 'aggregate' || data.type === 'concatenate' || data.type === 'pivot') return 'transform';
    return 'output';
  };

  const hasInputs = data.type !== 'entity';
  const hasOutputs = data.type !== 'export';

  return (
    <div 
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle */}
      {hasInputs && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: 'var(--color-primary)',
            border: '2px solid var(--color-surface)',
            width: 14,
            height: 14,
            left: -7,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        />
      )}
      
      <div
        style={{
          minWidth: '200px',
          background: 'var(--color-surface)',
          border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: selected ? 'var(--shadow-lg)' : 'var(--shadow-md)',
          transition: 'all 0.2s ease',
          position: 'relative',
          opacity: data.disabled ? 0.6 : 1,
        }}
        className={`n8n-flow-node ${getNodeClass()}`}
      >
        {/* Top colored bar */}
        <div
          style={{
            height: '4px',
            background: color,
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}
        />
        
        {/* Header */}
        <div style={{
          padding: '12px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {getNodeIcon(data.type)}
          </div>
          
          <div style={{ flex: 1 }}>
            <h4 style={{
              color: 'var(--color-text)',
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              lineHeight: 1.2,
            }}>
              {title}
            </h4>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '11px',
              margin: 0,
              lineHeight: 1.2,
            }}>
              {id}
            </p>
          </div>

          {/* Status and actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getStatusIcon(status)}
            {isHovered && (
              <>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle node settings
                  }}
                  title="Node Settings"
                >
                  <Settings20Regular />
                </button>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={handleDelete}
                  title="Delete Node"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-error)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-error)';
                  }}
                >
                  <Delete20Regular />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '0 16px 12px',
          fontSize: '12px',
          color: 'var(--color-text)',
        }}>
          {data.entity && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Entity:</strong> {data.entity}
            </div>
          )}
          {data.attributes && data.attributes.length > 0 && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Columns:</strong> {data.attributes.length} selected
            </div>
          )}
          {data.relation && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Relation:</strong> {data.relation.schemaName}
            </div>
          )}
          {data.name && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Sheet:</strong> {data.name}
            </div>
          )}
          {data.format && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Format:</strong> {data.format.toUpperCase()}
            </div>
          )}
          {data.conditions && data.conditions.length > 0 && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Filters:</strong> {data.conditions.length} conditions
            </div>
          )}
          {data.measures && data.measures.length > 0 && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Measures:</strong> {data.measures.length} defined
            </div>
          )}
          {data.expressions && data.expressions.length > 0 && (
            <div style={{ marginBottom: '4px', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-text)' }}>Expressions:</strong> {data.expressions.length} defined
            </div>
          )}
          
          {/* Default state message */}
          {(!data.entity && !data.relation && !data.name && !data.format && 
            (!data.conditions || data.conditions.length === 0) &&
            (!data.measures || data.measures.length === 0) &&
            (!data.expressions || data.expressions.length === 0)) && (
            <div style={{ color: 'var(--color-text)', fontStyle: 'italic', opacity: 0.7 }}>
              Click to configure this node
            </div>
          )}
        </div>

        {/* Execution indicator */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              border: '2px solid var(--color-primary)',
              borderRadius: 'calc(var(--radius-lg) + 2px)',
              pointerEvents: 'none',
              background: 'rgba(255, 109, 90, 0.1)',
            }}
          />
        )}
      </div>
      
      {/* Output Handle */}
      {hasOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: 'var(--color-primary)',
            border: '2px solid var(--color-surface)',
            width: 14,
            height: 14,
            right: -80,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};