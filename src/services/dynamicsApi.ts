// ============================================================================
// DYNAMICS 365 WEB API SERVICE
// Handles all communication with Power Apps custom actions
// ============================================================================

import {
  ActionResponse,
  ActionResult,
  CompileReportInput,
  CompileReportOutput,
  ExecutePageInput,
  ExecutePageOutput,
  GetEntityGraphInput,
  EntityGraphOutput,
  GetMetadataSnapshotInput,
  MetadataSnapshotOutput,
} from '../types';

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

/**
 * Check if running inside Dynamics 365
 */
export const isDynamics365 = (): boolean => {
  return typeof (window as any).Xrm !== 'undefined';
};

/**
 * Get current user ID from Dynamics context
 */
export const getCurrentUserId = (): string | undefined => {
  if (!isDynamics365()) return undefined;
  try {
    const context = (window as any).Xrm.Utility.getGlobalContext();
    return context.userSettings.userId.replace(/[{}]/g, '');
  } catch (error) {
    console.warn('Failed to get current user ID:', error);
    return undefined;
  }
};

// ============================================================================
// ACTION EXECUTION
// ============================================================================

interface ExecuteActionOptions {
  actionName: string;
  jsonInput: any;
  platformUserId?: string;
  platformProxyUserId?: string;
  platformType?: string;
}

/**
 * Execute a custom action in Dynamics 365
 */
async function executeAction<TOutput>(
  options: ExecuteActionOptions
): Promise<ActionResponse<TOutput>> {
  const {
    actionName,
    jsonInput,
    platformUserId,
    platformProxyUserId,
    platformType = 'PowerApps',
  } = options;

  // For local development, return mock data
  if (!isDynamics365()) {
    console.warn('⚠️ Running in local mode - returning mock data');
    return getMockResponse<TOutput>(actionName);
  }

  try {
    const Xrm = (window as any).Xrm;

    // Show progress indicator
    if (Xrm.Utility.showProgressIndicator) {
      Xrm.Utility.showProgressIndicator('Processing...');
    }

    // Build the request object
    const request = {
      JsonInput: JSON.stringify(jsonInput),
      PlatformUserId: platformUserId || getCurrentUserId() || '',
      PlatformProxyUserId: platformProxyUserId || '',
      PlatformType: platformType,

      getMetadata: () => ({
        boundParameter: null,
        parameterTypes: {
          JsonInput: {
            typeName: 'Edm.String',
            structuralProperty: 1,
          },
          PlatformUserId: {
            typeName: 'Edm.String',
            structuralProperty: 1,
          },
          PlatformProxyUserId: {
            typeName: 'Edm.String',
            structuralProperty: 1,
          },
          PlatformType: {
            typeName: 'Edm.String',
            structuralProperty: 1,
          },
        },
        operationName: actionName,
        operationType: 0, // Action
      }),
    };

    // Execute the action
    const response = await Xrm.WebApi.online.execute(request);

    // Close progress indicator
    if (Xrm.Utility.closeProgressIndicator) {
      Xrm.Utility.closeProgressIndicator();
    }

    // Check HTTP status
    if (!response.ok) {
      throw new Error(`Action call failed (HTTP ${response.status})`);
    }

    // Parse response body
    const body = await response.json();

    // Parse ActionResult
    let actionResult: ActionResult = { success: true };
    if (body.ActionResult) {
      try {
        actionResult = JSON.parse(body.ActionResult);
      } catch (e) {
        console.warn('Failed to parse ActionResult:', e);
      }
    }

    // Check business-level success
    if (!actionResult.success) {
      return {
        success: false,
        message: actionResult.message || 'Action failed',
      };
    }

    // Parse JsonOutput
    let data: TOutput | undefined;
    if (body.JsonOutput) {
      try {
        data = JSON.parse(body.JsonOutput);
      } catch (e) {
        console.warn('Failed to parse JsonOutput:', e);
      }
    }

    return {
      success: true,
      message: actionResult.message,
      data,
    };
  } catch (error: any) {
    // Close progress indicator on error
    if ((window as any).Xrm?.Utility?.closeProgressIndicator) {
      (window as any).Xrm.Utility.closeProgressIndicator();
    }

    console.error(`❌ Error executing action ${actionName}:`, error);

    return {
      success: false,
      message: error.message || 'Unexpected error occurred',
    };
  }
}

// ============================================================================
// PUBLIC API METHODS
// ============================================================================

/**
 * Compile a comprehensive Excel report with multiple worksheets
 */
export async function compileReport(
  input: CompileReportInput,
  options?: { userId?: string; proxyUserId?: string }
): Promise<ActionResponse<CompileReportOutput>> {
  return executeAction<CompileReportOutput>({
    actionName: 'eg_CompileReport',
    jsonInput: input,
    platformUserId: options?.userId,
    platformProxyUserId: options?.proxyUserId,
  });
}

