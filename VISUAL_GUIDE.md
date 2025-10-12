# 📸 Visual Feature Guide

## 🏠 Dashboard

The main landing page with quick access to all features:

```
╔════════════════════════════════════════════════════════╗
║  Excel Generator                    🌙 [Power Apps]    ║
╠════════════════════════════════════════════════════════╣
║                                                         ║
║  Powerful report generation and metadata tools         ║
║  for Power Apps & Dynamics 365                         ║
║                                                         ║
║  ✓ Connected to Dynamics 365                          ║
║                                                         ║
║  ┌──────────────┐  ┌──────────────┐                   ║
║  │ 📊 Compile   │  │ 📄 Execute   │                   ║
║  │    Report    │  │    Page      │                   ║
║  │              │  │              │                   ║
║  │ Multi-sheet  │  │ Single-page  │                   ║
║  │ reports      │  │ reports      │                   ║
║  └──────────────┘  └──────────────┘                   ║
║                                                         ║
║  ┌──────────────┐  ┌──────────────┐                   ║
║  │ 🗺️ Entity    │  │ 🔍 Metadata  │                   ║
║  │   Graph      │  │   Snapshot   │                   ║
║  │              │  │              │                   ║
║  │ Visualize    │  │ Capture CRM  │                   ║
║  │ relationships│  │ metadata     │                   ║
║  └──────────────┘  └──────────────┘                   ║
║                                                         ║
║  Key Capabilities:                                     ║
║  ✓ Multi-Sheet Reports    ✓ Dynamic Data              ║
║  ✓ Custom Formatting      ✓ Export Options            ║
║  ✓ Relationship Mapping   ✓ Metadata Analysis         ║
╚════════════════════════════════════════════════════════╝
```

---

## 📊 Compile Report

Create comprehensive Excel reports with multiple data sources and worksheets:

```
╔════════════════════════════════════════════════════════╗
║  Compile Report                                        ║
╠════════════════════════════════════════════════════════╣
║                                                         ║
║  ┌─ Basic Settings ────────────────────────────────┐  ║
║  │                                                  │  ║
║  │  Report Name: [Monthly Sales Report_______]     │  ║
║  │  Output Format: [Excel (.xlsx) ▼]              │  ║
║  │  ☐ Include Charts                               │  ║
║  └──────────────────────────────────────────────────┘  ║
║                                                         ║
║  ┌─ Data Sources ──────────────────────── [+ Add] ┐  ║
║  │                                                  │  ║
║  │  ┌─ Accounts ──────────────────────── [Remove] ┐│  ║
║  │  │  Name: [Accounts_____________]              ││  ║
║  │  │  Entity: [account_______________]           ││  ║
║  │  │  Query: [<fetch...>                        ]││  ║
║  │  └──────────────────────────────────────────────┘│  ║
║  │                                                  │  ║
║  │  ┌─ Contacts ──────────────────────── [Remove] ┐│  ║
║  │  │  Name: [Contacts_____________]              ││  ║
║  │  │  Entity: [contact_______________]           ││  ║
║  │  │  Query: [<fetch...>                        ]││  ║
║  │  └──────────────────────────────────────────────┘│  ║
║  └──────────────────────────────────────────────────┘  ║
║                                                         ║
║  ┌─ Worksheets ─────────────────────────── [+ Add] ┐  ║
║  │                                                  │  ║
║  │  ┌─ Summary ────────────────────────── [Remove] ┐│  ║
║  │  │  Name: [Summary_____________]               ││  ║
║  │  │  Data Source: [Accounts ▼]                  ││  ║
║  │  │  ☑ Include Headers                          ││  ║
║  │  │                                             ││  ║
║  │  │  Columns (5): [+ Add Column]                ││  ║
║  │  │  [Name      ] [Email     ] [Phone   ]       ││  ║
║  │  │  [Revenue   ] [City      ]                  ││  ║
║  │  └──────────────────────────────────────────────┘│  ║
║  └──────────────────────────────────────────────────┘  ║
║                                                         ║
║  [📥 Generate Report]                                  ║
╚════════════════════════════════════════════════════════╝
```

**Features:**
- Multiple data sources (Account, Contact, etc.)
- Multiple worksheets per report
- Custom column configuration
- Chart support
- Multiple output formats (XLSX, CSV, PDF)

