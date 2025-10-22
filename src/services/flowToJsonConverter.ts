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

export class FlowToJsonConverter {
  
  /**
   * Convert ReactFlow nodes and edges to a JSON report definition
   */
  static flowToJson(
    nodes: Node[], 
    edges: Edge[], 
    metadata?: Partial<ReportDefinition>
  ): ReportDefinition {
    const reportNodes: ReportGraphNode[] = [];
    const reportEdges: ReportGraphEdge[] = [];

    // Convert nodes
    nodes.forEach(node => {
      const reportNode = this.convertFlowNodeToReportNode(node);
      if (reportNode) {
        reportNodes.push(reportNode);
      }
    });

    // Convert edges
    edges.forEach(edge => {
      const reportEdge = this.convertFlowEdgeToReportEdge(edge);
      reportEdges.push(reportEdge);
    });

    // Determine primary entity from the first entity node
    const primaryEntity = this.findPrimaryEntity(reportNodes);

    // Build the complete report definition
    const reportDef: ReportDefinition = {
      schemaVersion: "1.0.0",
      id: metadata?.id || `report-${Date.now()}`,
      name: metadata?.name || "Untitled Report",
      description: metadata?.description || "Generated from flow builder",
      owner: metadata?.owner || { id: "current-user", name: "Current User" },
      categoryId: metadata?.categoryId || null,
      tags: metadata?.tags || [],
      primaryEntity: primaryEntity || "unknown",
      createdAt: metadata?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportVersion: (metadata?.reportVersion || 0) + 1,

      security: metadata?.security || {
        executeAs: "caller",
        allowedRoles: ["Report Generator"],
        blockedEntitiesRegex: null
      },

      parameters: metadata?.parameters || [],

      graph: {
        nodes: reportNodes,
        edges: reportEdges
      },

      layout: this.generateLayout(reportNodes),
      limits: metadata?.limits || this.getDefaultLimits(),
      hints: this.generateHints(reportNodes),
      artifacts: metadata?.artifacts
    };

    return reportDef;
  }

  /**
   * Convert a ReactFlow node to a report graph node
   */
  private static convertFlowNodeToReportNode(flowNode: Node): ReportGraphNode | null {
    const nodeType = flowNode.data.type;
    if (!nodeType) return null;

    const baseReportNode: Omit<ReportGraphNode, 'data'> = {
      id: flowNode.id,
      type: nodeType,
      position: flowNode.position
    };

    switch (nodeType) {
      case 'entity':
        return {
          ...baseReportNode,
          data: this.convertToEntityNodeData(flowNode.data)
        };
      case 'filter':
        return {
          ...baseReportNode,
          data: this.convertToFilterNodeData(flowNode.data)
        };
      case 'link':
        return {
          ...baseReportNode,
          data: this.convertToLinkNodeData(flowNode.data)
        };
      case 'transform':
        return {
          ...baseReportNode,
          data: this.convertToTransformNodeData(flowNode.data)
        };
      case 'sheet':
        return {
          ...baseReportNode,
          data: this.convertToSheetNodeData(flowNode.data)
        };
      case 'export':
        return {
          ...baseReportNode,
          data: this.convertToExportNodeData(flowNode.data)
        };
      default:
        return null;
    }
  }

  private static convertToEntityNodeData(data: FlowNodeData): EntityNodeData {
    return {
      entity: data.entity || "unknown",
      attributes: data.attributes || [],
      orderBy: data.orderBy?.map(order => ({
        attribute: order.attribute,
        desc: order.desc || false
      })) || [],
      timezoneBehavior: data.timezone || "user",
      top: data.rowCap
    };
  }

  private static convertToFilterNodeData(data: FlowNodeData): FilterNodeData {
    const conditions = data.conditions?.map(cond => ({
      attribute: cond.attribute,
      operator: cond.operator as any,
      value: cond.value,
      label: `${cond.attribute} ${cond.operator} ${cond.value}`
    })) || [];

    const groups = data.filterGroups?.map(group => ({
      logic: group.type.toLowerCase() as 'and' | 'or',
      conditions: group.conditions.map(cond => ({
        attribute: cond.attribute,
        operator: cond.operator as any,
        value: cond.value,
        label: `${cond.attribute} ${cond.operator} ${cond.value}`
      }))
    })) || [];

    return {
      logic: "and",
      conditions,
      groups
    };
  }

