# Excel Generator - Deployment Guide

## Overview
This guide covers deploying the Excel Generator web resource to Power Apps/Dynamics 365 and preparing for PCF conversion.

## Prerequisites

- Power Apps environment with Dynamics 365
- System Administrator or System Customizer role
- Custom actions registered in Dynamics 365:
  - `eg_CompileReport`
  - `eg_ExecutePage`
  - `eg_GetEntityGraph`
  - `eg_GetMetadataSnapshot`

## Part 1: Building the Application

### Step 1: Install Dependencies

```powershell
cd WebResource
npm install
```

### Step 2: Build for Production

```powershell
# Standard build
npm run build

# Build with web resource packaging
npm run build:webresource
```

This creates optimized files in the `build` directory.

## Part 2: Deploy to Power Apps

### Method A: Manual Upload via Power Apps Maker Portal

1. **Navigate to Solutions**
   - Go to [make.powerapps.com](https://make.powerapps.com)
   - Select your environment
   - Navigate to Solutions → Your Solution

2. **Add Web Resources**
   
   Upload the following files as web resources:

   | File | Web Resource Name | Type |
   |------|------------------|------|
   | `build/index.html` | `eg_/excelgenerator/index.html` | HTML |
   | `build/static/js/main.*.js` | `eg_/excelgenerator/js/main.js` | Script (JScript) |
   | `build/static/css/main.*.css` | `eg_/excelgenerator/css/main.css` | Style Sheet (CSS) |

   **Note:** Update the HTML file to reference the correct JS/CSS paths.

3. **Update HTML References**
   
   Edit `index.html` before upload to use web resource syntax:
   
   ```html
   <link href="$webresource:eg_/excelgenerator/css/main.css" rel="stylesheet" />
   <script src="$webresource:eg_/excelgenerator/js/main.js"></script>
   ```

4. **Publish All Customizations**

### Method B: Using Solution Packager (Advanced)

```powershell
# Export your solution
pac solution export --path .\MySolution.zip --name MySolutionName

# Extract solution
pac solution unpack --zipfile .\MySolution.zip --folder .\ExtractedSolution

# Copy web resources to WebResources folder
# Add to Solution.xml

# Repack solution
pac solution pack --zipfile .\MySolution.zip --folder .\ExtractedSolution

# Import solution
pac solution import --path .\MySolution.zip
```

## Part 3: Configure Power Apps to Use Web Resource

### Option 1: Embedded in Model-Driven App

1. **Create a Custom Page**
   - In your app, add a new screen
   - Select "Custom Page"
   - Add an HTML Web Resource control
   - Set the web resource to `eg_/excelgenerator/index.html`
   - Set dimensions (recommended: 100% width, 800px height)

2. **Add to Site Map**
   - Edit your app's site map
   - Add a new subarea
   - Type: Web Resource
   - URL: `/WebResources/eg_excelgenerator_index.html`

### Option 2: As a Dashboard Component

1. **Create a Dashboard**
   - Navigate to Dashboards
   - Create new dashboard
   - Add Web Resource component
   - Select `eg_/excelgenerator/index.html`

### Option 3: Embedded in Form

1. **Edit Entity Form**
   - Open form designer
   - Add a Section
   - Insert → Web Resource
   - Select `eg_/excelgenerator/index.html`
   - Configure properties (hide border, scrolling, etc.)

## Part 4: Register Custom Actions

### Required Actions

Each action must be registered as a Custom API or Custom Process Action:

#### 1. eg_CompileReport

**Inputs:**
- `PlatformUserId` (String)
- `PlatformProxyUserId` (String) 
- `PlatformType` (String)
- `JsonInput` (String)

**Outputs:**
- `ActionResult` (String) - JSON: `{ success: boolean, message: string }`
- `JsonOutput` (String) - JSON: Report data

**Workflow Implementation:** Links to `CompileReport` class in your assembly

#### 2. eg_ExecutePage

Same structure as above, links to `ExecutePage` class

#### 3. eg_GetEntityGraph

Same structure as above, links to `GetEntityGraph` class

#### 4. eg_GetMetadataSnapshot

Same structure as above, links to `GetMetadataSnapshot` class

### Registration Steps

1. **Using Plugin Registration Tool:**
   ```
   - Connect to your environment
   - Register New Custom API
   - Set Unique Name: eg_CompileReport
   - Binding Type: Global
   - Allowed Custom Processing: None
   - Execute Privilege Name: (leave blank for all users)
   ```

2. **Register Request/Response Parameters:**
   - Add all input/output parameters as listed above
   - Ensure types match (Edm.String)

3. **Link to Workflow Activity:**
   - In the Custom API definition
   - Set Plugin Type to your workflow activity assembly
   - Select the appropriate class (e.g., `ExcelGenerator.CompileReport`)

## Part 5: Testing

### Local Testing

```powershell
npm start
```

- Application runs on `http://localhost:3000`
- Mock data is used (no Dynamics 365 connection)
- Test all UI components and flows

### In Power Apps

1. **Open the web resource** in your app
2. **Check browser console** for any errors
3. **Test each feature:**
   - Compile Report → Should open form and call action
   - Execute Page → Should generate single page
   - Entity Graph → Should display relationships
   - Metadata Snapshot → Should show entities

4. **Verify Action Calls:**
   - Open browser DevTools → Network tab
   - Execute an action
   - Look for POST requests to `/api/data/v9.2/eg_CompileReport`
   - Check request/response payloads

## Part 6: Troubleshooting

### Common Issues

**1. "Xrm is not defined"**
- Ensure web resource is loaded inside Power Apps context
- Don't open the web resource URL directly in browser

**2. "Action not found"**
- Verify custom actions are registered
- Check action names match exactly (case-sensitive)
- Ensure actions are published

**3. "Failed to fetch"**
- Check browser console for CORS errors
- Verify user has permissions to execute actions
- Test with System Administrator role first

**4. Parameters not showing in action**
- This is the ILMerge issue we fixed
- Rebuild DLL with updated ILMerge.props
- Re-register the assembly in Plugin Registration Tool

**5. Empty response from action**
- Check trace logs in Plugin Registration Tool
- Verify JSON serialization/deserialization
- Test backend action independently

## Part 7: Converting to PCF (PowerApps Component Framework)

### Why Convert to PCF?

- Better integration with Power Apps
- First-class citizen in form/app designer
- Access to PCF-specific APIs
- Better performance and lifecycle management

### Conversion Steps

1. **Install PCF CLI:**
   ```powershell
   npm install -g pac
   pac pcf init --namespace ExcelGenerator --name ExcelGeneratorControl --template dataset
   ```

2. **Copy React Components:**
   - Copy `src/components` → `ExcelGeneratorControl/src/components`
   - Copy `src/services` → `ExcelGeneratorControl/src/services`
   - Copy `src/types` → `ExcelGeneratorControl/src/types`

3. **Update index.ts:**
   ```typescript
   import { IInputs, IOutputs } from "./generated/ManifestTypes";
   import * as React from "react";
   import * as ReactDOM from "react-dom";
   import App from "./components/App";

   export class ExcelGeneratorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
     private container: HTMLDivElement;
     private context: ComponentFramework.Context<IInputs>;

     public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement) {
       this.context = context;
       this.container = container;
     }

     public updateView(context: ComponentFramework.Context<IInputs>): void {
       ReactDOM.render(
         React.createElement(App),
         this.container
       );
     }

     public destroy(): void {
       ReactDOM.unmountComponentAtNode(this.container);
     }
   }
   ```

4. **Update ControlManifest.Input.xml:**
   ```xml
   <property name="sampleProperty" display-name-key="Property_Display_Key" description-key="Property_Desc_Key" of-type="SingleLine.Text" usage="bound" required="false" />
   ```

5. **Build PCF:**
   ```powershell
   npm run build
   msbuild /t:rebuild /restore
   ```

6. **Deploy PCF:**
   ```powershell
   pac pcf push --publisher-prefix eg
   ```

## Part 8: Security Considerations

### Permissions

- Users need Execute permission on custom actions
- Consider creating a security role specific to Excel Generator
- Apply field-level security as needed

### Data Access

- Actions execute in user context by default
- Use `PlatformProxyUserId` for impersonation if needed
- Audit action calls if handling sensitive data

## Part 9: Monitoring & Maintenance

### Logging

- Use Plugin Registration Tool to enable tracing
- Monitor trace logs for errors
- Implement custom logging in your handlers

### Performance

- Monitor action execution time
- Optimize FetchXML queries
- Consider pagination for large datasets
- Cache metadata when possible

### Updates

1. Make code changes
2. Build: `npm run build:webresource`
3. Update web resources in Power Apps
4. Publish customizations
5. Clear browser cache or force refresh (Ctrl+F5)

## Support

For issues or questions:
- Check browser console for errors
- Review trace logs in Plugin Registration Tool
- Test backend actions independently
- Verify ILMerge configuration for input/output parameters

---

**Last Updated:** October 2025  
**Version:** 1.0.0