---

## 📄 Execute Page

Generate single-page reports for specific entities or records:

```
╔════════════════════════════════════════════════════════╗
║  Execute Page                                          ║
╠════════════════════════════════════════════════════════╣
║                                                         ║
║  Generate a single-page report for a specific          ║
║  entity or record                                      ║
║                                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  Entity Name*: [account________________]       │   ║
║  │  Record ID:    [guid-optional___________]      │   ║
║  │                                                 │   ║
║  │  Output Format: [Excel (.xlsx) ▼]             │   ║
║  │                                                 │   ║
║  │  [📥 Generate Page]                            │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ✓ Success: Generated "accounts-report.xlsx"          ║
║     with 150 records                                   ║
╚════════════════════════════════════════════════════════╝
```

**Features:**
- Quick single-entity reports
- Optional record filtering
- Automatic column detection
- Fast generation

---

## 🗺️ Entity Graph

Visualize entity relationships and explore data model:

```
╔════════════════════════════════════════════════════════╗
║  Entity Graph                                          ║
╠════════════════════════════════════════════════════════╣
║                                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  Entity Name*: [account________________]       │   ║
║  │  Max Depth:    [2___]                          │   ║
║  │                                                 │   ║
║  │  ☑ Include Attributes                          │   ║
║  │  ☑ Include Relationships                       │   ║
║  │  ☑ Filter System Entities                      │   ║
║  │                                                 │   ║
║  │  [🔍 Explore Graph]                            │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  15 Entities  │  32 Relationships  │  Depth: 2 │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ┌─ Account (account) ───────────────────────────┐   ║
║  │  Depth: 0 | Type: 1 | System                  │   ║
║  │  Attributes: 75                                │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ┌─ Contact (contact) ───────────────────────────┐   ║
║  │  Depth: 1 | Type: 2 | System                  │   ║
║  │  Attributes: 68                                │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ┌─ Opportunity (opportunity) ───────────────────┐   ║
║  │  Depth: 1 | Type: 3 | System                  │   ║
║  │  Attributes: 52                                │   ║
║  └────────────────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════╝
```

**Features:**
- Relationship mapping
- Configurable depth
- Attribute details
- System entity filtering

---

## 🔍 Metadata Snapshot

Capture comprehensive CRM metadata:

```
╔════════════════════════════════════════════════════════╗
║  Metadata Snapshot                                     ║
╠════════════════════════════════════════════════════════╣
║                                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  ☑ Include Entities                            │   ║
║  │  ☐ Include Attributes                          │   ║
║  │  ☐ Include Relationships                       │   ║
║  │  ☐ Include Option Sets                         │   ║
║  │  ☐ Include Solutions                           │   ║
║  │  ☑ Filter System Entities                      │   ║
║  │                                                 │   ║
║  │  [🔍 Capture Snapshot]                         │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │    350         │    45          │    125        │   ║
║  │ Total Entities │ Custom Entities│  Option Sets  │   ║
║  └────────────────────────────────────────────────┘   ║
║                                                         ║
║  Entities (350):                                       ║
║                                                         ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    ║
║  │  Account    │ │  Contact    │ │  Lead       │    ║
║  │  account    │ │  contact    │ │  lead       │    ║
║  │  System | 1 │ │  System | 2 │ │  System | 3 │    ║
║  └─────────────┘ └─────────────┘ └─────────────┘    ║
║                                                         ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    ║
║  │ Opportunity │ │  Quote      │ │  Order      │    ║
║  │ opportunity │ │  quote      │ │ salesorder  │    ║
║  │  System | 4 │ │  System | 5 │ │  System | 6 │    ║
║  └─────────────┘ └─────────────┘ └─────────────┘    ║
╚════════════════════════════════════════════════════════╝
```

**Features:**
- Complete metadata export
- Configurable detail level
- Entity/attribute/relationship info
- Option set definitions
- Solution information

---

## 🎨 Theme Support

The app supports both light and dark themes:

```
Light Mode:              Dark Mode:
┌──────────────┐        ┌──────────────┐
│ ☀️ Toggle    │        │ 🌙 Toggle    │
│              │        │              │
│ White/Gray   │        │ Dark/Darker  │
│ background   │        │ background   │
│              │        │              │
│ Easy on      │        │ Less eye     │
│ bright       │        │ strain       │
│ screens      │        │ at night     │
└──────────────┘        └──────────────┘
```