  private static convertToLinkNodeData(data: FlowNodeData): LinkNodeData {
    const relation = data.relation;
    if (!relation) {
      throw new Error("Link node must have relation data");
    }

    return {
      relation: {
        direction: relation.kind as any,
        schemaName: relation.schemaName,
        from: relation.from,
        to: relation.to,
        target: relation.target
      },
      joinType: data.joinType || "outer",
      alias: data.alias || "linked",
      childFilters: data.childFilters?.[0]?.conditions?.map(cond => ({
        attribute: cond.attribute,
        operator: cond.operator as any,
        value: cond.value
      })) || [],
      childOrderBy: data.childSort?.map(sort => ({
        attribute: sort.attribute,
        desc: sort.desc || false
      })) || [],
      childTop: data.childTopN,
      childFields: data.childFields || [],
      manyPolicy: data.policy ? {
        kind: data.policy.kind,
        field: data.policy.field,
        delimiter: data.policy.delimiter,
        orderBy: data.policy.orderBy?.map(order => ({
          attribute: order.attribute,
          desc: order.desc || false
        })),
        top: data.policy.top,
        outputAlias: data.alias,
        measures: data.policy.measures?.map(m => ({
          func: m.func as any,
          attribute: m.attribute,
          alias: m.alias
        })),
        groupByChild: data.policy.groupBy,
        sheetName: data.policy.sheetName,
        columns: data.policy.childColumns
      } : undefined
    };
  }

  private static convertToTransformNodeData(data: FlowNodeData): TransformNodeData {
    return {
      expressions: data.expressions?.map(expr => ({
        alias: expr.alias,
        expr: expr.expression
      })) || []
    };
  }

  private static convertToSheetNodeData(data: FlowNodeData): SheetNodeData {
    return {
      name: data.name || "Unnamed Sheet",
      mode: data.mode || "main",
      columns: data.columns?.map(col => ({
        key: col.key,
        title: col.title || col.key,
        width: col.width,
        format: col.format === 'number' ? 'number' :
                col.format === 'date' ? 'date' :
                col.format === 'currency' ? 'currency' : 'text',
        align: col.align,
        wrap: false
      })) || [],
      freeze: data.freeze ? {
        rows: data.freeze.firstRow ? 1 : 0,
        columns: data.freeze.firstColumns || 0
      } : undefined,
      styles: data.styles ? {
        zebra: data.styles.zebraRows,
        headerBold: data.styles.boldHeader,
        autoFilter: true
      } : undefined,
      hyperlinks: data.hyperlinks ? {
        childSheetLinks: data.hyperlinks
      } : undefined
    };
  }

  private static convertToExportNodeData(data: FlowNodeData): ExportNodeData {
    return {
      format: data.format || "xlsx",
      layout: data.layout || "singleSheet",
      fileName: data.fileName || "Report_{yyyyMMdd}.xlsx",
      includeMetadataSheet: true
    };
  }

  /**
   * Convert a ReactFlow edge to a report graph edge
   */
  private static convertFlowEdgeToReportEdge(flowEdge: Edge): ReportGraphEdge {
    return {
      from: flowEdge.source,
      to: flowEdge.target,
      id: flowEdge.id
    };
  }

  /**
   * Find the primary entity from entity nodes
   */
  private static findPrimaryEntity(nodes: ReportGraphNode[]): string | null {
    const entityNode = nodes.find(node => node.type === 'entity');
    if (entityNode && entityNode.data) {
      const entityData = entityNode.data as EntityNodeData;
      return entityData.entity;
    }
    return null;
  }

  /**
   * Generate layout configuration based on sheet nodes
   */
  private static generateLayout(nodes: ReportGraphNode[]) {
    const sheetNodes = nodes.filter(node => node.type === 'sheet');
    const sheetNames = sheetNodes.map(node => (node.data as SheetNodeData).name);
    
    return {
      workbook: {
        mode: sheetNames.length > 1 ? "multiSheet" as const : "singleSheet" as const,
        sheetsOrder: sheetNames,
        metadataSheet: {
          enabled: true,
          name: "_Meta"
        }
      }
    };
  }

