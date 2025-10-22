import { EnvironmentService } from './environmentService';
import { PowerAppsActionService } from './powerAppsActionService';
import { EntityMetadataInfo, GetMetadataSnapshotInput } from '../types/powerAppsTypes';
import { SelectedRelationship } from '../types';

export interface EntitySummary {
  logicalName: string;
  displayName: string;
  collectionName?: string;
  isCustom?: boolean;
  description?: string;
  primaryIdAttribute?: string;
  primaryNameAttribute?: string;
}

export interface RelationshipSummary extends SelectedRelationship {}

// Initialize environment on service load
EnvironmentService.initialize();

// Fetch entities from Power Apps metadata or return mock data locally
export async function fetchEntities(): Promise<EntitySummary[]> {
  console.log('Fetching entities from environment:', EnvironmentService.getEnvironmentType());
  
  try {
    const actionService = PowerAppsActionService.getInstance();
    
    // Call the GetMetadataSnapshot action to get entities
    const input: Partial<GetMetadataSnapshotInput> = {
      includeEntities: true,
      includeAttributes: false,
      includeRelationships: false,
      filterSystemEntities: true,
      entityNames: [], // Get all entities
      uiLcid: 1033
    };

    const response = await actionService.getMetadataSnapshot(input);
    
    if (response.ActionResult.success && response.JsonOutput.success) {
      const entities = response.JsonOutput.snapshot.entities;
      console.log(`Retrieved ${entities.length} entities from Power Apps`);
      
      return entities.map((entity: EntityMetadataInfo) => ({
        logicalName: entity.logicalName,
        displayName: entity.displayName,
        description: entity.description,
        isCustom: entity.isCustomEntity,
        primaryIdAttribute: entity.primaryIdAttribute,
        primaryNameAttribute: entity.primaryNameAttribute
      }));
    } else {
      console.error('Failed to fetch entities:', response.ActionResult.message, response.JsonOutput.errors);
      throw new Error(response.ActionResult.message || 'Failed to fetch entities');
    }
  } catch (error) {
    console.error('Error fetching entities:', error);
    
    // In local development, return mock data
    if (EnvironmentService.isLocalDevelopment()) {
      console.log('Returning mock entities for local development');
      return [
        { logicalName: 'account', displayName: 'Account', primaryIdAttribute: 'accountid', primaryNameAttribute: 'name' },
        { logicalName: 'contact', displayName: 'Contact', primaryIdAttribute: 'contactid', primaryNameAttribute: 'fullname' },
        { logicalName: 'opportunity', displayName: 'Opportunity', primaryIdAttribute: 'opportunityid', primaryNameAttribute: 'name' },
        { logicalName: 'employee', displayName: 'Employee', isCustom: true, primaryIdAttribute: 'employeeid', primaryNameAttribute: 'fullname' },
        { logicalName: 'lead', displayName: 'Lead', primaryIdAttribute: 'leadid', primaryNameAttribute: 'fullname' },
      ];
    }
    
    // Re-throw error if not in local development
    throw error;
  }
}

// Fetch specific entities by name
export async function fetchSpecificEntities(entityNames: string[]): Promise<EntitySummary[]> {
  console.log('Fetching specific entities:', entityNames);
  
  try {
    const actionService = PowerAppsActionService.getInstance();
    
    const input: Partial<GetMetadataSnapshotInput> = {
      includeEntities: true,
      includeAttributes: false,
      includeRelationships: false,
      filterSystemEntities: false, // Don't filter since we're asking for specific entities
      entityNames: entityNames,
      uiLcid: 1033
    };

    const response = await actionService.getMetadataSnapshot(input);
    
    if (response.ActionResult.success && response.JsonOutput.success) {
      const entities = response.JsonOutput.snapshot.entities;
      
      return entities.map((entity: EntityMetadataInfo) => ({
        logicalName: entity.logicalName,
        displayName: entity.displayName,
        description: entity.description,
        isCustom: entity.isCustomEntity,
        primaryIdAttribute: entity.primaryIdAttribute,
        primaryNameAttribute: entity.primaryNameAttribute
      }));
    } else {
      throw new Error(response.ActionResult.message || 'Failed to fetch specific entities');
    }
  } catch (error) {
    console.error('Error fetching specific entities:', error);
    
    // In local development, return filtered mock data
    if (EnvironmentService.isLocalDevelopment()) {
      const allMockEntities = await fetchEntities();
      return allMockEntities.filter(entity => entityNames.includes(entity.logicalName));
    }
    
    throw error;
  }
}

