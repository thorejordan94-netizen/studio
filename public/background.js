/**
 * Background script for Webmarker extension
 * Handles background tasks and message passing between content scripts and popup
 */

// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Webmarker extension installed');
  
  // Initialize storage with empty markers if not exists
  chrome.storage.local.get(['markers'], (result) => {
    if (!result.markers) {
      chrome.storage.local.set({ markers: [] });
    }
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveMarker') {
    // Save marker to storage
    chrome.storage.local.get(['markers'], (result) => {
      const markers = result.markers || [];
      markers.push(request.marker);
      chrome.storage.local.set({ markers }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getMarkers') {
    // Retrieve all markers
    chrome.storage.local.get(['markers'], (result) => {
      sendResponse({ markers: result.markers || [] });
    });
    return true;
  }
  
  if (request.action === 'clearMarkers') {
    // Clear all markers
    chrome.storage.local.set({ markers: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle tab updates to ensure content scripts are injected
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Content script should be automatically injected via manifest
    console.log('Tab updated:', tab.url);
  }
});
