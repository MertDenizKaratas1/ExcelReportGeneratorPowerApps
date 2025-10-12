import React from 'react';
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
} from '@fluentui/react-icons';
import { NODE_TEMPLATES } from '../../data/dummyData';

interface DraggableNodeProps {
  type: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactElement;
}

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

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, title, description, color, icon }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodeClass = () => {
    if (type === 'entity' || type === 'filter' || type === 'join') return 'n8n-node-card entity';
    if (type === 'transform' || type === 'aggregate' || type === 'concatenate' || type === 'pivot') return 'n8n-node-card transform';
    return 'n8n-node-card output';
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      className={getNodeClass()}
      style={{ marginBottom: '12px' }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px',
        marginBottom: '8px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-md)',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            color: 'var(--color-text)', 
            fontSize: '14px', 
            fontWeight: '600',
            marginBottom: '4px',
            lineHeight: 1.2
          }}>
            {title}
          </h4>
          <p style={{ 
            color: 'var(--color-text-muted)', 
            fontSize: '12px',
            lineHeight: 1.3,
            margin: 0
          }}>
            {description}
          </p>
        </div>
      </div>
      
      {/* Connection indicators */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '10px',
        color: 'var(--color-text-muted)'
      }}>
        <span>• Input</span>
        <span>Output •</span>
      </div>
    </div>
  );
};

export const NodePalette: React.FC = () => {
  return (
    <div>
      <h3>Nodes</h3>
      <p className="subtitle">
        Drag and drop these nodes onto the canvas to build your Excel report workflow.
      </p>
      
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          color: 'var(--color-text-light)', 
          fontSize: '12px', 
          fontWeight: '600',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Data Sources
        </h4>
        {NODE_TEMPLATES.filter(t => ['entity'].includes(t.type)).map((template) => (
          <DraggableNode
            key={template.type}
            type={template.type}
            title={template.title}
            description={template.description}
            color={template.color}
            icon={getNodeIcon(template.type)}
          />
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          color: 'var(--color-text-light)', 
          fontSize: '12px', 
          fontWeight: '600',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Data Processing
        </h4>
        {NODE_TEMPLATES.filter(t => ['filter', 'join', 'transform', 'aggregate', 'concatenate'].includes(t.type)).map((template) => (
          <DraggableNode
            key={template.type}
            type={template.type}
            title={template.title}
            description={template.description}
            color={template.color}
            icon={getNodeIcon(template.type)}
          />
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ 
          color: 'var(--color-text-light)', 
          fontSize: '12px', 
          fontWeight: '600',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Output
        </h4>
        {NODE_TEMPLATES.filter(t => ['sheet', 'pivot', 'export'].includes(t.type)).map((template) => (
          <DraggableNode
            key={template.type}
            type={template.type}
            title={template.title}
            description={template.description}
            color={template.color}
            icon={getNodeIcon(template.type)}
          />
        ))}
      </div>
    </div>
  );
};