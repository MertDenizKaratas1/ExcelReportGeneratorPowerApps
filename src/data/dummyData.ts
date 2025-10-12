import { MetadataSnapshot, HistoryEntry } from '../types/flowTypes';

export const DUMMY_METADATA: MetadataSnapshot = {
  entities: [
    { logicalName: "employee", displayName: "Employee", primaryId: "employeeid", primaryName: "fullname" },
    { logicalName: "orginfo", displayName: "Organization Info", primaryId: "orginfoid", primaryName: "name" },
    { logicalName: "department", displayName: "Department", primaryId: "departmentid", primaryName: "name" },
    { logicalName: "performancereview", displayName: "Performance Review", primaryId: "reviewid", primaryName: "title" },
    { logicalName: "skill", displayName: "Skill", primaryId: "skillid", primaryName: "name" }
  ],
  graphs: {
    employee: {
      attributes: [
        { logicalName: "fullname", displayName: "Full Name", type: "String" },
        { logicalName: "email", displayName: "Email", type: "String" },
        { logicalName: "hiredate", displayName: "Hire Date", type: "DateTime" },
        { logicalName: "departmentid", displayName: "Department", type: "Lookup", targets: ["department"] },
        { logicalName: "statecode", displayName: "State", type: "OptionSet" }
      ],
      relationships: {
        manyToOne: [
          { 
            schemaName: "employee_department", 
            referencingAttribute: "departmentid", 
            referencedEntity: "department", 
            referencedAttribute: "departmentid", 
            displayName: "Department" 
          }
        ],
        oneToMany: [
          { 
            schemaName: "employee_orginfos", 
            referencedEntity: "orginfo", 
            referencedAttribute: "employeeid", 
            referencingAttribute: "employeeid", 
            displayName: "Organization Infos" 
          },
          { 
            schemaName: "employee_reviews", 
            referencedEntity: "performancereview", 
            referencedAttribute: "employeeid", 
            referencingAttribute: "employeeid", 
            displayName: "Performance Reviews" 
          }
        ],
        manyToMany: [
          { 
            schemaName: "employee_skill", 
            entity1: "employee", 
            entity2: "skill", 
            intersectEntity: "employee_skill" 
          }
        ]
      }
    },
    orginfo: {
      attributes: [
        { logicalName: "name", displayName: "Name", type: "String" },
        { logicalName: "type", displayName: "Type", type: "String" },
        { logicalName: "startdate", displayName: "Start Date", type: "DateTime" },
        { logicalName: "employeeid", displayName: "Employee", type: "Lookup", targets: ["employee"] }
      ],
      relationships: {
        manyToOne: [
          { 
            schemaName: "employee_orginfos", 
            referencingAttribute: "employeeid", 
            referencedEntity: "employee", 
            referencedAttribute: "employeeid", 
            displayName: "Employee" 
          }
        ],
        oneToMany: [],
        manyToMany: []
      }
    },
    department: {
      attributes: [
        { logicalName: "name", displayName: "Name", type: "String" }
      ],
      relationships: {
        manyToOne: [],
        oneToMany: [
          { 
            schemaName: "employee_department", 
            referencedEntity: "employee", 
            referencedAttribute: "departmentid", 
            referencingAttribute: "departmentid", 
            displayName: "Employees" 
          }
        ],
        manyToMany: []
      }
    },
    performancereview: {
      attributes: [
        { logicalName: "title", displayName: "Title", type: "String" },
        { logicalName: "rating", displayName: "Rating", type: "Integer" },
        { logicalName: "employeeid", displayName: "Employee", type: "Lookup", targets: ["employee"] }
      ],
      relationships: {
        manyToOne: [
          { 
            schemaName: "employee_reviews", 
            referencingAttribute: "employeeid", 
            referencedEntity: "employee", 
            referencedAttribute: "employeeid", 
            displayName: "Employee" 
          }
        ],
        oneToMany: [],
        manyToMany: []
      }
    },
    skill: {
      attributes: [
        { logicalName: "name", displayName: "Name", type: "String" }
      ],
      relationships: {
        manyToOne: [],
        oneToMany: [],
        manyToMany: [
          { 
            schemaName: "employee_skill", 
            entity1: "skill", 
            entity2: "employee", 
            intersectEntity: "employee_skill" 
          }
        ]
      }
    }
  }
};

