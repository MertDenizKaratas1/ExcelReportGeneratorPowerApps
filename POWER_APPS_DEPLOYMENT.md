# Power Apps Web Resource Deployment Guide

## 📋 Overview

This guide will help you deploy the Flow-Based Excel Report Builder as a web resource in Power Apps.

## 🏗️ Build Files Structure

After running `npm run build`, you have these production files:

```
build/
├── index.html              # Main HTML entry point
├── asset-manifest.json     # Build manifest
└── static/
    ├── css/
    │   ├── main.9e717377.css     # Compiled CSS
    │   └── main.9e717377.css.map # CSS source map
    └── js/
        ├── main.292a869f.js      # Compiled JavaScript
        ├── main.292a869f.js.map  # JS source map
        └── main.292a869f.js.LICENSE.txt # License info
```

## 🚀 Deployment Methods

### Method 1: Power Platform CLI (Recommended)

1. **Install Power Platform CLI**
   ```bash
   npm install -g @microsoft/powerplatform-cli
   ```

2. **Authenticate**
   ```bash
   pac auth create --url https://[your-environment].crm.dynamics.com
   ```

3. **Create Web Resources**
   ```bash
   # Create HTML web resource
   pac webresource create --path "build/index.html" --name "flow_excel_generator_html" --display-name "Flow Excel Generator HTML"
   
   # Create CSS web resource
   pac webresource create --path "build/static/css/main.9e717377.css" --name "flow_excel_generator_css" --display-name "Flow Excel Generator CSS"
   
   # Create JS web resource
   pac webresource create --path "build/static/js/main.292a869f.js" --name "flow_excel_generator_js" --display-name "Flow Excel Generator JS"
   ```

### Method 2: Power Apps Portal (Manual Upload)

1. **Access Power Apps**
   - Go to [make.powerapps.com](https://make.powerapps.com)
   - Select your environment

2. **Navigate to Solutions**
   - Go to Solutions → Select your solution (or create new)
   - Click "Add existing" → "More" → "Web resource"

3. **Upload Main HTML File**
   - Click "New web resource"
   - Name: `flow_excel_generator_html`
   - Display name: `Flow Excel Generator HTML`
   - Type: `Webpage (HTML)`
   - Upload: `build/index.html`
   - **IMPORTANT**: Edit the HTML to fix resource paths (see below)

4. **Upload CSS File**
   - Name: `flow_excel_generator_css`
   - Type: `Style Sheet (CSS)`
   - Upload: `build/static/css/main.9e717377.css`

5. **Upload JavaScript File**
   - Name: `flow_excel_generator_js`
   - Type: `Script (JScript)`
   - Upload: `build/static/js/main.292a869f.js`

## 🔧 Important Configuration Steps

### 1. Fix Resource Paths in HTML

The built HTML file references resources with absolute paths. You need to update the paths to reference the web resources:

**Original HTML paths:**
```html
<script defer="defer" src="/static/js/main.292a869f.js"></script>
<link href="/static/css/main.9e717377.css" rel="stylesheet">
```

**Updated for Power Apps:**
```html
<script defer="defer" src="flow_excel_generator_js"></script>
<link href="flow_excel_generator_css" rel="stylesheet">
```

### 2. Configure Content Security Policy (CSP)

Power Apps has strict CSP. You may need to:

1. **Add script-src for inline scripts**
2. **Add style-src for inline styles**
3. **Configure for external APIs if needed**

### 3. Test the Web Resource

1. **Preview in Power Apps**
   - Go to your web resource
   - Click "Preview" to test functionality

2. **Embed in Model-Driven App**
   - Add to a form as an iframe
   - Configure parameters as needed

## 🌐 Web Resource URLs

After deployment, your web resources will be accessible at:

```
https://[org].crm.dynamics.com/WebResources/flow_excel_generator_html
https://[org].crm.dynamics.com/WebResources/flow_excel_generator_css
https://[org].crm.dynamics.com/WebResources/flow_excel_generator_js
```

## 🔒 Security Considerations

1. **CSP Compliance**: Ensure all scripts comply with Power Apps CSP
2. **API Calls**: Configure proper CORS for external API calls
3. **Data Access**: Use Dynamics 365 Web API for data operations
4. **Authentication**: Leverage Power Apps authentication context

## 🐛 Troubleshooting

### Common Issues:

1. **404 Errors**: Check resource name casing and paths
2. **CSP Violations**: Review and fix inline scripts/styles
3. **Loading Issues**: Verify all dependencies are uploaded
4. **API Errors**: Check CORS configuration and authentication

### Debug Steps:

1. Open browser developer tools
2. Check console for errors
3. Verify network requests
4. Test in incognito mode

## 📝 Next Steps

1. Upload all files as web resources
2. Fix HTML resource paths
3. Test in Power Apps environment
4. Configure CSP if needed
5. Embed in your model-driven app

## 🎯 Pro Tips

- Use solution-aware web resources for better lifecycle management
- Version your web resource names for updates
- Test thoroughly in the target environment
- Consider using a bundler for better optimization
- Keep CSS and JS files separate for easier maintenance

Happy Deploying! 🚀