import { ReportDefinition, ReportListItem, ReportExportData } from '../types/reportTypes';

export class ReportManager {
  private static readonly STORAGE_KEY = 'excel_reports';
  private static readonly EXPORT_VERSION = '1.0.0';

  /**
   * Get all reports from local storage
   */
  static getAllReports(): ReportDefinition[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as ReportDefinition[];
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  }

  /**
   * Get report list items (lightweight version for listing)
   */
  static getReportList(): ReportListItem[] {
    const reports = this.getAllReports();
    return reports.map(report => ({
      id: report.id,
      name: report.name,
      description: report.description,
      primaryEntity: report.primaryEntity,
      tags: report.tags,
      updatedAt: report.updatedAt,
      reportVersion: report.reportVersion
    }));
  }

  /**
   * Get a specific report by ID
   */
  static getReport(id: string): ReportDefinition | null {
    const reports = this.getAllReports();
    return reports.find(report => report.id === id) || null;
  }

  /**
   * Save a report (create or update)
   */
  static saveReport(report: ReportDefinition): void {
    const reports = this.getAllReports();
    const existingIndex = reports.findIndex(r => r.id === report.id);
    
    // Update timestamps
    const now = new Date().toISOString();
    report.updatedAt = now;
    
    if (existingIndex >= 0) {
      // Update existing
      reports[existingIndex] = report;
    } else {
      // Create new
      report.createdAt = now;
      reports.push(report);
    }

    this.saveAllReports(reports);
  }

  /**
   * Delete a report
   */
  static deleteReport(id: string): boolean {
    const reports = this.getAllReports();
    const filteredReports = reports.filter(report => report.id !== id);
    
    if (filteredReports.length < reports.length) {
      this.saveAllReports(filteredReports);
      return true;
    }
    return false;
  }