// Fetch entity with attributes and relationships
export async function fetchEntityDetails(entityName: string, includeAttributes = false, includeRelationships = false): Promise<EntityMetadataInfo | null> {
  console.log('Fetching entity details for:', entityName);
  
  try {
    const actionService = PowerAppsActionService.getInstance();
    
    const input: Partial<GetMetadataSnapshotInput> = {
      includeEntities: true,
      includeAttributes: includeAttributes,
      includeRelationships: includeRelationships,
      filterSystemEntities: false,
      entityNames: [entityName],
      uiLcid: 1033
    };

    const response = await actionService.getMetadataSnapshot(input);
    
    if (response.ActionResult.success && response.JsonOutput.success) {
      const entities = response.JsonOutput.snapshot.entities;
      return entities.length > 0 ? entities[0] : null;
    } else {
      throw new Error(response.ActionResult.message || 'Failed to fetch entity details');
    }
  } catch (error) {
    console.error('Error fetching entity details:', error);
    
    // In local development, return mock data
    if (EnvironmentService.isLocalDevelopment()) {
      // Return basic mock entity structure
      return {
        logicalName: entityName,
        displayName: entityName.charAt(0).toUpperCase() + entityName.slice(1),
        entityTypeCode: 1,
        primaryIdAttribute: entityName + 'id',
        primaryNameAttribute: 'name',
        ownershipType: 'UserOwned',
        isCustomEntity: entityName.startsWith('eg_') || entityName.includes('_'),
        isActivity: false,
        isIntersect: false,
        hasNotes: true,
        hasActivities: true,
        canCreateCharts: true,
        canCreateForms: true,
        canCreateViews: true,
        attributes: includeAttributes ? [] : undefined,
        relationships: includeRelationships ? [] : undefined
      };
    }
    
    throw error;
  }
}

// Fetch relationships for a specific entity (legacy method for backward compatibility)
export async function fetchRelationships(entityLogicalName: string): Promise<RelationshipSummary[]> {
  console.log('Fetching relationships for entity:', entityLogicalName);
  
  try {
    const entityDetails = await fetchEntityDetails(entityLogicalName, false, true);
    
    if (entityDetails && entityDetails.relationships) {
      return entityDetails.relationships.map(rel => ({
        schemaName: rel.schemaName,
        relationshipType: rel.relationshipType as 'OneToMany' | 'ManyToOne' | 'ManyToMany',
        fromEntity: rel.referencingEntity,
        toEntity: rel.referencedEntity,
        fromAttribute: rel.referencingAttribute,
        toAttribute: rel.referencedAttribute
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching relationships:', error);
    
    // In local development, return mock relationships
    if (EnvironmentService.isLocalDevelopment()) {
      if (entityLogicalName === 'account') {
        return [
          { schemaName: 'account_primary_contact', relationshipType: 'OneToMany', fromEntity: 'account', toEntity: 'contact', fromAttribute: 'accountid', toAttribute: 'parentcustomerid' },
          { schemaName: 'account_opportunities', relationshipType: 'OneToMany', fromEntity: 'account', toEntity: 'opportunity', fromAttribute: 'accountid', toAttribute: 'parentaccountid' },
        ];
      }
      if (entityLogicalName === 'contact') {
        return [
          { schemaName: 'contact_accounts', relationshipType: 'ManyToOne', fromEntity: 'contact', toEntity: 'account', fromAttribute: 'parentcustomerid', toAttribute: 'accountid' },
        ];
      }
      if (entityLogicalName === 'employee') {
        return [
          { schemaName: 'employee_department', relationshipType: 'ManyToOne', fromEntity: 'employee', toEntity: 'department', fromAttribute: 'departmentid', toAttribute: 'departmentid' },
          { schemaName: 'employee_orginfos', relationshipType: 'OneToMany', fromEntity: 'employee', toEntity: 'orginfo', fromAttribute: 'employeeid', toAttribute: 'employeeid' },
        ];
      }
    }
    
    return [];
  }
}

// Test connection to Power Apps
export async function testConnection(): Promise<boolean> {
  try {
    const actionService = PowerAppsActionService.getInstance();
    return await actionService.testConnection();
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

// Get environment information
export function getEnvironmentInfo() {
  return {
    type: EnvironmentService.getEnvironmentType(),
    isPowerApps: EnvironmentService.isPowerApps(),
    isDevelopment: EnvironmentService.isDevelopment(),
    canMakeWebApiCalls: EnvironmentService.canMakeWebApiCalls(),
    userContext: EnvironmentService.getCurrentUser(),
    orgContext: EnvironmentService.getOrganizationContext()
  };
}
