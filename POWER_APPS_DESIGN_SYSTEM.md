# Power Apps UI/UX Design System Implementation

## Overview

The Excel Report Generator has been completely redesigned to match Microsoft Power Apps Model-Driven App design language. This ensures a seamless, professional experience that feels like a native part of the Power Apps platform.

## Design Philosophy

### Core Principles
1. **Consistency**: All components follow Power Apps design patterns
2. **Professional**: Clean, light theme with enterprise aesthetics
3. **Familiar**: Users familiar with Power Apps will feel at home
4. **Accessible**: High contrast, proper spacing, clear typography
5. **Modern**: Contemporary Microsoft design language (Fluent Design System)

## Color Palette

### Primary Colors
- **Primary Blue**: `#0078d4` - Main brand color, buttons, links, selections
- **Primary Hover**: `#106ebe` - Hover states
- **Primary Pressed**: `#005a9e` - Active/pressed states
- **Primary Light**: `#c7e0f4` - Light backgrounds
- **Primary Lighter**: `#deecf9` - Selected item backgrounds

### Neutral Colors
- **White**: `#ffffff` - Main background, cards, panels
- **Light**: `#faf9f8` - Page background
- **Lighter**: `#f3f2f1` - Navigation background
- **Border**: `#edebe9` - Primary borders
- **Border Hover**: `#d2d0ce` - Hover borders

### Text Colors
- **Primary Text**: `#323130` - Main content
- **Secondary Text**: `#605e5c` - Supporting text
- **Tertiary Text**: `#a19f9d` - Disabled, muted text

### Semantic Colors
- **Success**: `#107c10` - Success states, confirmations
- **Error**: `#a4262c` - Errors, warnings
- **Warning**: `#797775` - Cautions, alerts
- **Info**: `#0078d4` - Information, tips

## Typography

