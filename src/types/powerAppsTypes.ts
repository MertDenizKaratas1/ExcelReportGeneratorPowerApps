/**
 * TypeScript interfaces for Power Apps action inputs and outputs
 * These match the C# models used in the Power Apps actions
 */

// Base action result structure
export interface ActionResult {
  code: number;
  message: string | null;
  success: boolean;
}

// Base action response structure
export interface BaseActionResponse {
  ActionResult: ActionResult;
  JsonOutput: string;
}

// === GET METADATA SNAPSHOT ACTION ===

export interface GetMetadataSnapshotInput {
  includeEntities: boolean;
  includeAttributes: boolean;
  includeRelationships: boolean;
  filterSystemEntities: boolean;
  entityNames: string[];
  includeOptionSets: boolean;
  includeOptionSetOptions: boolean;
  includeSolutions: boolean;
  uiLcid: number;
}

export interface EntityMetadataInfo {
  logicalName: string;
  displayName: string;
  description?: string;
  entityTypeCode: number;
  primaryIdAttribute: string;
  primaryNameAttribute?: string;
  ownershipType: string;
  isCustomEntity: boolean;
  isActivity: boolean;
  isIntersect: boolean;
  hasNotes: boolean;
  hasActivities: boolean;
  canCreateCharts: boolean;
  canCreateForms: boolean;
  canCreateViews: boolean;
  attributes?: AttributeMetadataInfo[];
  relationships?: RelationshipMetadataInfo[];
}

export interface AttributeMetadataInfo {
  logicalName: string;
  displayName: string;
  description?: string;
  attributeType: string;
  isPrimaryId: boolean;
  isPrimaryName: boolean;
  isValidForRead: boolean;
  isValidForCreate: boolean;
  isValidForUpdate: boolean;
  isRequiredLevel: boolean;
  maxLength?: number;
  precision?: number;
  minValue?: number;
  maxValue?: number;
  format?: string;
  targets?: string[];
  optionSet?: OptionSetMetadataInfo;
}

export interface RelationshipMetadataInfo {
  schemaName: string;
  relationshipType: string;
  referencingEntity: string;
  referencingAttribute: string;
  referencedEntity: string;
  referencedAttribute: string;
  displayName?: string;
  isCustomRelationship: boolean;
  cascadeConfiguration?: any;
}

export interface OptionSetMetadataInfo {
  name: string;
  displayName: string;
  isGlobal: boolean;
  options: OptionMetadataInfo[];
}

export interface OptionMetadataInfo {
  value: number;
  label: string;
  description?: string;
  color?: string;
}

export interface SolutionMetadataInfo {
  uniqueName: string;
  friendlyName: string;
  version: string;
  description?: string;
  publisherUniqueName: string;
  publisherFriendlyName: string;
}

export interface MetadataSnapshot {
  snapshotId: string;
  createdDate: string;
  entities: EntityMetadataInfo[];
  optionSets: OptionSetMetadataInfo[];
  solutions: SolutionMetadataInfo[];
}

export interface GetMetadataSnapshotOutput {
  success: boolean;
  message: string;
  errors: string[];
  snapshot: MetadataSnapshot;
  totalEntities: number;
  totalOptionSets: number;
  totalSolutions: number;
}

// === COMPILE REPORT ACTION ===

export interface CompileReportInput {
  reportDefinition: string; // JSON string of ReportDefinition
  includePreview: boolean;
  previewRowLimit: number;
  validateOnly: boolean;
}

export interface CompileReportOutput {
  success: boolean;
  message: string;
  errors: string[];
  warnings: string[];
  compiledReport?: any;
  previewData?: any;
  executionPlan?: any;
  estimatedRows?: number;
  estimatedExecutionTime?: number;
}

// === EXECUTE PAGE ACTION ===

export interface ExecutePageInput {
  reportDefinition: string; // JSON string of ReportDefinition
  parameters: Record<string, any>;
  outputFormat: 'xlsx' | 'csv' | 'json';
  includeMetadata: boolean;
}

export interface ExecutePageOutput {
  success: boolean;
  message: string;
  errors: string[];
  warnings: string[];
  fileData?: string; // Base64 encoded file data
  fileName?: string;
  mimeType?: string;
  rowCount?: number;
  executionTime?: number;
}

// === GET ENTITY GRAPH ACTION ===

export interface GetEntityGraphInput {
  entityName: string;
  includeAttributes: boolean;
  includeRelationships: boolean;
  relationshipDepth: number;
  filterSystemEntities: boolean;
}

export interface EntityGraphOutput {
  success: boolean;
  message: string;
  errors: string[];
  entityGraph?: any;
  totalEntities?: number;
  totalRelationships?: number;
}

// === ACTION EXECUTION HELPERS ===

export interface PowerAppsActionCall {
  actionName: string;
  input: any;
  platformUserId?: string;
  platformProxyUserId?: string;
  platformType?: string;
}

export interface PowerAppsActionResponse<T = any> {
  ActionResult: ActionResult;
  JsonOutput: T;
}

// Action names constants
export const POWER_APPS_ACTIONS = {
  GET_METADATA_SNAPSHOT: 'eg_GetMetadataSnapshot',
  COMPILE_REPORT: 'eg_CompileReport',
  EXECUTE_PAGE: 'eg_ExecutePage',
  GET_ENTITY_GRAPH: 'eg_GetEntityGraph'
} as const;

// Default action input values
export const DEFAULT_METADATA_INPUT: GetMetadataSnapshotInput = {
  includeEntities: true,
  includeAttributes: false,
  includeRelationships: false,
  filterSystemEntities: true,
  entityNames: [],
  includeOptionSets: false,
  includeOptionSetOptions: false,
  includeSolutions: false,
  uiLcid: 1033
};