import { EnvironmentService } from './environmentService';
import {
  PowerAppsActionResponse,
  ActionResult,
  GetMetadataSnapshotInput,
  GetMetadataSnapshotOutput,
  CompileReportInput,
  CompileReportOutput,
  ExecutePageInput,
  ExecutePageOutput,
  GetEntityGraphInput,
  EntityGraphOutput,
  POWER_APPS_ACTIONS,
  DEFAULT_METADATA_INPUT
} from '../types/powerAppsTypes';

/**
 * Service for calling Power Apps actions
 * Handles both Power Apps environment and local development mode
 */
export class PowerAppsActionService {
  private static _instance: PowerAppsActionService;

  static getInstance(): PowerAppsActionService {
    if (!this._instance) {
      this._instance = new PowerAppsActionService();
    }
    return this._instance;
  }

  /**
   * Execute a Power Apps action
   */
  async executeAction<TInput, TOutput>(
    actionName: string,
    input: TInput,
    options?: {
      timeout?: number;
      retries?: number;
    }
  ): Promise<PowerAppsActionResponse<TOutput>> {
    console.log(`Executing action: ${actionName}`, { input, environment: EnvironmentService.getEnvironmentType() });

    if (EnvironmentService.isPowerApps()) {
      return this.executePowerAppsAction<TInput, TOutput>(actionName, input, options);
    } else {
      return this.executeLocalAction<TInput, TOutput>(actionName, input);
    }
  }

  /**
   * Get metadata snapshot (entities, attributes, relationships)
   */
  async getMetadataSnapshot(
    input: Partial<GetMetadataSnapshotInput> = {}
  ): Promise<PowerAppsActionResponse<GetMetadataSnapshotOutput>> {
    const fullInput: GetMetadataSnapshotInput = {
      ...DEFAULT_METADATA_INPUT,
      ...input
    };

    return this.executeAction<GetMetadataSnapshotInput, GetMetadataSnapshotOutput>(
      POWER_APPS_ACTIONS.GET_METADATA_SNAPSHOT,
      fullInput
    );
  }

  /**
   * Compile a report definition
   */
  async compileReport(input: CompileReportInput): Promise<PowerAppsActionResponse<CompileReportOutput>> {
    return this.executeAction<CompileReportInput, CompileReportOutput>(
      POWER_APPS_ACTIONS.COMPILE_REPORT,
      input
    );
  }

  /**
   * Execute a page/report
   */
  async executePage(input: ExecutePageInput): Promise<PowerAppsActionResponse<ExecutePageOutput>> {
    return this.executeAction<ExecutePageInput, ExecutePageOutput>(
      POWER_APPS_ACTIONS.EXECUTE_PAGE,
      input
    );
  }

  /**
   * Get entity relationship graph
   */
  async getEntityGraph(input: GetEntityGraphInput): Promise<PowerAppsActionResponse<EntityGraphOutput>> {
    return this.executeAction<GetEntityGraphInput, EntityGraphOutput>(
      POWER_APPS_ACTIONS.GET_ENTITY_GRAPH,
      input
    );
  }