---

## 📱 Responsive Design

Works on all screen sizes:

```
Desktop (1920px):          Tablet (768px):        Mobile (375px):
┌─────────────────┐       ┌──────────┐           ┌─────┐
│ [Nav] │ Content │       │  [Nav]   │           │ [☰] │
│       │         │       │          │           │     │
│       │  Wide   │       │ Stacked  │           │Vert │
│       │  Grid   │       │  Cards   │           │List │
│       │         │       │          │           │     │
└─────────────────┘       └──────────┘           └─────┘
```

---

## 🔄 Loading States

```
Idle:                    Loading:                 Success:
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ [Generate]   │        │ ⏳ Loading... │        │ ✓ Success!   │
└──────────────┘        │ Please wait  │        │ File ready   │
                        └──────────────┘        └──────────────┘

Error:
┌──────────────┐
│ ✗ Error      │
│ Try again    │
└──────────────┘
```

---

## 🎯 User Flow Examples

### Generate Report Flow

```
1. Dashboard
   ↓
2. Click "Compile Report"
   ↓
3. Enter report name
   ↓
4. Add data sources
   ↓
5. Configure worksheets
   ↓
6. Click "Generate Report"
   ↓
7. Wait for processing
   ↓
8. File auto-downloads
   ↓
9. Success message shown
```

### Entity Graph Flow

```
1. Dashboard
   ↓
2. Click "Entity Graph"
   ↓
3. Enter entity name (e.g., "account")
   ↓
4. Configure options
   ↓
5. Click "Explore Graph"
   ↓
6. View relationships
   ↓
7. Explore entities
```

---

## 🎨 Color Scheme

The app uses Fluent UI's color tokens:

```
Primary:    #0078D4 (Microsoft Blue)
Success:    #107C10 (Green)
Warning:    #F7630C (Orange)
Error:      #D13438 (Red)
Neutral:    #F3F2F1 (Light Gray)
Background: #FFFFFF (White) / #1B1A19 (Dark)
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Header [Logo] [Title] [Theme Toggle]            │ 64px
├──────────┬──────────────────────────────────────┤
│          │                                       │
│  Nav     │         Main Content                 │
│  240px   │                                       │
│          │   • Dashboard                        │
│  • Home  │   • Compile Report                   │
│  • Gen   │   • Execute Page                     │
│  • Meta  │   • Entity Graph                     │
│          │   • Metadata Snapshot                │
│          │                                       │
│          │   Max width: 1200-1400px             │
│          │   Centered with padding              │
│          │                                       │
└──────────┴──────────────────────────────────────┘
```

---

## 💬 Message Examples

### Success Messages

```
✓ Report "Monthly Sales" generated successfully with 150 records!
✓ Page generated successfully: accounts-report.xlsx
✓ Found 15 entities and 32 relationships
✓ Snapshot captured: 350 entities
```

### Error Messages

```
✗ Please enter a report name
✗ Please add at least one data source
✗ Failed to generate report: Connection timeout
✗ Action not found: Verify custom actions are registered
```

### Info Messages

```
ℹ Running in Local Mode (Mock Data)
ℹ Connected to Dynamics 365
ℹ File downloaded successfully
```

---

## 🎬 Animations

The app includes smooth animations:

```
• Fade In:     Components appear smoothly
• Hover:       Cards lift on hover
• Click:       Buttons provide feedback
• Loading:     Spinner while processing
• Success:     Checkmark animation
• Navigation:  Smooth page transitions
```

---

## ♿ Accessibility

The app is fully accessible:

```
✓ Keyboard Navigation:  Tab through all controls
✓ Screen Readers:       ARIA labels on all inputs
✓ Focus Indicators:     Visible focus outlines
✓ Color Contrast:       WCAG AA compliant
✓ Alt Text:            All images described
```

---

## 🔍 Search & Filter

Future enhancement potential:

```
Search Bar:
┌──────────────────────────────────┐
│ 🔍 [Search entities...________] │
└──────────────────────────────────┘

Filters:
☑ Custom Only
☐ System Only
☐ Modified Today
```

---

This visual guide helps users understand what the application looks like and how to use each feature effectively!
