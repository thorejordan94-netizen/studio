# Firefox Extension Setup Guide for Webmarker

This guide will walk you through the steps to build and install Webmarker as a Firefox browser extension.

## What is Webmarker?

Webmarker is a browser extension that helps you mark and organize text from different webpages. Simply CTRL+Click on any text to create a marker, and the extension will automatically group related markers together.

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
   - Or click the menu (☰) → More Tools → "Remote Debugging" → Select "This Firefox" in the left sidebar

2. **Click "This Firefox"** in the left sidebar (if not already selected)

3. **Click "Load Temporary Add-on..."** button at the top

4. **Navigate** to your project's `out` directory and select the `manifest.json` file
   - The full path would be: `/path/to/studio/out/manifest.json`

5. The extension should now be loaded and appear in the list of temporary extensions with:
   - Name: **Webmarker**
   - Version: **1.0**
   - Status: **Enabled**

6. You should see the Webmarker icon in your Firefox toolbar

### Step 4: Using the Extension

Once installed, Webmarker is ready to use on any webpage:

1. **Navigate to any webpage** (e.g., Wikipedia, news sites, documentation)

2. **Create a marker**: Hold **CTRL** (or **CMD** on Mac) and **Left Click** on any text
   - The text will briefly highlight with a blue outline
   - A notification will appear confirming the marker was saved

3. **View your markers**: Click the Webmarker icon in the toolbar
   - The popup will show your markers grouped by website or category
   - Markers are automatically organized for easy reference

4. **Navigate to markers**: Click on any marker in the list to see it highlighted on the page

**Tips**:
- Works on text in paragraphs, headings, buttons, and even input fields
- Create markers from multiple websites
- Markers are automatically grouped by domain or semantic content
- All markers are saved locally in your browser

## Development Mode

For development and testing, you can run the development server:

```bash
npm run dev
```

Then visit `http://localhost:9002` in your browser to test the application locally before building the extension.

## Important Notes

### Temporary vs Permanent Installation

- **Temporary Extensions**: Extensions loaded via "Load Temporary Add-on" are temporary and will be removed when Firefox is closed or restarted
- **Permanent Installation**: To permanently install the extension:
  1. Package the extension as a `.zip` file
  2. Sign it through [Mozilla's Add-on Developer Hub](https://addons.mozilla.org/developers/)
  3. Install the signed `.xpi` file

### Making Updates

After making code changes to the extension:

1. Run `npm run build` to rebuild
2. Go to `about:debugging` in Firefox
3. Click the **"Reload"** button next to Webmarker in the extension list
4. The extension will reload with your latest changes

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

These permissions are minimal and focused on providing the core functionality without compromising your privacy.

## Additional Resources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [WebExtensions API Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