  /**
   * Execute action in Power Apps environment using Xrm.WebApi
   */
  private async executePowerAppsAction<TInput, TOutput>(
    actionName: string,
    input: TInput,
    options?: { timeout?: number; retries?: number }
  ): Promise<PowerAppsActionResponse<TOutput>> {
    const xrm = EnvironmentService.getXrm();
    
    if (!xrm || !xrm.WebApi) {
      throw new Error('Xrm.WebApi is not available. Make sure you are running in Power Apps environment.');
    }

    try {
      // Get current user context for action inputs
      const userContext = EnvironmentService.getCurrentUser();
      
      // Prepare action request with proper metadata function
      const actionRequest = {
        PlatformUserId: userContext?.userId || '',
        PlatformProxyUserId: '',
        PlatformType: 'WebResource',
        JsonInput: JSON.stringify(input),
        getMetadata: () => {
          return {
            parameterTypes: {
              PlatformUserId: {
                typeName: "Edm.String",
                structuralProperty: 1,
              },
              PlatformProxyUserId: {
                typeName: "Edm.String",
                structuralProperty: 1,
              },
              PlatformType: {
                typeName: "Edm.String",
                structuralProperty: 1,
              },
              JsonInput: {
                typeName: "Edm.String",
                structuralProperty: 1,
              },
            },
            operationType: 0,
            boundParameter: null,
            operationName: actionName,
          };
        }
      } as any;

      console.log(`Calling Power Apps action: ${actionName}`, actionRequest);

      // Execute the action using Xrm.WebApi
      const executeResult = await xrm.WebApi.online.execute(actionRequest);

      if (executeResult.ok) {
        const apiResult = await executeResult.json();
        console.log(`Action response:`, apiResult);

        if (apiResult.ActionResult) {
          const actionResult: ActionResult = JSON.parse(apiResult.ActionResult);
          
          if (!actionResult.success) {
            throw new Error(actionResult.message || 'Action execution failed');
          }
          
          // Parse JsonOutput if it exists
          let jsonOutput: TOutput = {} as TOutput;
          if (apiResult.JsonOutput) {
            jsonOutput = JSON.parse(apiResult.JsonOutput);
          }

          return {
            ActionResult: actionResult,
            JsonOutput: jsonOutput
          };
        } else {
          throw new Error('ActionResult not found in response');
        }
      } else {
        throw new Error('Execute request failed');
      }

    } catch (error) {
      console.error(`Error executing Power Apps action ${actionName}:`, error);
      
      // Return error response
      return {
        ActionResult: {
          code: -1,
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          success: false
        },
        JsonOutput: {} as TOutput
      };
    }
  }

  /**
   * Execute action in local development mode (return mock data)
   */
  private async executeLocalAction<TInput, TOutput>(
    actionName: string,
    input: TInput
  ): Promise<PowerAppsActionResponse<TOutput>> {
    console.log(`Executing local mock action: ${actionName}`, input);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (actionName) {
      case POWER_APPS_ACTIONS.GET_METADATA_SNAPSHOT:
        return this.getMockMetadataSnapshot() as PowerAppsActionResponse<TOutput>;
      
      case POWER_APPS_ACTIONS.COMPILE_REPORT:
        return this.getMockCompileReport() as PowerAppsActionResponse<TOutput>;
      
      case POWER_APPS_ACTIONS.EXECUTE_PAGE:
        return this.getMockExecutePage() as PowerAppsActionResponse<TOutput>;
      
      case POWER_APPS_ACTIONS.GET_ENTITY_GRAPH:
        return this.getMockEntityGraph() as PowerAppsActionResponse<TOutput>;
      
      default:
        return {
          ActionResult: {
            code: -1,
            message: `Unknown action: ${actionName}`,
            success: false
          },
          JsonOutput: {} as TOutput
        };
    }
  }