  /**
   * Duplicate a report with a new ID
   */
  static duplicateReport(id: string, newName?: string): ReportDefinition | null {
    const original = this.getReport(id);
    if (!original) return null;

    const duplicate: ReportDefinition = {
      ...original,
      id: `${original.id}-copy-${Date.now()}`,
      name: newName || `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportVersion: 1
    };

    this.saveReport(duplicate);
    return duplicate;
  }

  /**
   * Export reports to JSON file
   */
  static exportReports(reportIds?: string[]): void {
    const allReports = this.getAllReports();
    const reportsToExport = reportIds 
      ? allReports.filter(report => reportIds.includes(report.id))
      : allReports;

    const exportData: ReportExportData = {
      version: this.EXPORT_VERSION,
      reports: reportsToExport,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Excel Generator User'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `excel-reports-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Import reports from JSON file
   */
  static async importReports(file: File): Promise<{ success: number; errors: string[] }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string) as ReportExportData;
          const errors: string[] = [];
          let successCount = 0;

          // Validate import data structure
          if (!importData.reports || !Array.isArray(importData.reports)) {
            errors.push('Invalid import file format');
            resolve({ success: 0, errors });
            return;
          }

          // Import each report
          importData.reports.forEach((report, index) => {
            try {
              // Validate required fields
              if (!report.id || !report.name || !report.schemaVersion) {
                errors.push(`Report ${index + 1}: Missing required fields`);
                return;
              }

              // Check for conflicts and handle duplicates
              const existing = this.getReport(report.id);
              if (existing) {
                // Generate new ID for duplicate
                report.id = `${report.id}-imported-${Date.now()}`;
                report.name = `${report.name} (Imported)`;
              }

              // Reset timestamps
              const now = new Date().toISOString();
              report.createdAt = now;
              report.updatedAt = now;
              report.reportVersion = 1;

              this.saveReport(report);
              successCount++;
            } catch (error) {
              errors.push(`Report ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          });

          resolve({ success: successCount, errors });
        } catch (error) {
          resolve({ success: 0, errors: ['Failed to parse import file'] });
        }
      };

      reader.onerror = () => {
        resolve({ success: 0, errors: ['Failed to read file'] });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Search reports by name, description, or tags
   */
  static searchReports(query: string): ReportListItem[] {
    const reports = this.getReportList();
    const lowerQuery = query.toLowerCase();

    return reports.filter(report => 
      report.name.toLowerCase().includes(lowerQuery) ||
      report.description.toLowerCase().includes(lowerQuery) ||
      report.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      report.primaryEntity.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get reports by primary entity
   */
  static getReportsByEntity(entity: string): ReportListItem[] {
    const reports = this.getReportList();
    return reports.filter(report => report.primaryEntity === entity);
  }

  /**
   * Get reports by tag
   */
  static getReportsByTag(tag: string): ReportListItem[] {
    const reports = this.getReportList();
    return reports.filter(report => report.tags.includes(tag));
  }

  /**
   * Get all unique tags across all reports
   */
  static getAllTags(): string[] {
    const reports = this.getAllReports();
    const tagSet = new Set<string>();
    
    reports.forEach(report => {
      report.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }

  /**
   * Get all unique entities across all reports
   */
  static getAllEntities(): string[] {
    const reports = this.getAllReports();
    const entitySet = new Set<string>();
    
    reports.forEach(report => {
      entitySet.add(report.primaryEntity);
    });
    
    return Array.from(entitySet).sort();
  }

  /**
   * Generate a unique report ID
   */
  static generateReportId(): string {
    return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate a report definition
   */
  static validateReport(report: ReportDefinition): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!report.id) errors.push('Report ID is required');
    if (!report.name) errors.push('Report name is required');
    if (!report.schemaVersion) errors.push('Schema version is required');
    if (!report.primaryEntity) errors.push('Primary entity is required');

    // Graph validation
    if (!report.graph || !report.graph.nodes || report.graph.nodes.length === 0) {
      errors.push('Report must have at least one node');
    }

    // Check for entity nodes
    const entityNodes = report.graph?.nodes?.filter(n => n.type === 'entity') || [];
    if (entityNodes.length === 0) {
      errors.push('Report must have at least one entity node');
    }

    // Check for orphaned edges
    if (report.graph?.edges) {
      const nodeIds = new Set(report.graph.nodes.map(n => n.id));
      report.graph.edges.forEach(edge => {
        if (!nodeIds.has(edge.from)) {
          errors.push(`Edge references unknown source node: ${edge.from}`);
        }
        if (!nodeIds.has(edge.to)) {
          errors.push(`Edge references unknown target node: ${edge.to}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Save all reports to local storage
   */
  private static saveAllReports(reports: ReportDefinition[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports:', error);
      throw new Error('Failed to save reports to local storage');
    }
  }

  /**
   * Create a new empty report with basic structure
   */
  static createNewReport(name: string, primaryEntity: string): ReportDefinition {
    const now = new Date().toISOString();
    
    return {
      schemaVersion: "1.0.0",
      id: this.generateReportId(),
      name,
      description: "",
      owner: { id: "current-user", name: "Current User" },
      categoryId: null,
      tags: [],
      primaryEntity,
      createdAt: now,
      updatedAt: now,
      reportVersion: 1,

      security: {
        executeAs: "caller",
        allowedRoles: ["Report Generator"],
        blockedEntitiesRegex: null
      },

      parameters: [],

      graph: {
        nodes: [],
        edges: []
      },

      layout: {
        workbook: {
          mode: "singleSheet",
          sheetsOrder: []
        }
      },

      limits: {
        pageSize: 5000,
        previewRows: 100,
        maxExpandedRows: 200000,
        maxColumnsPerSheet: 100,
        maxLinkDepth: 3,
        defaultChildTop: 10
      },

      hints: {
        rowEstimate: { base: 0, expandEstimate: 0 },
        warnings: []
      }
    };
  }

  /**
   * Get statistics about all reports
   */
  static getReportStatistics() {
    const reports = this.getAllReports();
    const entities = this.getAllEntities();
    const tags = this.getAllTags();

    return {
      totalReports: reports.length,
      totalEntities: entities.length,
      totalTags: tags.length,
      lastUpdated: reports.length > 0 
        ? Math.max(...reports.map(r => new Date(r.updatedAt).getTime()))
        : null,
      entityBreakdown: entities.map(entity => ({
        entity,
        count: reports.filter(r => r.primaryEntity === entity).length
      }))
    };
  }
}