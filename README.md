# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Webmarker - Firefox Extension

This project can be used as a Firefox browser extension! Webmarker allows you to mark and group text on any webpage with CTRL+Click.

### Quick Start for Firefox Extension

1. **Install dependencies**: `npm install`
2. **Build the extension**: `npm run build`
3. **Load in Firefox**:
   - Open `about:debugging` in Firefox
   - Click "This Firefox" → "Load Temporary Add-on..."
   - Select the `manifest.json` file from the `out` directory

For detailed step-by-step instructions, see [FIREFOX_EXTENSION_GUIDE.md](./FIREFOX_EXTENSION_GUIDE.md).

### Features

- **Mark text**: CTRL + Left Click on any text to create a marker
- **Auto-grouping**: Markers are automatically grouped by domain or keywords
- **Overlay sidebar**: View all your markers in an organized sidebar
- **Navigation**: Click markers to navigate back to saved content