  /**
   * Mock metadata snapshot for local development
   */
  private getMockMetadataSnapshot(): PowerAppsActionResponse<GetMetadataSnapshotOutput> {
    return {
      ActionResult: {
        code: 0,
        message: null,
        success: true
      },
      JsonOutput: {
        success: true,
        message: "Metadata snapshot retrieved successfully.",
        errors: [],
        snapshot: {
          snapshotId: "mock-snapshot-" + Date.now(),
          createdDate: new Date().toISOString(),
          entities: [
            {
              logicalName: "account",
              displayName: "Account",
              description: "Business that represents a customer or potential customer.",
              entityTypeCode: 1,
              primaryIdAttribute: "accountid",
              primaryNameAttribute: "name",
              ownershipType: "UserOwned",
              isCustomEntity: false,
              isActivity: false,
              isIntersect: false,
              hasNotes: true,
              hasActivities: true,
              canCreateCharts: true,
              canCreateForms: true,
              canCreateViews: true
            },
            {
              logicalName: "contact",
              displayName: "Contact",
              description: "Person with whom a business unit has a relationship.",
              entityTypeCode: 2,
              primaryIdAttribute: "contactid",
              primaryNameAttribute: "fullname",
              ownershipType: "UserOwned",
              isCustomEntity: false,
              isActivity: false,
              isIntersect: false,
              hasNotes: true,
              hasActivities: true,
              canCreateCharts: true,
              canCreateForms: true,
              canCreateViews: true
            },
            {
              logicalName: "opportunity",
              displayName: "Opportunity",
              description: "Potential revenue-generating event or sale to an account.",
              entityTypeCode: 3,
              primaryIdAttribute: "opportunityid",
              primaryNameAttribute: "name",
              ownershipType: "UserOwned",
              isCustomEntity: false,
              isActivity: false,
              isIntersect: false,
              hasNotes: true,
              hasActivities: true,
              canCreateCharts: true,
              canCreateForms: true,
              canCreateViews: true
            },
            {
              logicalName: "employee",
              displayName: "Employee",
              description: "Custom entity for employee information.",
              entityTypeCode: 10000,
              primaryIdAttribute: "employeeid",
              primaryNameAttribute: "fullname",
              ownershipType: "UserOwned",
              isCustomEntity: true,
              isActivity: false,
              isIntersect: false,
              hasNotes: true,
              hasActivities: true,
              canCreateCharts: true,
              canCreateForms: true,
              canCreateViews: true
            },
            {
              logicalName: "lead",
              displayName: "Lead",
              description: "Prospect or potential sales opportunity.",
              entityTypeCode: 4,
              primaryIdAttribute: "leadid",
              primaryNameAttribute: "fullname",
              ownershipType: "UserOwned",
              isCustomEntity: false,
              isActivity: false,
              isIntersect: false,
              hasNotes: true,
              hasActivities: true,
              canCreateCharts: true,
              canCreateForms: true,
              canCreateViews: true
            }
          ],
          optionSets: [],
          solutions: []
        },
        totalEntities: 5,
        totalOptionSets: 0,
        totalSolutions: 0
      }
    };
  }

  /**
   * Mock compile report for local development
   */
  private getMockCompileReport(): PowerAppsActionResponse<CompileReportOutput> {
    return {
      ActionResult: {
        code: 0,
        message: null,
        success: true
      },
      JsonOutput: {
        success: true,
        message: "Report compiled successfully.",
        errors: [],
        warnings: ["This is a mock response in local development mode."],
        estimatedRows: 1000,
        estimatedExecutionTime: 5000
      }
    };
  }

  /**
   * Mock execute page for local development
   */
  private getMockExecutePage(): PowerAppsActionResponse<ExecutePageOutput> {
    return {
      ActionResult: {
        code: 0,
        message: null,
        success: true
      },
      JsonOutput: {
        success: true,
        message: "Report executed successfully.",
        errors: [],
        warnings: [],
        fileName: "MockReport.xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        rowCount: 150,
        executionTime: 2500
      }
    };
  }

  /**
   * Mock entity graph for local development
   */
  private getMockEntityGraph(): PowerAppsActionResponse<EntityGraphOutput> {
    return {
      ActionResult: {
        code: 0,
        message: null,
        success: true
      },
      JsonOutput: {
        success: true,
        message: "Entity graph retrieved successfully.",
        errors: [],
        totalEntities: 1,
        totalRelationships: 5
      }
    };
  }

  /**
   * Test connection to Power Apps
   */
  async testConnection(): Promise<boolean> {
    try {
      if (EnvironmentService.isPowerApps()) {
        // Try to get a simple metadata snapshot to test the connection
        const response = await this.getMetadataSnapshot({
          includeEntities: true,
          entityNames: [], // Get just a few entities to test
          includeAttributes: false,
          includeRelationships: false
        });

        return response.ActionResult.success;
      } else {
        // In local mode, always return true
        return true;
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}