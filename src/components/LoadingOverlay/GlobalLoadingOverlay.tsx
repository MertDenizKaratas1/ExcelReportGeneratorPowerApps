import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import { 
  ArrowClockwise20Regular,
  Database20Regular,
  DocumentArrowDown20Regular,
  Filter20Regular,
  Branch20Regular,
} from '@fluentui/react-icons';

const getOperationIcon = (operation: string) => {
  switch (operation) {
    case 'entity': return <Database20Regular />;
    case 'export': return <DocumentArrowDown20Regular />;
    case 'filter': return <Filter20Regular />;
    case 'join': return <Branch20Regular />;
    default: return <ArrowClockwise20Regular />;
  }
};

const getOperationColor = (operation: string) => {
  switch (operation) {
    case 'entity': return 'var(--color-node-entity)';
    case 'export': return 'var(--color-node-output)';
    case 'filter': 
    case 'join': return 'var(--color-node-transform)';
    default: return 'var(--color-primary)';
  }
};

export const GlobalLoadingOverlay: React.FC = () => {
  const { loading } = useLoading();

  if (!loading.isLoading) {
    return null;
  }

  return (
    <div className="global-loading-overlay">
      <div className="global-loading-backdrop" />
      <div className="global-loading-content">
        <div className="global-loading-spinner-container">
          {/* Main spinning icon */}
          <div 
            className="global-loading-main-icon"
            style={{ color: getOperationColor(loading.operation) }}
          >
            {getOperationIcon(loading.operation)}
          </div>
          
          {/* Rotating border */}
          <div 
            className="global-loading-ring"
            style={{ borderTopColor: getOperationColor(loading.operation) }}
          />
          
          {/* Pulse effect */}
          <div 
            className="global-loading-pulse"
            style={{ backgroundColor: `${getOperationColor(loading.operation)}20` }}
          />
        </div>
        
        <div className="global-loading-text">
          <h3 className="global-loading-message">{loading.message}</h3>
          <p className="global-loading-operation">
            {loading.operation === 'general' ? 'Processing...' : `Processing ${loading.operation}...`}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="global-loading-dots">
          <div className="global-loading-dot" style={{ animationDelay: '0s' }} />
          <div className="global-loading-dot" style={{ animationDelay: '0.2s' }} />
          <div className="global-loading-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};