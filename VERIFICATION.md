# Verification Checklist

Use this checklist to verify that your Webmarker Firefox extension is working correctly.

## Build Verification

- [ ] Build completes without errors: `npm run build`
- [ ] `out` directory is created
- [ ] `out/manifest.json` exists
- [ ] `out/background.js` exists
- [ ] `out/content.js` exists
- [ ] `out/index.html` exists

## Firefox Installation Verification

- [ ] Open Firefox and navigate to `about:debugging`
- [ ] Click "This Firefox" in the sidebar
- [ ] Click "Load Temporary Add-on..."
- [ ] Select `out/manifest.json`
- [ ] Extension appears in the list with:
  - Name: Webmarker
  - Version: 1.0
  - Status: Enabled
- [ ] No errors shown in the console

## Functional Verification

### Test 1: Extension Popup
- [ ] Click the Webmarker icon in the toolbar
- [ ] Popup opens showing the Webmarker interface
- [ ] "No markers yet!" message is displayed
- [ ] Instructions mention CTRL+Click

### Test 2: Creating a Marker
- [ ] Navigate to any webpage (e.g., Wikipedia)
- [ ] Hold CTRL (CMD on Mac) and click on a paragraph
- [ ] Blue outline briefly appears around the clicked text
- [ ] "Marker saved!" notification appears in top-right corner
- [ ] No errors in the browser console (F12)

### Test 3: Content Script Injection
- [ ] Open browser console (F12)
- [ ] Check for message: "Webmarker content script loaded"
- [ ] No error messages related to Webmarker

### Test 4: Background Script
- [ ] Go to `about:debugging` → This Firefox
- [ ] Click "Inspect" next to Webmarker extension
- [ ] Check console for: "Webmarker extension installed"
- [ ] No error messages

### Test 5: Storage
- [ ] Create multiple markers on different pages
- [ ] Open Webmarker popup
- [ ] Verify marker count increases
- [ ] Markers should be grouped by domain or keywords

## Common Issues and Solutions

### Issue: Extension won't load
**Solution**: Make sure you selected the `manifest.json` from the `out` directory, not `public`

### Issue: Markers not saving
**Solution**: 
1. Check browser console for errors
2. Verify storage permission is granted
3. Try reloading the extension

### Issue: Content script not working
**Solution**:
1. Refresh the webpage after loading the extension
2. Check if the page allows extension scripts (some pages don't)
3. Try a different website

### Issue: Build fails
**Solution**:
```bash
rm -rf .next out node_modules
npm install
npm run build
```

## Success Criteria

Your extension is working correctly if:
- ✓ Build completes without errors
- ✓ Extension loads in Firefox without errors
- ✓ CTRL+Click creates markers successfully
- ✓ Markers are saved and can be viewed in popup
- ✓ Visual feedback (highlight + notification) works
- ✓ No console errors appear

## Next Steps

Once verified:
1. Test on various websites (news, documentation, blogs)
2. Create markers from different types of content
3. Verify grouping works correctly
4. Test that markers persist across browser sessions (for permanent installation)

## Support

If you encounter issues not covered here:
1. Check the [FIREFOX_EXTENSION_GUIDE.md](./FIREFOX_EXTENSION_GUIDE.md)
2. Review Firefox extension console for detailed error messages
3. Ensure all prerequisites are met (Node.js, npm versions)
