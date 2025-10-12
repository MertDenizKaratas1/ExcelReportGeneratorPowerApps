# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```powershell
cd c:\ExcelGenerator\WebResource
npm install
```

This will install:
- React 18
- Fluent UI v9 components
- TypeScript
- React Router
- All development tools

### 2. Run Development Server

```powershell
npm start
```

- Opens at `http://localhost:3000`
- Hot reload enabled
- Uses mock data (no Dynamics 365 connection needed)

### 3. Explore the Features

Navigate through the app:

- **Dashboard** - Overview and feature cards
- **Compile Report** - Multi-sheet Excel generation
- **Execute Page** - Single-page reports
- **Entity Graph** - Relationship visualization  
- **Metadata Snapshot** - CRM metadata capture

### 4. Test with Mock Data

All API calls return mock data when `window.Xrm` is not available. This lets you:
- Test UI components
- Validate user flows
- Debug without Dynamics 365

## 📝 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component |
| `src/services/dynamicsApi.ts` | Dynamics 365 API wrapper |
| `src/types/index.ts` | TypeScript definitions |
| `src/components/Layout/AppLayout.tsx` | Navigation & layout |
| `src/components/CompileReport/` | Report generation UI |
| `src/components/EntityGraph/` | Entity visualization |

## 🔧 Customization

### Change Theme Colors

Edit `src/App.tsx`:

```typescript
import { webLightTheme, webDarkTheme } from '@fluentui/react-components';
// Customize theme tokens as needed
```

### Add New Actions

1. Add types to `src/types/index.ts`
2. Add API method to `src/services/dynamicsApi.ts`
3. Create new page component
4. Add route in `src/App.tsx`
5. Add navigation in `AppLayout.tsx`

### Modify Backend Integration

Edit `src/services/dynamicsApi.ts`:

```typescript
// Change action names
actionName: 'eg_CompileReport' // ← Your action name

// Modify request structure
const request = {
  JsonInput: JSON.stringify(jsonInput),
  // Add custom parameters
};
```

## 🏗️ Build for Production

```powershell
# Standard React build
npm run build

# Build with web resource packaging
npm run build:webresource
```

Output in `build/` directory ready for Power Apps upload.

## 📤 Deploy to Power Apps

See `DEPLOYMENT.md` for comprehensive deployment instructions.

### Quick Deploy Steps:

1. Build the app: `npm run build`
2. Upload `build/index.html` as web resource
3. Upload JS/CSS files from `build/static/`
4. Update HTML to reference web resources
5. Add to Model-Driven App or form
6. Publish customizations

## 🐛 Common Issues

**TypeScript Errors (Expected)**
- Run `npm install` to resolve
- Errors shown are normal before installation

**Action Not Found**
- Ensure custom actions are registered in Power Apps
- Check action names match exactly

**Mock Data Only**
- Normal when running locally
- Will use real Dynamics 365 API when deployed

## 📚 Next Steps

1. **Customize the UI** - Modify components to match your branding
2. **Add Features** - Extend with additional actions
3. **Test Thoroughly** - Test each action in Power Apps
4. **Convert to PCF** - For deeper integration (see DEPLOYMENT.md)

## 🎨 UI Customization Examples

### Change Primary Color

```typescript
// In App.tsx or component
import { tokens } from '@fluentui/react-components';

// Use different color palette
color: tokens.colorPalettePurpleForeground1
```

### Add Custom Logo

```typescript
// In AppLayout.tsx header section
<img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
```

### Modify Layout

```typescript
// In AppLayout.tsx
const useStyles = makeStyles({
  sidebar: {
    width: '280px', // Wider sidebar
    // ... other styles
  },
});
```

## 💡 Tips

- **Hot Reload:** Changes auto-refresh in dev mode
- **Console Logs:** Check browser console for API call details
- **Mock Mode:** Test without Dynamics 365 connection
- **TypeScript:** Provides IntelliSense and type safety
- **Fluent UI:** Matches Microsoft 365 design language

## 🔗 Resources

- [Fluent UI Documentation](https://react.fluentui.dev/)
- [React Documentation](https://react.dev/)
- [Power Apps Web Resources](https://docs.microsoft.com/power-apps/developer/model-driven-apps/web-resources)
- [PCF Documentation](https://docs.microsoft.com/power-apps/developer/component-framework/)

---

Need help? Check `DEPLOYMENT.md` for detailed instructions or review the comprehensive `README.md`.
