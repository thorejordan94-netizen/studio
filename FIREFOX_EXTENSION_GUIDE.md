# Firefox Extension Setup Guide for Webmarker

This guide will walk you through the steps to build and install Webmarker as a Firefox browser extension.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)
- **Firefox** browser (any recent version)

## Step-by-Step Installation Instructions

### Step 1: Clone and Setup the Project

```bash
# Navigate to the project directory
cd /path/to/studio

# Install dependencies
npm install
```

### Step 2: Build the Extension

Build the project for production use:

```bash
npm run build
```

This will create an `out` directory containing the static files for your extension.

### Step 3: Load the Extension in Firefox

1. **Open Firefox** and navigate to `about:debugging` in the address bar
   - Or click the menu (☰) → More Tools → "Browser Developer Tools" → Select "This Firefox" in the left sidebar

2. **Click "This Firefox"** in the left sidebar (if not already selected)

3. **Click "Load Temporary Add-on..."** button

4. **Navigate** to the project's `out` directory and select the `manifest.json` file

5. The extension should now be loaded and appear in the list of temporary extensions

### Step 4: Using the Extension

Once installed, Webmarker will be available in your Firefox browser:

1. **Click the extension icon** in the browser toolbar to open the popup
2. **Navigate to any webpage** you want to mark
3. **CTRL + Left Click** on any text block to create a marker
4. Markers will be automatically grouped semantically
5. Use the overlay sidebar to view and navigate your markers

## Development Mode

For development and testing, you can run the development server:

```bash
npm run dev
```

Then visit `http://localhost:9002` in your browser to test the application locally before building the extension.

## Troubleshooting

### Extension Won't Load

- Make sure you selected the `manifest.json` file from the `out` directory, not the one from the `public` directory
- Check that the build completed successfully without errors
- Try removing and re-adding the extension

### Build Errors

If you encounter build errors:

```bash
# Clear the cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

### Extension Not Working on Pages

- Check the Firefox Console (F12) for any error messages
- Make sure the page you're testing on allows extensions (some pages like `about:` pages don't allow extension scripts)
- Try refreshing the page after loading the extension

## Permissions Explained

The extension requires the following permissions:

- **activeTab**: To interact with the currently active browser tab
- **scripting**: To inject scripts for marker creation
- **storage**: To save your markers and groups locally

## Notes

- **Temporary Extensions**: Extensions loaded via "Load Temporary Add-on" are temporary and will be removed when Firefox is closed
- **Permanent Installation**: To permanently install the extension, you would need to sign it through Mozilla's Add-on Developer Hub
- **Updates**: After making code changes, rebuild with `npm run build` and reload the extension in Firefox (click the "Reload" button next to the extension in `about:debugging`)

## Additional Resources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [WebExtensions API Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
