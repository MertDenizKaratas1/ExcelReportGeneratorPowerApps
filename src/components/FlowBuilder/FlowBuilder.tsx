import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  OnConnect,
  ConnectionMode,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CommandBar } from './CommandBar';
import { NodePalette } from './NodePalette';
import { PropertiesPanel } from './PropertiesPanel';
import { PreviewPanel } from './PreviewPanel';
import { HistoryPanel } from './HistoryPanel';
import { FlowNode as CustomFlowNode } from './FlowNode';
import { FlowGraph, PreviewData } from '../../types/flowTypes';
import { DUMMY_METADATA, DUMMY_RECORDS } from '../../data/dummyData';

const nodeTypes = {
  default: CustomFlowNode,
};

export const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData>({ columns: [], rows: [] });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Prevent cycles and enforce max depth of 3 joins
      if (params.source && params.target) {
        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: 'smoothstep',
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'default', // Use default type since we're using custom components
        position,
        data: {
          label: type,
          type: type,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, [setNodes]);

  // Delete selected nodes and edges
  const onDeleteNodes = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNodeId && edge.target !== selectedNodeId
      ));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);

  // Delete selected edges
  const onDeleteEdges = useCallback((edgeIds: string[]) => {
    setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)));
  }, [setEdges]);

  // Handle keyboard events for deletion
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      
      // Get selected elements
      const selectedNodes = nodes.filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);
      
      if (selectedNodes.length > 0) {
        // Delete selected nodes and their connections
        const nodeIds = selectedNodes.map((node) => node.id);
        setNodes((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
        setEdges((eds) => eds.filter((edge) => 
          !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
        ));
        setSelectedNodeId(null);
      } else if (selectedEdges.length > 0) {
        // Delete selected edges
        const edgeIds = selectedEdges.map((edge) => edge.id);
        setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)));
      }
    }
  }, [nodes, edges, setNodes, setEdges]);

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  // Add custom delete event listener for node delete buttons
  React.useEffect(() => {
    const handleDeleteNode = (event: any) => {
      const nodeId = event.detail.nodeId;
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== nodeId && edge.target !== nodeId
      ));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('deleteNode', handleDeleteNode);
    return () => {
      window.removeEventListener('deleteNode', handleDeleteNode);
    };
  }, [selectedNodeId, setNodes, setEdges]);

  const handleNew = useCallback(() => {
    if (nodes.length > 0 && window.confirm('Create a new flow? This will clear the current flow.')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setPreviewData({ columns: [], rows: [] });
    }
  }, [nodes.length, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const flowGraph: FlowGraph = {
      schemaVersion: '1.0',
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type as any,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };
    
    const dataStr = JSON.stringify(flowGraph, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'flow-graph.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  const handleLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowGraph: FlowGraph = JSON.parse(e.target?.result as string);
          
          const loadedNodes = flowGraph.nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
          }));
          
          const loadedEdges = flowGraph.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: 'smoothstep',
          }));
          
          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } catch (error) {
          console.error('Error loading flow graph:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  const handlePreview = useCallback(() => {
    // Generate preview data based on current flow
    const entityNodes = nodes.filter(n => n.data.type === 'entity' && n.data.entity);
    const sheetNodes = nodes.filter(n => n.data.type === 'sheet');
    
    if (entityNodes.length === 0) {
      setPreviewData({
        columns: [],
        rows: [],
        warnings: ['No configured entity node found. Add an entity node and select an entity to start building your report.']
      });
      return;
    }

    // Get the first entity node for demo
    const entityNode = entityNodes[0];
    const entityName = entityNode.data.entity;
    const selectedAttributes = entityNode.data.attributes || [];
    
    // Get entity metadata
    const entityMeta = DUMMY_METADATA.entities.find(e => e.logicalName === entityName);
    const entityGraph = entityMeta ? DUMMY_METADATA.graphs[entityName] : null;
    
    if (!entityMeta || !entityGraph) {
      setPreviewData({
        columns: [],
        rows: [],
        warnings: [`Entity metadata not found for: ${entityName}`]
      });
      return;
    }

    // Build columns based on selected attributes
    let columns: string[] = [];
    if (selectedAttributes.length > 0) {
      columns = selectedAttributes.map((attrName: string) => {
        const attr = entityGraph.attributes.find((a: any) => a.logicalName === attrName);
        return attr ? attr.displayName : attrName;
      });
    } else {
      // Default columns if none selected
      columns = entityGraph.attributes.slice(0, 5).map((attr: any) => attr.displayName);
    }

    // Get dummy data for the entity
    const entityData = (DUMMY_RECORDS as any)[entityName] || [];
    
    // Build rows based on selected attributes and dummy data
    const rows = entityData.map((record: any) => {
      if (selectedAttributes.length > 0) {
        return selectedAttributes.map((attrName: string) => {
          const value = record[attrName];
          // Handle lookup values
          if (value && typeof value === 'object' && value.name) {
            return value.name;
          }
          return value || '';
        });
      } else {
        // Default data if no attributes selected
        return entityGraph.attributes.slice(0, 5).map((attr: any) => {
          const value = record[attr.logicalName];
          if (value && typeof value === 'object' && value.name) {
            return value.name;
          }
          return value || '';
        });
      }
    });

    const preview: PreviewData = {
      columns,
      rows,
      warnings: [
        `Preview for entity: ${entityMeta.displayName}`,
        `${rows.length} records found`,
        selectedAttributes.length > 0 
          ? `Showing ${selectedAttributes.length} selected columns` 
          : 'Showing default columns (select specific columns in entity properties)'
      ],
    };

    // Add child sheets if there are sheet nodes
    if (sheetNodes.length > 0) {
      preview.sheets = {};
      sheetNodes.forEach((node, index) => {
        const sheetName = node.data.name || `Sheet${index + 1}`;
        preview.sheets![sheetName] = {
          columns: ['Organization', 'Type', 'Start Date'],
          rows: [
            ['HR', 'Job Hiring', '2020-01-01'],
            ['Finance', 'Position Change', '2021-06-15'],
            ['Safety', 'Rotation', '2022-03-01'],
          ]
        };
      });
    }

    setPreviewData(preview);
  }, [nodes]);

  const handleValidate = useCallback(() => {
    const warnings: string[] = [];
    
    // Check for missing base entity
    const hasBaseEntity = nodes.some(node => node.type === 'entity');
    if (!hasBaseEntity) {
      warnings.push('Missing base entity node');
    }
    
    // Check for nodes without required data
    nodes.forEach(node => {
      if (node.type === 'join' && !node.data.relation) {
        warnings.push(`Join node ${node.id} missing relationship selection`);
      }
      if (node.type === 'aggregate' && (!node.data.measures || node.data.measures.length === 0)) {
        warnings.push(`Aggregate node ${node.id} missing measures`);
      }
    });
    
    if (warnings.length > 0) {
      alert('Validation warnings:\n' + warnings.join('\n'));
    } else {
      alert('Validation passed!');
    }
  }, [nodes]);

  const handleExport = useCallback(() => {
    if (previewData.rows.length === 0) {
      alert('No data to export. Please generate a preview first.');
      return;
    }

    // Create CSV content
    const headers = previewData.columns.join(',');
    const csvRows = previewData.rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `excel-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [previewData]);

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="n8n-app" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: 'var(--color-background)'
    }}>
      {/* Command Bar */}
      <div className="n8n-command-bar">
        <CommandBar
          onNew={handleNew}
          onSave={handleSave}
          onLoad={handleLoad}
          onPreview={handlePreview}
          onValidate={handleValidate}
          onExport={handleExport}
          onToggleHistory={() => setShowHistory(!showHistory)}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Palette */}
        <div className="n8n-node-palette" style={{ width: '280px' }}>
          <NodePalette />
        </div>

        {/* Center Canvas */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--color-background)' }}>
          <ReactFlowProvider>
            <div
              ref={reactFlowWrapper}
              style={{ width: '100%', height: '100%' }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                snapToGrid={true}
                snapGrid={[15, 15]}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                minZoom={0.2}
                maxZoom={4}
                attributionPosition="bottom-left"
                multiSelectionKeyCode="Shift"
                deleteKeyCode="Delete"
                selectNodesOnDrag={false}
                panOnDrag={true}
                elementsSelectable={true}
              >
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={20} 
                  size={1} 
                  color="var(--color-border)"
                />
                <Controls 
                  position="bottom-right"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                />
                <MiniMap 
                  position="top-right"
                  nodeStrokeColor={(n) => {
                    if (n.data?.type === 'entity') return 'var(--color-node-entity)';
                    if (n.data?.type === 'transform') return 'var(--color-node-transform)';
                    return 'var(--color-node-default)';
                  }}
                  nodeColor={(n) => {
                    if (n.data?.type === 'entity') return 'var(--color-node-entity)';
                    if (n.data?.type === 'transform') return 'var(--color-node-transform)';
                    return 'var(--color-node-default)';
                  }}
                  maskColor="rgba(19, 25, 38, 0.8)"
                />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>

        {/* Right Properties Panel */}
        {selectedNode && (
          <div className="n8n-properties" style={{ width: '380px' }}>
            <PropertiesPanel
              node={selectedNode}
              onUpdate={handleNodeUpdate}
            />
          </div>
        )}
      </div>

      {/* Bottom Preview */}
      {/* <div className="n8n-preview" style={{ height: '320px' }}>
        <PreviewPanel data={previewData} />
      </div> */}

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
  };