export const DUMMY_RECORDS = {
  employee: [
    { 
      employeeid: "E1", 
      fullname: "Ada Lovelace", 
      email: "ada@contoso.com", 
      hiredate: "2019-05-01", 
      departmentid: { id: "D1", name: "R&D" }, 
      statecode: 0 
    },
    { 
      employeeid: "E2", 
      fullname: "Grace Hopper", 
      email: "grace@contoso.com", 
      hiredate: "2018-02-10", 
      departmentid: { id: "D2", name: "IT" }, 
      statecode: 0 
    }
  ],
  orginfo: [
    { orginfoid: "O1", employeeid: "E1", name: "HR", type: "Job Hiring", startdate: "2020-01-01" },
    { orginfoid: "O2", employeeid: "E1", name: "Finance", type: "Position Change", startdate: "2021-06-15" },
    { orginfoid: "O3", employeeid: "E1", name: "Safety", type: "Rotation", startdate: "2022-03-01" },
    { orginfoid: "O4", employeeid: "E2", name: "IT", type: "Position Change", startdate: "2020-04-01" }
  ],
  performancereview: [
    { reviewid: "R1", employeeid: "E1", title: "2022 Midyear", rating: 4 },
    { reviewid: "R2", employeeid: "E1", title: "2022 Annual", rating: 5 },
    { reviewid: "R3", employeeid: "E2", title: "2022 Annual", rating: 4 }
  ],
  department: [
    { departmentid: "D1", name: "R&D" },
    { departmentid: "D2", name: "IT" }
  ],
  skill: [
    { skillid: "S1", name: "C#" },
    { skillid: "S2", name: "SQL" }
  ],
  employee_skill: [
    { employeeid: "E1", skillid: "S1" },
    { employeeid: "E1", skillid: "S2" },
    { employeeid: "E2", skillid: "S2" }
  ]
};

export const DUMMY_HISTORY: HistoryEntry[] = [
  {
    runId: "R001",
    reportName: "Employee Report 2023",
    started: "2023-10-01T09:00:00Z",
    ended: "2023-10-01T09:02:30Z",
    rows: 1250,
    status: "completed"
  },
  {
    runId: "R002",
    reportName: "Department Analysis",
    started: "2023-10-02T14:30:00Z",
    ended: "2023-10-02T14:31:15Z",
    rows: 856,
    status: "completed"
  },
  {
    runId: "R003",
    reportName: "Performance Reviews Q3",
    started: "2023-10-03T11:15:00Z",
    rows: 0,
    status: "running"
  },
  {
    runId: "R004",
    reportName: "Skills Matrix",
    started: "2023-10-03T16:45:00Z",
    ended: "2023-10-03T16:46:00Z",
    rows: 423,
    status: "failed"
  }
];

export const NODE_TEMPLATES = [
  {
    type: 'entity',
    title: 'Base Entity',
    description: 'Starting table for your report',
    color: '#0078d4'
  },
  {
    type: 'filter',
    title: 'Filter',
    description: 'AND/OR conditions to filter data',
    color: '#0078d4'
  },
  {
    type: 'join',
    title: 'Join / Link',
    description: '1:N, N:1, N:N relationships',
    color: '#0078d4'
  },
  {
    type: 'transform',
    title: 'Transform',
    description: 'Computed columns (concat, math, IF)',
    color: '#8661c5'
  },
  {
    type: 'aggregate',
    title: 'Aggregate',
    description: 'SUM/AVG/MIN/MAX/COUNT operations',
    color: '#8661c5'
  },
  {
    type: 'concatenate',
    title: 'Concatenate',
    description: 'Join many child values into one string',
    color: '#8661c5'
  },
  {
    type: 'sheet',
    title: 'Sheet',
    description: 'Worksheet definition (headers, formats)',
    color: '#6c757d'
  },
  {
    type: 'pivot',
    title: 'Pivot / Matrix',
    description: 'Optional pivot table',
    color: '#8661c5'
  },
  {
    type: 'export',
    title: 'Export',
    description: 'XLSX/CSV destination',
    color: '#6c757d'
  }
];