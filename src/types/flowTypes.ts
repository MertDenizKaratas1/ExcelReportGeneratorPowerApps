export interface EntityMetadata {
  logicalName: string;
  displayName: string;
  primaryId: string;
  primaryName: string;
}

export interface AttributeMetadata {
  logicalName: string;
  displayName: string;
  type: 'String' | 'DateTime' | 'Lookup' | 'OptionSet' | 'Integer' | 'Decimal';
  targets?: string[];
}

export interface RelationshipMetadata {
  schemaName: string;
  referencingAttribute: string;
  referencedEntity: string;
  referencedAttribute: string;
  displayName: string;
}

export interface ManyToManyRelationship {
  schemaName: string;
  entity1: string;
  entity2: string;
  intersectEntity: string;
}

export interface EntityGraph {
  attributes: AttributeMetadata[];
  relationships: {
    manyToOne: RelationshipMetadata[];
    oneToMany: RelationshipMetadata[];
    manyToMany: ManyToManyRelationship[];
  };
}

export interface MetadataSnapshot {
  entities: EntityMetadata[];
  graphs: Record<string, EntityGraph>;
}

export interface FilterCondition {
  attribute: string;
  operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'like' | 'in' | 'notin';
  value: any;
}

export interface FilterGroup {
  type: 'AND' | 'OR';
  conditions: FilterCondition[];
}

export interface JoinPolicy {
  kind: 'expand' | 'summarize' | 'concat' | 'childSheet';
  field?: string; // for concat
  delimiter?: string; // for concat
  orderBy?: Array<{ attribute: string; desc?: boolean }>; // for concat
  top?: number; // for concat
  measures?: Array<{ func: string; attribute?: string; alias: string }>; // for summarize
  groupBy?: string[]; // for summarize
  sheetName?: string; // for childSheet
  childColumns?: string[]; // for childSheet
}

export interface FlowNodeData {
  // Base Entity
  entity?: string;
  attributes?: string[];
  orderBy?: Array<{ attribute: string; desc?: boolean }>;
  rowCap?: number;
  timezone?: 'user' | 'utc';
  
  // Filter
  conditions?: FilterCondition[];
  filterGroups?: FilterGroup[];
  
  // Join/Link
  relation?: {
    kind: 'manyToOne' | 'oneToMany' | 'manyToMany';
    schemaName: string;
    from: string;
    to: string;
    target: string;
  };
  alias?: string;
  joinType?: 'inner' | 'outer';
  childFilters?: FilterGroup[];
  childSort?: Array<{ attribute: string; desc?: boolean }>;
  childTopN?: number;
  childFields?: string[];
  policy?: JoinPolicy;
  
  // Transform
  expressions?: Array<{ alias: string; expression: string }>;
  
  // Aggregate
  groupBy?: string[];
  measures?: Array<{ func: string; attribute?: string; alias: string }>;
  havingFilter?: FilterGroup;
  
  // Sheet
  name?: string;
  mode?: 'main' | 'child';
  parentKey?: string;
  columns?: Array<{
    key: string;
    title?: string;
    format?: 'date' | 'number' | 'currency' | 'text';
    width?: number;
    align?: 'left' | 'center' | 'right';
  }>;
  freeze?: {
    firstRow?: boolean;
    firstColumns?: number;
  };
  styles?: {
    zebraRows?: boolean;
    boldHeader?: boolean;
  };
  hyperlinks?: boolean;
  
  // Pivot/Matrix
  rows?: string[];
  pivotColumns?: string[];
  values?: Array<{ func: string; attribute: string; alias?: string }>;
  filters?: FilterGroup[];
  
  // Export
  format?: 'xlsx' | 'csv';
  layout?: 'singleSheet' | 'multiSheet';
  fileName?: string;
}

export interface FlowNode {
  id: string;
  type: 'entity' | 'filter' | 'join' | 'transform' | 'aggregate' | 'concatenate' | 'sheet' | 'pivot' | 'export';
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface FlowGraph {
  schemaVersion: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface HistoryEntry {
  runId: string;
  reportName: string;
  started: string;
  ended?: string;
  rows: number;
  status: 'running' | 'completed' | 'failed';
}

export interface PreviewData {
  columns: string[];
  rows: any[][];
  sheets?: Record<string, { columns: string[]; rows: any[][] }>;
  warnings?: string[];
}