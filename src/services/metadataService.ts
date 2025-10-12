import { isDynamics365 } from './dynamicsApi';
import { SelectedRelationship } from '../types';

export interface EntitySummary {
  logicalName: string;
  displayName: string;
  collectionName?: string;
  isCustom?: boolean;
}

export interface RelationshipSummary extends SelectedRelationship {}

// Fetch entities from Dynamics metadata (fallback to mock locally)
export async function fetchEntities(): Promise<EntitySummary[]> {
  if (!isDynamics365()) {
    return [
      { logicalName: 'account', displayName: 'Account' },
      { logicalName: 'contact', displayName: 'Contact' },
      { logicalName: 'opportunity', displayName: 'Opportunity' },
      { logicalName: 'eg_customentity', displayName: 'Custom Entity', isCustom: true },
    ];
  }
  try {
    const Xrm = (window as any).Xrm;
    const result = await Xrm.WebApi.retrieveMultipleRecords('EntityDefinition', '?$select=LogicalName&$filter=IsPrivate eq false');
    return (result.entities || []).map((e: any) => ({
      logicalName: e.LogicalName,
      displayName: e.DisplayName?.UserLocalizedLabel?.Label || e.LogicalName,
    }));
  } catch (e) {
    console.warn('Failed to fetch entities, falling back to minimal list', e);
    return [];
  }
}

// Fetch relationships for a specific entity
export async function fetchRelationships(entityLogicalName: string): Promise<RelationshipSummary[]> {
  if (!isDynamics365()) {
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
    return [];
  }
  try {
    const Xrm = (window as any).Xrm;
    const def = await Xrm.WebApi.retrieveRecord('EntityDefinition', entityLogicalName, '?$select=LogicalName&$expand=OneToManyRelationships($select=SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute),ManyToOneRelationships($select=SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute),ManyToManyRelationships($select=SchemaName,Entity1LogicalName,Entity2LogicalName)');

    const rels: RelationshipSummary[] = [];

    (def.OneToManyRelationships || []).forEach((r: any) => {
      rels.push({
        schemaName: r.SchemaName,
        relationshipType: 'OneToMany',
        fromEntity: r.ReferencedEntity,
        toEntity: r.ReferencingEntity,
        fromAttribute: r.ReferencedAttribute,
        toAttribute: r.ReferencingAttribute,
      });
    });
    (def.ManyToOneRelationships || []).forEach((r: any) => {
      rels.push({
        schemaName: r.SchemaName,
        relationshipType: 'ManyToOne',
        fromEntity: r.ReferencingEntity,
        toEntity: r.ReferencedEntity,
        fromAttribute: r.ReferencingAttribute,
        toAttribute: r.ReferencedAttribute,
      });
    });
    (def.ManyToManyRelationships || []).forEach((r: any) => {
      rels.push({
        schemaName: r.SchemaName,
        relationshipType: 'ManyToMany',
        fromEntity: r.Entity1LogicalName,
        toEntity: r.Entity2LogicalName,
      });
    });
    return rels;
  } catch (e) {
    console.warn('Failed to fetch relationships for', entityLogicalName, e);
    return [];
  }
}
