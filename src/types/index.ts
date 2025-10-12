// ============================================================================
// TYPE DEFINITIONS FOR DYNAMICS 365 ACTIONS
// ============================================================================

// Common action inputs
export interface ActionInputBase {
  PlatformUserId?: string;
  PlatformProxyUserId?: string;
  PlatformType?: string;
  JsonInput: string;
}

// Common action outputs
export interface ActionOutputBase {
  ActionResult: string; // JSON string containing { success: boolean, message: string }
  JsonOutput: string;   // JSON string containing the actual data
}

// Parsed action result
export interface ActionResult {
  success: boolean;
  message?: string;
}

// Generic action response
export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// ============================================================================
// COMPILE REPORT TYPES
// ============================================================================

export interface CompileReportInput {
  templateId?: string;
  reportName: string;
  reportTemplate?: string;
  dataSources: DataSourceRequest[];
  worksheets: WorksheetRequest[];
  reportSettings?: Record<string, any>;
  outputFormat?: 'xlsx' | 'csv' | 'pdf';
  includeCharts?: boolean;
}

export interface DataSourceRequest {
  name: string;
  entityName: string;
  query?: string;
  filters?: Record<string, any>;
}

// Extended (UI-only) relationship selection used while designing the report.
// Not required by backend but can be included safely if backend ignores unknown props.
export interface SelectedRelationship {
  schemaName: string;
  relationshipType: 'OneToMany' | 'ManyToOne' | 'ManyToMany';
  fromEntity: string;
  toEntity: string;
  fromAttribute?: string;
  toAttribute?: string;
  // Depth or hop distance from the root entity (optional, for display only)
  depth?: number;
}

// UI helper type for local state only (not exported to backend explicitly)
export interface ExtendedDataSource extends DataSourceRequest {
  relationships?: SelectedRelationship[];
}

export interface WorksheetRequest {
  name: string;
  template?: string;
  dataSource: string;
  columns: ColumnRequest[];
  includeHeaders?: boolean;
}

export interface ColumnRequest {
  name: string;
  fieldName: string;
  displayName: string;
  dataType: string;
  width?: number;
}

export interface CompileReportOutput {
  reportId?: string;
  fileName: string;
  fileContent: string; // Base64 encoded
  mimeType: string;
  recordCount?: number;
}

// ============================================================================
// EXECUTE PAGE TYPES
// ============================================================================

export interface ExecutePageInput {
  pageId?: string;
  templateId?: string;
  entityName: string;
  recordId?: string;
  filters?: Record<string, any>;
  parameters?: Record<string, string>;
  outputFormat?: 'xlsx' | 'csv' | 'pdf';
  includeHeaders?: boolean;
}

export interface ExecutePageOutput {
  pageId?: string;
  fileName: string;
  fileContent: string; // Base64 encoded
  mimeType: string;
  recordCount?: number;
}

// ============================================================================
// GET ENTITY GRAPH TYPES
// ============================================================================

export interface GetEntityGraphInput {
  entityName: string;
  includeRelatedEntities?: boolean;
  maxDepth?: number;
  includeAttributes?: boolean;
  includeRelationships?: boolean;
  filterSystemEntities?: boolean;
}

export interface EntityGraphOutput {
  entities: EntityNode[];
  relationships: RelationshipEdge[];
  metadata: EntityGraphMetadata;
}

export interface EntityNode {
  logicalName: string;
  displayName: string;
  objectTypeCode: number;
  primaryIdAttribute: string;
  primaryNameAttribute: string;
  attributes?: AttributeMetadata[];
  depth: number;
  isCustomEntity: boolean;
}

export interface AttributeMetadata {
  logicalName: string;
  displayName: string;
  attributeType: string;
  isPrimaryId: boolean;
  isPrimaryName: boolean;
  isRequired: boolean;
  isCustomAttribute: boolean;
}

export interface RelationshipEdge {
  schemaName: string;
  relationshipType: string;
  entity1LogicalName: string;
  entity2LogicalName: string;
  entity1NavigationProperty: string;
  entity2NavigationProperty: string;
  isCustomRelationship: boolean;
}

export interface EntityGraphMetadata {
  rootEntity: string;
  totalEntities: number;
  totalRelationships: number;
  maxDepth: number;
  generatedAt: string;
}

// ============================================================================
// GET METADATA SNAPSHOT TYPES
// ============================================================================

export interface GetMetadataSnapshotInput {
  includeEntities?: boolean;
  includeAttributes?: boolean;
  includeRelationships?: boolean;
  filterSystemEntities?: boolean;
  entityNames?: string[];
  includeOptionSets?: boolean;
  includeOptionSetOptions?: boolean;
  includeSolutions?: boolean;
  uiLcid?: number;
}

export interface MetadataSnapshotOutput {
  entities?: EntityMetadata[];
  optionSets?: OptionSetMetadata[];
  solutions?: SolutionMetadata[];
  metadata: SnapshotMetadata;
}

export interface EntityMetadata {
  logicalName: string;
  displayName: string;
  displayCollectionName: string;
  schemaName: string;
  objectTypeCode: number;
  primaryIdAttribute: string;
  primaryNameAttribute: string;
  isCustomEntity: boolean;
  isActivity: boolean;
  ownershipType: string;
  attributes?: AttributeMetadata[];
  relationships?: RelationshipMetadata[];
}

export interface RelationshipMetadata {
  schemaName: string;
  relationshipType: string;
  referencedEntity: string;
  referencingEntity: string;
  referencedAttribute: string;
  referencingAttribute: string;
}

export interface OptionSetMetadata {
  name: string;
  displayName: string;
  isGlobal: boolean;
  options?: OptionMetadata[];
}

export interface OptionMetadata {
  value: number;
  label: string;
  color?: string;
}

export interface SolutionMetadata {
  uniqueName: string;
  friendlyName: string;
  version: string;
  publisherName: string;
  isManaged: boolean;
}

export interface SnapshotMetadata {
  organizationId: string;
  organizationName: string;
  organizationVersion: string;
  totalEntities: number;
  customEntities: number;
  totalOptionSets?: number;
  totalSolutions?: number;
  snapshotDate: string;
  lcid: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  details?: string;
  code?: string;
}