/**
 * Execute a single-page report for a specific entity
 */
export async function executePage(
  input: ExecutePageInput,
  options?: { userId?: string; proxyUserId?: string }
): Promise<ActionResponse<ExecutePageOutput>> {
  return executeAction<ExecutePageOutput>({
    actionName: 'eg_ExecutePage',
    jsonInput: input,
    platformUserId: options?.userId,
    platformProxyUserId: options?.proxyUserId,
  });
}

/**
 * Get entity relationship graph
 */
export async function getEntityGraph(
  input: GetEntityGraphInput,
  options?: { userId?: string; proxyUserId?: string }
): Promise<ActionResponse<EntityGraphOutput>> {
  return executeAction<EntityGraphOutput>({
    actionName: 'eg_GetEntityGraph',
    jsonInput: input,
    platformUserId: options?.userId,
    platformProxyUserId: options?.proxyUserId,
  });
}

/**
 * Get comprehensive metadata snapshot
 */
export async function getMetadataSnapshot(
  input: GetMetadataSnapshotInput,
  options?: { userId?: string; proxyUserId?: string }
): Promise<ActionResponse<MetadataSnapshotOutput>> {
  return executeAction<MetadataSnapshotOutput>({
    actionName: 'eg_GetMetadataSnapshot',
    jsonInput: input,
    platformUserId: options?.userId,
    platformProxyUserId: options?.proxyUserId,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Download a file from base64 content
 */
export function downloadFile(
  content: string,
  fileName: string,
  mimeType: string
): void {
  try {
    // Handle data URLs
    const base64Data = content.startsWith('data:')
      ? content.split(',')[1]
      : content;

    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`✅ Downloaded: ${fileName}`);
  } catch (error) {
    console.error('❌ Failed to download file:', error);
    throw new Error('Failed to download file');
  }
}

// ============================================================================
// MOCK DATA FOR LOCAL DEVELOPMENT
// ============================================================================

function getMockResponse<T>(actionName: string): ActionResponse<T> {
  console.log(`🔧 Mock response for: ${actionName}`);

  const mockData: Record<string, any> = {
    eg_CompileReport: {
      reportId: 'mock-report-123',
      fileName: 'sample-report.xlsx',
      fileContent: 'UEsDBBQABg...[mock base64]',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      recordCount: 150,
    },
    eg_ExecutePage: {
      pageId: 'mock-page-456',
      fileName: 'sample-page.xlsx',
      fileContent: 'UEsDBBQABg...[mock base64]',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      recordCount: 25,
    },
    eg_GetEntityGraph: {
      entities: [
        {
          logicalName: 'account',
          displayName: 'Account',
          objectTypeCode: 1,
          primaryIdAttribute: 'accountid',
          primaryNameAttribute: 'name',
          depth: 0,
          isCustomEntity: false,
        },
        {
          logicalName: 'contact',
          displayName: 'Contact',
          objectTypeCode: 2,
          primaryIdAttribute: 'contactid',
          primaryNameAttribute: 'fullname',
          depth: 1,
          isCustomEntity: false,
        },
      ],
      relationships: [
        {
          schemaName: 'account_primary_contact',
          relationshipType: 'OneToMany',
          entity1LogicalName: 'account',
          entity2LogicalName: 'contact',
          entity1NavigationProperty: 'contact_customer_accounts',
          entity2NavigationProperty: 'parentcustomerid_account',
          isCustomRelationship: false,
        },
      ],
      metadata: {
        rootEntity: 'account',
        totalEntities: 2,
        totalRelationships: 1,
        maxDepth: 1,
        generatedAt: new Date().toISOString(),
      },
    },
    eg_GetMetadataSnapshot: {
      entities: [
        {
          logicalName: 'account',
          displayName: 'Account',
          displayCollectionName: 'Accounts',
          schemaName: 'Account',
          objectTypeCode: 1,
          primaryIdAttribute: 'accountid',
          primaryNameAttribute: 'name',
          isCustomEntity: false,
          isActivity: false,
          ownershipType: 'UserOwned',
        },
      ],
      optionSets: [],
      solutions: [],
      metadata: {
        organizationId: 'mock-org-123',
        organizationName: 'Mock Organization',
        organizationVersion: '9.2.0.0',
        totalEntities: 350,
        customEntities: 25,
        snapshotDate: new Date().toISOString(),
        lcid: 1033,
      },
    },
  };

  return {
    success: true,
    message: 'Mock data returned successfully (local mode)',
    data: mockData[actionName] as T,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

const dynamicsApi = {
  compileReport,
  executePage,
  getEntityGraph,
  getMetadataSnapshot,
  downloadFile,
  isDynamics365,
  getCurrentUserId,
};

export default dynamicsApi;
