// Report Definition Schema Types
// Based on the comprehensive JSON structure for Excel report generation

export interface ReportOwner {
  id: string;
  name: string;
}

export interface ReportSecurity {
  executeAs: 'caller' | 'owner' | 'systemuser';
  allowedRoles: string[];
  blockedEntitiesRegex?: string | null;
}

export interface ReportParameter {
  name: string;
  type: 'boolean' | 'string' | 'number' | 'date' | 'datetime' | 'optionset';
  default?: any;
  min?: number;
  max?: number;
  label: string;
  description?: string;
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
}

export interface NodePosition {
  x: number;
  y: number;
}

// Base interface for all node types
export interface BaseNodeData {
  label?: string;
  description?: string;
}

// Entity Node Data
export interface EntityNodeData extends BaseNodeData {
  entity: string;
  attributes: string[];
  orderBy?: Array<{ attribute: string; desc: boolean }>;
  timezoneBehavior?: 'user' | 'utc';
  top?: number;
}

// Filter Node Data
export interface FilterCondition {
  attribute: string;
  operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'like' | 'in' | 'notin' | 'on-or-after' | 'on-or-before';
  value: any;
  label?: string;
}

export interface FilterGroup {
  logic: 'and' | 'or';
  conditions: FilterCondition[];
}

export interface FilterNodeData extends BaseNodeData {
  logic: 'and' | 'or';
  conditions: FilterCondition[];
  groups?: FilterGroup[];
}

// Link/Join Node Data
export interface RelationshipConfig {
  direction: 'oneToMany' | 'manyToOne' | 'manyToMany';
  schemaName: string;
  from: string;
  to: string;
  target: string;
}

export interface ManyPolicy {
  kind: 'concat' | 'summarize' | 'childSheet' | 'expand';
  // For concat
  field?: string;
  delimiter?: string;
  orderBy?: Array<{ attribute: string; desc: boolean }>;
  top?: number | string; // can be parameter reference like "@MaxConcat"
  outputAlias?: string;
  // For summarize
  measures?: Array<{ func: 'count' | 'sum' | 'avg' | 'min' | 'max'; attribute?: string; alias: string }>;
  groupByChild?: string[];
  // For childSheet
  sheetName?: string;
  columns?: string[];
}

export interface LinkNodeData extends BaseNodeData {
  relation: RelationshipConfig;
  joinType: 'inner' | 'outer';
  alias: string;
  childFilters?: FilterCondition[];
  childOrderBy?: Array<{ attribute: string; desc: boolean }>;
  childTop?: number;
  childFields: string[];
  manyPolicy?: ManyPolicy;
}

// Transform Node Data
export interface TransformExpression {
  alias: string;
  expr: string;
}

export interface TransformNodeData extends BaseNodeData {
  expressions: TransformExpression[];
}

// Sheet Node Data
export interface SheetColumn {
  key: string;
  title: string;
  width?: number;
  format?: 'text' | 'number' | 'date' | 'currency' | 'number(1)' | 'number(2)';
  align?: 'left' | 'center' | 'right';
  wrap?: boolean;
}

export interface SheetFreeze {
  rows?: number;
  columns?: number;
}

export interface SheetStyles {
  zebra?: boolean;
  headerBold?: boolean;
  autoFilter?: boolean;
}

export interface SheetHyperlinks {
  childSheetLinks?: boolean;
}

export interface SheetNodeData extends BaseNodeData {
  name: string;
  mode: 'main' | 'aggregate' | 'child';
  columns: SheetColumn[];
  freeze?: SheetFreeze;
  styles?: SheetStyles;
  hyperlinks?: SheetHyperlinks;
}

// Export Node Data
export interface ExportNodeData extends BaseNodeData {
  format: 'xlsx' | 'csv' | 'pdf';
  layout: 'singleSheet' | 'multiSheet';
  fileName: string;
  includeMetadataSheet?: boolean;
}

// Union type for all node data types
export type ReportNodeData = 
  | EntityNodeData 
  | FilterNodeData 
  | LinkNodeData 
  | TransformNodeData 
  | SheetNodeData 
  | ExportNodeData;

// Report Graph Node
export interface ReportGraphNode {
  id: string;
  type: 'entity' | 'filter' | 'link' | 'transform' | 'sheet' | 'export';
  data: ReportNodeData;
  position?: NodePosition; // For UI layout
}

// Report Graph Edge
export interface ReportGraphEdge {
  from: string;
  to: string;
  id?: string; // Optional, can be generated
}

// Report Graph
export interface ReportGraph {
  nodes: ReportGraphNode[];
  edges: ReportGraphEdge[];
}

// Layout Configuration
export interface WorkbookLayout {
  mode: 'singleSheet' | 'multiSheet';
  sheetsOrder?: string[];
  metadataSheet?: {
    enabled: boolean;
    name: string;
  };
}

export interface ReportLayout {
  workbook: WorkbookLayout;
}

// Limits Configuration
export interface ReportLimits {
  pageSize: number;
  previewRows: number;
  maxExpandedRows: number;
  maxColumnsPerSheet: number;
  maxLinkDepth: number;
  defaultChildTop: number;
}

// Hints and Estimates
export interface RowEstimate {
  base: number;
  orgAvg?: number;
  expandEstimate?: number;
}

export interface ReportHints {
  rowEstimate?: RowEstimate;
  warnings?: string[];
  estimatedExecutionTime?: number;
}

// Compilation Artifacts
export interface MetadataSnapshotRef {
  id: string;
  version: string;
  lcid: number;
}

export interface ChildPlan {
  targetEntity: string;
  parentKey: string;
  select: string[];
  orderBy?: Array<{ attribute: string; desc: boolean }>;
  filters?: FilterCondition[];
}

export interface ReportArtifacts {
  compilerVersion: string;
  compiledAt: string;
  metadataSnapshot: MetadataSnapshotRef;
  primaryFetchXml?: string;
  aggregateFetches?: Record<string, string>;
  childPlans?: Record<string, ChildPlan>;
}

// Main Report Definition
export interface ReportDefinition {
  // Metadata
  schemaVersion: string;
  id: string;
  name: string;
  description: string;
  owner: ReportOwner;
  categoryId?: string | null;
  tags: string[];
  primaryEntity: string;
  createdAt: string;
  updatedAt: string;
  reportVersion: number;

  // Security
  security: ReportSecurity;

  // Parameters
  parameters: ReportParameter[];

  // Graph Definition
  graph: ReportGraph;

  // Layout
  layout: ReportLayout;

  // Execution Limits
  limits: ReportLimits;

  // Hints and Optimization
  hints: ReportHints;

  // Compilation Artifacts (populated after compilation)
  artifacts?: ReportArtifacts;
}

// Helper types for UI state management
export interface ReportListItem {
  id: string;
  name: string;
  description: string;
  primaryEntity: string;
  tags: string[];
  updatedAt: string;
  reportVersion: number;
}

export interface ReportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Export/Import formats
export interface ReportExportData {
  version: string;
  reports: ReportDefinition[];
  exportedAt: string;
  exportedBy: string;
}