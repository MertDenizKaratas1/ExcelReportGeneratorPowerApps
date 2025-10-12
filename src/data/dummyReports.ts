export interface Report {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdDate: string;
  lastModified: string;
  createdBy: string;
  category: string;
  tags: string[];
  recordCount?: number;
  fileSize?: string;
  downloadCount?: number;
  nodeCount: number;
  complexity: 'simple' | 'medium' | 'complex';
  preview?: string;
  entities: string[];
}

export const DUMMY_REPORTS: Report[] = [
  {
    id: 'rpt-001',
    name: 'Customer Engagement Report',
    description: 'Comprehensive analysis of customer interactions, engagement metrics, and satisfaction scores across all touchpoints.',
    status: 'published',
    createdDate: '2024-10-01T09:00:00Z',
    lastModified: '2024-10-10T14:30:00Z',
    createdBy: 'Sarah Johnson',
    category: 'Customer Analytics',
    tags: ['customer', 'engagement', 'analytics', 'satisfaction'],
    recordCount: 15420,
    fileSize: '2.3 MB',
    downloadCount: 127,
    nodeCount: 8,
    complexity: 'medium',
    entities: ['contact', 'account', 'opportunity', 'case']
  },
  {
    id: 'rpt-002',
    name: 'Sales Performance Dashboard',
    description: 'Real-time sales metrics including revenue, conversion rates, pipeline analysis, and team performance indicators.',
    status: 'published',
    createdDate: '2024-09-15T11:20:00Z',
    lastModified: '2024-10-08T16:45:00Z',
    createdBy: 'Mike Chen',
    category: 'Sales',
    tags: ['sales', 'revenue', 'pipeline', 'performance'],
    recordCount: 8930,
    fileSize: '1.8 MB',
    downloadCount: 203,
    nodeCount: 12,
    complexity: 'complex',
    entities: ['opportunity', 'account', 'contact', 'product']
  },
  {
    id: 'rpt-003',
    name: 'Monthly Lead Generation',
    description: 'Monthly overview of lead sources, quality metrics, and conversion tracking for marketing campaigns.',
    status: 'draft',
    createdDate: '2024-10-05T13:15:00Z',
    lastModified: '2024-10-11T10:20:00Z',
    createdBy: 'Emily Rodriguez',
    category: 'Marketing',
    tags: ['leads', 'marketing', 'conversion', 'campaigns'],
    recordCount: 0,
    fileSize: '0 KB',
    downloadCount: 0,
    nodeCount: 5,
    complexity: 'simple',
    entities: ['lead', 'campaign', 'contact']
  },
  {
    id: 'rpt-004',
    name: 'Support Ticket Analysis',
    description: 'Detailed analysis of support tickets including resolution times, satisfaction ratings, and common issues.',
    status: 'published',
    createdDate: '2024-09-28T08:30:00Z',
    lastModified: '2024-10-09T12:15:00Z',
    createdBy: 'David Kim',
    category: 'Support',
    tags: ['support', 'tickets', 'resolution', 'satisfaction'],
    recordCount: 3210,
    fileSize: '945 KB',
    downloadCount: 89,
    nodeCount: 6,
    complexity: 'medium',
    entities: ['case', 'contact', 'knowledge_article']
  },
  {
    id: 'rpt-005',
    name: 'Product Inventory Summary',
    description: 'Complete inventory overview with stock levels, product performance, and reorder recommendations.',
    status: 'archived',
    createdDate: '2024-08-20T14:45:00Z',
    lastModified: '2024-09-30T17:30:00Z',
    createdBy: 'Lisa Wang',
    category: 'Inventory',
    tags: ['inventory', 'products', 'stock', 'reorder'],
    recordCount: 12750,
    fileSize: '3.1 MB',
    downloadCount: 45,
    nodeCount: 7,
    complexity: 'medium',
    entities: ['product', 'inventory_item', 'price_list']
  },
  {
    id: 'rpt-006',
    name: 'Financial Performance Q3',
    description: 'Quarterly financial report including revenue analysis, expense tracking, and profitability metrics.',
    status: 'published',
    createdDate: '2024-09-01T10:00:00Z',
    lastModified: '2024-10-05T15:20:00Z',
    createdBy: 'Robert Brown',
    category: 'Finance',
    tags: ['finance', 'revenue', 'expenses', 'quarterly'],
    recordCount: 5680,
    fileSize: '1.5 MB',
    downloadCount: 156,
    nodeCount: 15,
    complexity: 'complex',
    entities: ['opportunity', 'account', 'invoice', 'quote']
  },
  {
    id: 'rpt-007',
    name: 'Employee Performance Review',
    description: 'Annual employee performance metrics including goal achievements, training completion, and feedback scores.',
    status: 'draft',
    createdDate: '2024-10-07T09:45:00Z',
    lastModified: '2024-10-12T11:10:00Z',
    createdBy: 'Jennifer Adams',
    category: 'HR',
    tags: ['hr', 'performance', 'employees', 'review'],
    recordCount: 0,
    fileSize: '0 KB',
    downloadCount: 0,
    nodeCount: 4,
    complexity: 'simple',
    entities: ['contact', 'system_user']
  },
  {
    id: 'rpt-008',
    name: 'Market Trend Analysis',
    description: 'Comprehensive market analysis including competitor insights, industry trends, and opportunity identification.',
    status: 'published',
    createdDate: '2024-09-10T16:30:00Z',
    lastModified: '2024-10-06T13:45:00Z',
    createdBy: 'Alex Thompson',
    category: 'Market Research',
    tags: ['market', 'trends', 'competitors', 'analysis'],
    recordCount: 2450,
    fileSize: '1.2 MB',
    downloadCount: 78,
    nodeCount: 9,
    complexity: 'medium',
    entities: ['account', 'competitor', 'opportunity']
  }
];

export const REPORT_CATEGORIES = [
  'All Categories',
  'Customer Analytics',
  'Sales',
  'Marketing',
  'Support',
  'Inventory',
  'Finance',
  'HR',
  'Market Research'
];

export const REPORT_STATUSES = [
  { key: 'all', label: 'All Status', color: 'gray' },
  { key: 'draft', label: 'Draft', color: 'orange' },
  { key: 'published', label: 'Published', color: 'green' },
  { key: 'archived', label: 'Archived', color: 'gray' }
];