  /**
   * Get default limits configuration
   */
  private static getDefaultLimits() {
    return {
      pageSize: 5000,
      previewRows: 100,
      maxExpandedRows: 200000,
      maxColumnsPerSheet: 100,
      maxLinkDepth: 3,
      defaultChildTop: 10
    };
  }

  /**
   * Generate hints based on the flow structure
   */
  private static generateHints(nodes: ReportGraphNode[]) {
    const warnings: string[] = [];
    const entityNodes = nodes.filter(n => n.type === 'entity');
    const linkNodes = nodes.filter(n => n.type === 'link');
    const sheetNodes = nodes.filter(n => n.type === 'sheet');

    // Generate warnings
    if (entityNodes.length === 0) {
      warnings.push("No entity nodes found - report may not function correctly");
    }
    if (entityNodes.length > 1) {
      warnings.push("Multiple entity nodes detected - only the first will be used as primary");
    }
    if (sheetNodes.length === 0) {
      warnings.push("No sheet nodes found - add a sheet to define output format");
    }

    // Estimate row count (simplified)
    let baseEstimate = 1000; // Default estimate
    if (entityNodes.length > 0) {
      const firstEntity = entityNodes[0].data as EntityNodeData;
      // You could enhance this with actual metadata lookup
      baseEstimate = this.estimateEntityRowCount(firstEntity.entity);
    }

    const expandMultiplier = linkNodes.length > 0 ? linkNodes.length * 2.5 : 1;
    const expandEstimate = Math.floor(baseEstimate * expandMultiplier);

    return {
      rowEstimate: {
        base: baseEstimate,
        expandEstimate
      },
      warnings
    };
  }

  /**
   * Estimate row count for an entity (placeholder implementation)
   */
  private static estimateEntityRowCount(entityName: string): number {
    // This is a simplified estimation - in a real implementation,
    // you would query actual metadata or use cached statistics
    const estimates: Record<string, number> = {
      'employee': 2500,
      'account': 5000,
      'contact': 10000,
      'opportunity': 3000,
      'case': 8000
    };
    
    return estimates[entityName.toLowerCase()] || 1000;
  }

  /**
   * Update an existing report definition with new flow data
   */
  static updateReportFromFlow(
    existingReport: ReportDefinition,
    nodes: Node[],
    edges: Edge[]
  ): ReportDefinition {
    const updatedReport = this.flowToJson(nodes, edges, existingReport);
    
    // Preserve original metadata
    updatedReport.id = existingReport.id;
    updatedReport.createdAt = existingReport.createdAt;
    updatedReport.reportVersion = existingReport.reportVersion + 1;
    
    return updatedReport;
  }

  /**
   * Validate that a flow can be converted to a valid report
   */
  static validateFlow(nodes: Node[], edges: Edge[]): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required nodes
    const entityNodes = nodes.filter(n => n.data.type === 'entity');
    const sheetNodes = nodes.filter(n => n.data.type === 'sheet');
    const exportNodes = nodes.filter(n => n.data.type === 'export');

    if (entityNodes.length === 0) {
      errors.push("At least one entity node is required");
    }

    if (sheetNodes.length === 0) {
      warnings.push("No sheet nodes found - add sheets to define output format");
    }

    if (exportNodes.length === 0) {
      warnings.push("No export node found - add an export node to define output format");
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
        warnings.push(`Node ${node.id} is not connected to the flow`);
      }
    });

    // Check for cycles (simplified check)
    if (this.hasCycles(nodes, edges)) {
      errors.push("Flow contains cycles - this is not allowed");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Simple cycle detection
   */
  private static hasCycles(nodes: Node[], edges: Edge[]): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleUtil = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        const target = edge.target;
        if (!visited.has(target)) {
          if (hasCycleUtil(target)) {
            return true;
          }
        } else if (recursionStack.has(target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycleUtil(node.id)) {
          return true;
        }
      }
    }

    return false;
  }
}