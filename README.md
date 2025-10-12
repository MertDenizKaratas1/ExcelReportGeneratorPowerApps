# Excel Generator Web Resource

A modern React application built with Fluent UI v9 for generating Excel reports in Power Apps/Dynamics 365.

## Features

- 📊 **Compile Reports**: Create comprehensive Excel reports with multiple data sources and worksheets
- 📄 **Execute Pages**: Generate single-page reports for specific entities
- 🗺️ **Entity Graph**: Visualize entity relationships and metadata
- 📸 **Metadata Snapshot**: Capture CRM metadata for documentation

## Tech Stack

- React 18
- TypeScript
- Fluent UI v9 (Microsoft Design System)
- Power Apps Web API integration

## Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Build for web resource deployment
npm run build:webresource
```

## Deployment as Web Resource

After building, the compiled files in `/build` should be:

1. Uploaded to Power Apps as web resources
2. Referenced in a Model-Driven App or embedded in forms

## Converting to PCF

This project is designed to be easily convertible to a PowerApps Component Framework (PCF) control:

1. Use the PCF CLI to scaffold a new control
2. Copy components from `/src/components`
3. Adapt the API service layer for PCF context
4. Update manifest with required APIs

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout/         # App layout & navigation
│   ├── CompileReport/  # Report compilation UI
│   ├── ExecutePage/    # Page execution UI
│   ├── EntityGraph/    # Entity visualization
│   └── MetadataSnapshot/ # Metadata viewer
├── services/           # API integration
│   └── dynamicsApi.ts  # Power Apps Web API wrapper
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Usage in Power Apps

The app automatically detects if it's running inside Dynamics 365 and uses the global `Xrm` object for API calls.

For local development, mock data is used.

## Actions

The app calls these custom actions in Power Apps:

- `eg_CompileReport` - Generate multi-sheet Excel reports
- `eg_ExecutePage` - Generate single page reports
- `eg_GetEntityGraph` - Retrieve entity relationship data
- `eg_GetMetadataSnapshot` - Get CRM metadata

All actions follow the pattern:
- **Inputs**: PlatformUserId, PlatformProxyUserId, PlatformType, JsonInput
- **Outputs**: ActionResult (success/error), JsonOutput (data)

## License

Internal use only
