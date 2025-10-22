import { ReportDefinition } from '../types/reportTypes';

export const SAMPLE_COMPLEX_REPORT: ReportDefinition = {
  "schemaVersion": "1.0.0",
  "id": "df6f8b9a-0d6e-4b8d-9d59-0a8a4f4b6c11",
  "name": "Employees + Orgs + Reviews (Master)",
  "description": "Main employee export with organization info (concat + child sheet) and review summary.",
  "owner": { "id": "00000000-0000-0000-0000-000000000001", "name": "Report Admin" },
  "categoryId": null,
  "tags": ["hr", "employees", "kpi"],
  "primaryEntity": "employee",
  "createdAt": "2025-10-12T09:30:00Z",
  "updatedAt": "2025-10-12T09:35:00Z",
  "reportVersion": 7,

  "security": {
    "executeAs": "caller",
    "allowedRoles": ["Report Generator"],
    "blockedEntitiesRegex": null
  },

  "parameters": [
    { "name": "OnlyActive", "type": "boolean", "default": true, "label": "Only active employees" },
    { "name": "HiredAfter", "type": "date", "default": "2018-01-01", "label": "Hire date >= ?" },
    { "name": "MaxConcat", "type": "number", "default": 5, "min": 1, "max": 50, "label": "Max orgs to list" }
  ],

  "graph": {
    "nodes": [
      {
        "id": "n_entity",
        "type": "entity",
        "data": {
          "entity": "employee",
          "attributes": ["employeeid", "fullname", "email", "hiredate", "departmentid.name"],
          "orderBy": [{ "attribute": "fullname", "desc": false }],
          "timezoneBehavior": "user"
        },
        "position": { "x": 50, "y": 50 }
      },
      {
        "id": "n_filter",
        "type": "filter",
        "data": {
          "logic": "and",
          "conditions": [
            { "attribute": "statecode", "operator": "eq", "value": 0, "label": "Active" },
            { "attribute": "hiredate", "operator": "on-or-after", "value": "@HiredAfter" }
          ],
          "groups": [
            {
              "logic": "or",
              "conditions": [
                { "attribute": "departmentid.name", "operator": "eq", "value": "R&D" },
                { "attribute": "departmentid.name", "operator": "eq", "value": "IT" }
              ]
            }
          ]
        },
        "position": { "x": 350, "y": 50 }
      },
      {
        "id": "n_link_org",
        "type": "link",
        "data": {
          "relation": {
            "direction": "oneToMany",
            "schemaName": "employee_orginfos",
            "from": "employeeid",
            "to": "employeeid",
            "target": "orginfo"
          },
          "joinType": "outer",
          "alias": "org",
          "childFilters": [],
          "childOrderBy": [{ "attribute": "startdate", "desc": true }],
          "childTop": 25,
          "childFields": ["orginfoid", "name", "type", "startdate"],
          "manyPolicy": {
            "kind": "concat",
            "field": "name",
            "delimiter": "; ",
            "orderBy": [{ "attribute": "startdate", "desc": true }],
            "top": "@MaxConcat",
            "outputAlias": "Organizations"
          }
        },
        "position": { "x": 650, "y": 50 }
      },
      {
        "id": "n_link_review",
        "type": "link",
        "data": {
          "relation": {
            "direction": "oneToMany",
            "schemaName": "employee_reviews",
            "from": "employeeid",
            "to": "employeeid",
            "target": "performancereview"
          },
          "joinType": "outer",
          "alias": "rev",
          "childFields": ["reviewid", "title", "rating", "period"],
          "manyPolicy": {
            "kind": "summarize",
            "measures": [
              { "func": "count", "alias": "ReviewCount" },
              { "func": "avg", "attribute": "rating", "alias": "AvgRating" }
            ],
            "groupByChild": []
          }
        },
        "position": { "x": 650, "y": 200 }
      },
      {
        "id": "n_link_org_childsheet",
        "type": "link",
        "data": {
          "relation": {
            "direction": "oneToMany",
            "schemaName": "employee_orginfos",
            "from": "employeeid",
            "to": "employeeid",
            "target": "orginfo"
          },
          "joinType": "outer",
          "alias": "orgAll",
          "childFields": ["orginfoid", "employeeid", "name", "type", "startdate"],
          "manyPolicy": {
            "kind": "childSheet",
            "sheetName": "OrganizationInfo",
            "columns": ["employeeid", "name", "type", "startdate"],
            "orderBy": [{ "attribute": "startdate", "desc": true }]
          }
        },
        "position": { "x": 650, "y": 350 }
      },
      {
        "id": "n_transform",
        "type": "transform",
        "data": {
          "expressions": [
            { "alias": "YearOfHire", "expr": "year(hiredate)" },
            { "alias": "EmailDomain", "expr": "rightOf(email,'@')" }
          ]
        },
        "position": { "x": 950, "y": 50 }
      },
      {
        "id": "n_sheet_main",
        "type": "sheet",
        "data": {
          "name": "Employees",
          "mode": "main",
          "columns": [
            { "key": "fullname", "title": "Employee", "width": 28 },
            { "key": "email", "title": "Email", "width": 32 },
            { "key": "YearOfHire", "title": "Hire Year", "format": "number", "width": 12, "align": "center" },
            { "key": "departmentid.name", "title": "Department", "width": 20 },
            { "key": "Organizations", "title": "Organizations (latest first)", "wrap": true, "width": 40 },
            { "key": "ReviewCount", "title": "Reviews", "format": "number", "width": 10, "align": "right" },
            { "key": "AvgRating", "title": "Avg Rating", "format": "number(1)", "width": 12, "align": "right" }
          ],
          "freeze": { "rows": 1, "columns": 1 },
          "styles": { "zebra": true, "headerBold": true, "autoFilter": true },
          "hyperlinks": { "childSheetLinks": true }
        },
        "position": { "x": 1250, "y": 150 }
      },
      {
        "id": "n_sheet_reviews",
        "type": "sheet",
        "data": {
          "name": "ReviewSummary",
          "mode": "aggregate",
          "columns": [
            { "key": "employeeid", "title": "EmployeeId", "width": 18 },
            { "key": "ReviewCount", "title": "Total Reviews", "format": "number" },
            { "key": "AvgRating", "title": "Average Rating", "format": "number(2)" }
          ]
        },
        "position": { "x": 1250, "y": 350 }
      },
      {
        "id": "n_export",
        "type": "export",
        "data": {
          "format": "xlsx",
          "layout": "multiSheet",
          "fileName": "Employees_{yyyyMMdd_HHmm}.xlsx",
          "includeMetadataSheet": true
        },
        "position": { "x": 1550, "y": 250 }
      }
    ],
    "edges": [
      { "from": "n_entity", "to": "n_filter" },
      { "from": "n_filter", "to": "n_link_org" },
      { "from": "n_filter", "to": "n_link_review" },
      { "from": "n_filter", "to": "n_transform" },
      { "from": "n_link_org", "to": "n_sheet_main" },
      { "from": "n_link_review", "to": "n_sheet_main" },
      { "from": "n_link_org_childsheet", "to": "n_sheet_main" },
      { "from": "n_transform", "to": "n_sheet_main" },
      { "from": "n_sheet_main", "to": "n_export" },
      { "from": "n_sheet_reviews", "to": "n_export" }
    ]
  },

  "layout": {
    "workbook": {
      "mode": "multiSheet",
      "sheetsOrder": ["Employees", "OrganizationInfo", "ReviewSummary"],
      "metadataSheet": { "enabled": true, "name": "_Meta" }
    }
  },

  "limits": {
    "pageSize": 5000,
    "previewRows": 100,
    "maxExpandedRows": 200000,
    "maxColumnsPerSheet": 100,
    "maxLinkDepth": 3,
    "defaultChildTop": 10
  },

  "hints": {
    "rowEstimate": { "base": 7542, "orgAvg": 3.2, "expandEstimate": 24134 },
    "warnings": ["Concatenate limited to @MaxConcat items per employee."]
  },

  "artifacts": {
    "compilerVersion": "rg-compile/1.0.0",
    "compiledAt": "2025-10-12T09:35:00Z",
    "metadataSnapshot": { "id": "snap-2025-10-12", "version": "2025.10.12-01", "lcid": 1033 },
    "primaryFetchXml": "<fetch ...> ... </fetch>",
    "aggregateFetches": {
      "n_link_review": "<fetch aggregate=\"true\" ...> ... </fetch>"
    },
    "childPlans": {
      "OrganizationInfo": {
        "targetEntity": "orginfo",
        "parentKey": "employeeid",
        "select": ["employeeid", "name", "type", "startdate"],
        "orderBy": [{ "attribute": "startdate", "desc": true }]
      }
    }
  }
};