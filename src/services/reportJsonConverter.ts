import { Node, Edge } from 'reactflow';
import { 
  ReportDefinition, 
  ReportGraphNode, 
  ReportGraphEdge,
  EntityNodeData,
  FilterNodeData,
  LinkNodeData,
  TransformNodeData,
  SheetNodeData,
  ExportNodeData
} from '../types/reportTypes';
import { FlowNodeData } from '../types/flowTypes';
import { SAMPLE_COMPLEX_REPORT } from '../data/sampleReports';

export class ReportJsonConverter {
  
  /**
   * Convert a JSON report definition to ReactFlow nodes and edges
   */
  static jsonToFlow(reportDef: ReportDefinition): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Convert nodes
    reportDef.graph.nodes.forEach((node, index) => {
      const flowNode = this.convertReportNodeToFlowNode(node, index);
      nodes.push(flowNode);
    });

    // Convert edges
    reportDef.graph.edges.forEach((edge, index) => {
      const flowEdge = this.convertReportEdgeToFlowEdge(edge, index);
      edges.push(flowEdge);
    });

    // Auto-layout nodes if positions are not provided
    this.autoLayoutNodes(nodes);

    return { nodes, edges };
  }

  /**
   * Convert a single report node to a ReactFlow node
   */
  private static convertReportNodeToFlowNode(reportNode: ReportGraphNode, index: number): Node {
    const baseNode: Node = {
      id: reportNode.id,
      type: 'default',
      position: reportNode.position || { x: 0, y: 0 },
      data: {
        label: this.getNodeLabel(reportNode),
        type: reportNode.type,
        ...this.convertNodeData(reportNode)
      }
    };

    return baseNode;
  }

  /**
   * Convert report node data to flow node data format
   */
  private static convertNodeData(reportNode: ReportGraphNode): Partial<FlowNodeData> {
    switch (reportNode.type) {
      case 'entity':
        return this.convertEntityNodeData(reportNode.data as EntityNodeData);
      case 'filter':
        return this.convertFilterNodeData(reportNode.data as FilterNodeData);
      case 'link':
        return this.convertLinkNodeData(reportNode.data as LinkNodeData);
      case 'transform':
        return this.convertTransformNodeData(reportNode.data as TransformNodeData);
      case 'sheet':
        return this.convertSheetNodeData(reportNode.data as SheetNodeData);
      case 'export':
        return this.convertExportNodeData(reportNode.data as ExportNodeData);
      default:
        return {};
    }
  }

  private static convertEntityNodeData(data: EntityNodeData): Partial<FlowNodeData> {
    return {
      entity: data.entity,
      attributes: data.attributes,
      orderBy: data.orderBy,
      timezone: data.timezoneBehavior,
      rowCap: data.top
    };
  }

  private static convertFilterNodeData(data: FilterNodeData): Partial<FlowNodeData> {
    return {
      conditions: data.conditions.map(cond => ({
        attribute: cond.attribute,
        operator: cond.operator as any,
        value: cond.value
      })),
      filterGroups: data.groups?.map(group => ({
        type: group.logic.toUpperCase() as 'AND' | 'OR',
        conditions: group.conditions.map(cond => ({
          attribute: cond.attribute,
          operator: cond.operator as any,
          value: cond.value
        }))
      }))
    };
  }

  private static convertLinkNodeData(data: LinkNodeData): Partial<FlowNodeData> {
    return {
      relation: {
        kind: data.relation.direction === 'oneToMany' ? 'oneToMany' : 
              data.relation.direction === 'manyToOne' ? 'manyToOne' : 'manyToMany',
        schemaName: data.relation.schemaName,
        from: data.relation.from,
        to: data.relation.to,
        target: data.relation.target
      },
      alias: data.alias,
      joinType: data.joinType,
      childFilters: data.childFilters ? [{
        type: 'AND' as const,
        conditions: data.childFilters.map(cond => ({
          attribute: cond.attribute,
          operator: cond.operator as any,
          value: cond.value
        }))
      }] : undefined,
      childSort: data.childOrderBy,
      childTopN: data.childTop,
      childFields: data.childFields,
      policy: data.manyPolicy ? {
        kind: data.manyPolicy.kind as any,
        field: data.manyPolicy.field,
        delimiter: data.manyPolicy.delimiter,
        orderBy: data.manyPolicy.orderBy,
        top: typeof data.manyPolicy.top === 'string' ? 
             parseInt(data.manyPolicy.top.replace(/[^0-9]/g, '')) : 
             data.manyPolicy.top,
        measures: data.manyPolicy.measures?.map(m => ({
          func: m.func,
          attribute: m.attribute,
          alias: m.alias
        })),
        groupBy: data.manyPolicy.groupByChild,
        sheetName: data.manyPolicy.sheetName,
        childColumns: data.manyPolicy.columns
      } : undefined
    };
  }

  private static convertTransformNodeData(data: TransformNodeData): Partial<FlowNodeData> {
    return {
      expressions: data.expressions.map(expr => ({
        alias: expr.alias,
        expression: expr.expr
      }))
    };
  }

  private static convertSheetNodeData(data: SheetNodeData): Partial<FlowNodeData> {
    return {
      name: data.name,
      mode: data.mode === 'main' ? 'main' : 'child',
      columns: data.columns.map(col => ({
        key: col.key,
        title: col.title,
        format: col.format === 'number(1)' || col.format === 'number(2)' ? 'number' : 
                col.format === 'text' ? 'text' :
                col.format || 'text',
        width: col.width,
        align: col.align
      })),
      freeze: data.freeze ? {
        firstRow: (data.freeze.rows || 0) > 0,
        firstColumns: data.freeze.columns
      } : undefined,
      styles: data.styles ? {
        zebraRows: data.styles.zebra,
        boldHeader: data.styles.headerBold
      } : undefined,
      hyperlinks: data.hyperlinks?.childSheetLinks
    };
  }

  private static convertExportNodeData(data: ExportNodeData): Partial<FlowNodeData> {
    return {
      format: data.format === 'pdf' ? 'xlsx' : data.format, // Convert PDF to XLSX for flow compatibility
      layout: data.layout,
      fileName: data.fileName
    };
  }

  /**
   * Convert a report edge to a ReactFlow edge
   */
  private static convertReportEdgeToFlowEdge(reportEdge: ReportGraphEdge, index: number): Edge {
    return {
      id: reportEdge.id || `edge-${reportEdge.from}-${reportEdge.to}`,
      source: reportEdge.from,
      target: reportEdge.to,
      type: 'smoothstep',
      animated: false
    };
  }

  /**
   * Generate a readable label for a node
   */
  private static getNodeLabel(node: ReportGraphNode): string {
    switch (node.type) {
      case 'entity':
        const entityData = node.data as EntityNodeData;
        return `${entityData.entity}${entityData.attributes.length > 0 ? ` (${entityData.attributes.length} fields)` : ''}`;
      
      case 'filter':
        const filterData = node.data as FilterNodeData;
        const condCount = filterData.conditions.length + (filterData.groups?.reduce((sum, g) => sum + g.conditions.length, 0) || 0);
        return `Filter (${condCount} conditions)`;
      
      case 'link':
        const linkData = node.data as LinkNodeData;
        return `${linkData.alias || linkData.relation.target} (${linkData.relation.direction})`;
      
      case 'transform':
        const transformData = node.data as TransformNodeData;
        return `Transform (${transformData.expressions.length} expressions)`;
      
      case 'sheet':
        const sheetData = node.data as SheetNodeData;
        return `${sheetData.name} Sheet (${sheetData.columns.length} columns)`;
      
      case 'export':
        const exportData = node.data as ExportNodeData;
        return `Export ${exportData.format.toUpperCase()}`;
      
      default:
        return node.type;
    }
  }

  /**
   * Auto-layout nodes in a flow-like arrangement if positions are not provided
   */
  private static autoLayoutNodes(nodes: Node[]): void {
    const horizontalSpacing = 300;
    const verticalSpacing = 150;
    
    // Group nodes by type for better layout
    const nodesByType = nodes.reduce((acc, node) => {
      const type = node.data.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    }, {} as Record<string, Node[]>);

    // Layout order: entity -> filter -> link -> transform -> sheet -> export
    const layoutOrder = ['entity', 'filter', 'link', 'transform', 'sheet', 'export'];
    
    let currentX = 50;
    
    layoutOrder.forEach(type => {
      const typeNodes = nodesByType[type] || [];
      if (typeNodes.length === 0) return;
      
      typeNodes.forEach((node, index) => {
        if (!node.position || (node.position.x === 0 && node.position.y === 0)) {
          node.position = {
            x: currentX,
            y: 50 + (index * verticalSpacing)
          };
        }
      });
      
      if (typeNodes.length > 0) {
        currentX += horizontalSpacing;
      }
    });

    // Handle any remaining nodes not in the standard types
    Object.keys(nodesByType).forEach(type => {
      if (!layoutOrder.includes(type)) {
        const typeNodes = nodesByType[type];
        typeNodes.forEach((node, index) => {
          if (!node.position || (node.position.x === 0 && node.position.y === 0)) {
            node.position = {
              x: currentX,
              y: 50 + (index * verticalSpacing)
            };
          }
        });
        currentX += horizontalSpacing;
      }
    });
  }

  /**
   * Create a sample report definition for testing
   */
  static createSampleReport(): ReportDefinition {
    // Return a copy of the complex sample report with a new ID and timestamps
    const sampleReport = JSON.parse(JSON.stringify(SAMPLE_COMPLEX_REPORT)) as ReportDefinition;
    sampleReport.id = "sample-report-" + Date.now();
    sampleReport.createdAt = new Date().toISOString();
    sampleReport.updatedAt = new Date().toISOString();
    sampleReport.reportVersion = 1;
    
    return sampleReport;
  }
}