### Font Family
- **Primary**: Segoe UI (Microsoft's standard)
- **Monospace**: Consolas (for code)

### Font Sizes
- **Small**: 12px - Captions, labels
- **Base**: 14px - Body text, forms
- **Large**: 16px - Subheadings
- **XLarge**: 20px - Page titles
- **XXLarge**: 28px - Major headings

### Font Weights
- **Regular**: 400 - Body text
- **Semibold**: 600 - Labels, headings
- **Bold**: 700 - Emphasis

## Spacing System

Based on 4px grid system (Power Apps standard):
- **XS**: 4px - Tight spacing
- **S**: 8px - Small gaps
- **M**: 12px - Medium spacing
- **L**: 16px - Large spacing (default)
- **XL**: 20px - Extra large
- **XXL**: 24px - Section spacing
- **XXXL**: 32px - Major sections

## Shadows

Power Apps uses subtle, layered shadows:
- **Shadow 4**: `0 1.6px 3.6px rgba(0, 0, 0, 0.132), 0 0.3px 0.9px rgba(0, 0, 0, 0.108)` - Cards
- **Shadow 8**: `0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0 0.6px 1.8px rgba(0, 0, 0, 0.108)` - Elevated cards
- **Shadow 16**: `0 6.4px 14.4px rgba(0, 0, 0, 0.132), 0 1.2px 3.6px rgba(0, 0, 0, 0.108)` - Panels
- **Shadow 64**: `0 25.6px 57.6px rgba(0, 0, 0, 0.22), 0 4.8px 14.4px rgba(0, 0, 0, 0.18)` - Modals

## Components

### Buttons
```css
.powerapps-button {
  height: 32px;
  padding: 0 16px;
  border-radius: 2px;
  font-weight: 600;
  border: 1px solid #edebe9;
}
```

**Variants**:
- Default: White background, gray border
- Primary: Blue background, white text
- Small: 24px height, reduced padding

### Cards
```css
.powerapps-card {
  background: #ffffff;
  border: 1px solid #edebe9;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1.6px 3.6px rgba(0, 0, 0, 0.132);
}
```

**States**:
- Hover: Elevated shadow, darker border
- Selected: Blue border, light blue background

### Panels
```css
.powerapps-panel {
  background: #ffffff;
  border: 1px solid #edebe9;
}
```

**Structure**:
- Header: Light gray background, 16px padding
- Content: White background, scrollable
- Footer: Optional, bordered top

### Forms

**Labels**:
- Font weight: 600
- Font size: 14px
- Margin bottom: 4px

**Inputs**:
- Height: 32px
- Padding: 0 8px
- Border: 1px solid #edebe9
- Border radius: 2px

**Focus States**:
- Border: Blue (#0078d4)
- Box shadow: 0 0 0 1px #0078d4

### Navigation
```css
.powerapps-nav-item {
  height: 32px;
  padding: 0 12px;
  border-radius: 2px;
}
```

**States**:
- Default: Transparent
- Hover: Light gray background
- Selected: Light blue background, blue text, left border accent

### Badges
```css
.powerapps-badge {
  height: 20px;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
}
```

**Types**:
- Success: Green background
- Error: Red background
- Warning: Yellow background
- Info: Blue background

## Layout Structure

### Header
- Height: 48px
- Background: Primary blue
- Contains: Logo, title, global actions

### Navigation
- Width: 240px
- Background: Light gray
- Contains: Site map navigation

### Command Bar
- Height: 44px
- Background: Light gray
- Contains: Page-level actions

### Content Area
- Background: Very light gray
- Padding: Variable based on content
- Contains: Main page content

## Accessibility

### Contrast Ratios
- Text on white: 4.5:1 minimum (WCAG AA)
- Interactive elements: Clear focus indicators
- Borders: Sufficient contrast for visibility

### Focus States
- 2px blue outline
- 2px offset from element
- Consistent across all interactive elements

### Keyboard Navigation
- Tab order follows visual flow
- All actions accessible via keyboard
- ESC to cancel/close

## React Flow Integration

The flow builder canvas follows Power Apps design:
- Background: White (#ffffff)
- Grid dots: Light border color
- Edges: Gray, becomes blue when selected
- Handles: Blue circles
- Controls: White panels with shadows

## Usage Guidelines

### Adding New Components

1. **Use CSS Variables**: Always reference theme variables
   ```css
   color: var(--powerapps-text-primary);
   background: var(--powerapps-neutral-bg);
   ```

2. **Follow Spacing Grid**: Use 4px multiples
   ```css
   padding: var(--powerapps-spacing-l); /* 16px */
   gap: var(--powerapps-spacing-s); /* 8px */
   ```

3. **Apply Standard Classes**: Use pre-defined classes
   ```tsx
   <div className="powerapps-card">
   <button className="powerapps-button primary">
   ```

4. **Maintain Consistency**: Reference existing components
   - Look at similar components for patterns
   - Use same spacing, colors, shadows
   - Follow same interaction patterns

### Adding New Pages

1. **Use Standard Layout**:
   ```tsx
   <div style={{ padding: 'var(--powerapps-spacing-xxl)' }}>
     <div className="powerapps-card">
       {/* Page content */}
     </div>
   </div>
   ```

2. **Include Page Header**:
   ```tsx
   <div className="powerapps-header">
     <div className="powerapps-header-title">
       <Icon />
       <span>Page Title</span>
     </div>
   </div>
   ```

3. **Use Standard Controls**:
   - Forms: `.powerapps-field`, `.powerapps-label`, `.powerapps-input`
   - Actions: `.powerapps-button`
   - Data: `.powerapps-table`, `.powerapps-card`

## Files Structure

```
src/
  styles/
    powerAppsTheme.ts          # Theme configuration
    powerApps.css              # Main styles
  index.css                     # Global CSS variables
  App.css                       # App-level overrides (n8n styles)
  components/
    Layout/
      AppLayout.tsx             # Power Apps navigation
    FlowBuilder/
      FlowBuilder.tsx           # Updated with Power Apps classes
```

## Migration Checklist

When updating a component to Power Apps design:

- [ ] Replace color references with CSS variables
- [ ] Update spacing to use 4px grid
- [ ] Apply Power Apps classes (powerapps-*)
- [ ] Test hover/focus/active states
- [ ] Verify accessibility (contrast, focus indicators)
- [ ] Check responsive behavior
- [ ] Ensure keyboard navigation works
- [ ] Update any custom styles to match theme

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (Power Apps doesn't support IE11)

## Performance Considerations

- CSS variables for theme: Fast, no JS overhead
- Minimal shadows: Better paint performance
- Simple borders: Better rendering
- Standard fonts: No font loading delay

## Future Enhancements

1. **Dark Mode**: Add Power Apps dark theme support
2. **High Contrast**: Support high contrast mode
3. **RTL Support**: Right-to-left language support
4. **Animations**: Add subtle transitions matching Power Apps
5. **Custom Themes**: Allow organization branding

## Resources

- [Fluent UI Documentation](https://developer.microsoft.com/en-us/fluentui)
- [Power Apps Design Guidelines](https://docs.microsoft.com/en-us/power-apps/maker/model-driven-apps/design-custom-business-apps)
- [Microsoft Design Language](https://www.microsoft.com/design/fluent/)

## Maintenance

### Regular Updates
- Monitor Fluent UI updates for design changes
- Update colors/spacing if Power Apps changes design
- Keep accessibility standards current
- Test with new browser versions

### Code Quality
- Use linting to enforce consistent styling
- Document any deviations from standard
- Keep component library organized
- Maintain design system documentation

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
