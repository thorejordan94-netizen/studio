/**
 * Content script for Webmarker extension
 * Injected into web pages to enable marker creation
 */

// Flag to prevent multiple event listener registrations
let isInitialized = false;

// Initialize content script
function initializeContentScript() {
  if (isInitialized) return;
  isInitialized = true;

  console.log('Webmarker content script loaded');

  // Listen for CTRL + Left Click to create markers
  document.addEventListener('click', handleMarkerCreation, true);

  // Highlight markers on page
  addMarkerStyles();
}

// Handle marker creation on CTRL + Click
function handleMarkerCreation(event) {
  // Check if CTRL (or CMD on Mac) is pressed
  if (!(event.ctrlKey || event.metaKey)) {
    return;
  }

  // Prevent default behavior
  event.preventDefault();
  event.stopPropagation();

  const target = event.target;
  
  // Get text content
  let text = '';
  if (target.value) {
    // For input fields
    text = target.value;
  } else {
    // For text elements
    text = target.innerText || target.textContent || '';
  }

  // Trim and validate text
  text = text.trim();
  if (!text || text.length === 0) {
    console.log('No text to mark');
    return;
  }

  // Limit text length
  if (text.length > 500) {
    text = text.substring(0, 500) + '...';
  }

  // Create marker object
  const marker = {
    id: Date.now().toString(),
    url: window.location.href,
    text: text,
    elementId: generateElementId(target),
    timestamp: new Date().toISOString(),
  };

  // Add visual feedback
  addMarkerHighlight(target);

  // Send marker to background script
  chrome.runtime.sendMessage(
    {
      action: 'saveMarker',
      marker: marker,
    },
    (response) => {
      if (response && response.success) {
        console.log('Marker saved:', marker);
        showNotification('Marker saved!');
      }
    }
  );
}

// Generate a unique ID for an element
function generateElementId(element) {
  // Try to create a unique selector
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className ? `.${element.className.trim().replace(/\s+/g, '.')}` : '';
  
  return `${tag}${id}${classes}-${Date.now()}`;
}

// Add visual highlight to marked element
function addMarkerHighlight(element) {
  element.classList.add('webmarker-highlighted');
  
  // Remove highlight after animation
  setTimeout(() => {
    element.classList.remove('webmarker-highlighted');
  }, 2000);
}

// Add CSS styles for markers
function addMarkerStyles() {
  if (document.getElementById('webmarker-styles')) return;

  const style = document.createElement('style');
  style.id = 'webmarker-styles';
  style.textContent = `
    .webmarker-highlighted {
      animation: webmarker-pulse 0.5s ease-in-out 2;
      outline: 2px solid #75A9FF !important;
      outline-offset: 2px;
    }
    
    @keyframes webmarker-pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    .webmarker-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #75A9FF;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      font-family: 'PT Sans', sans-serif;
      font-size: 14px;
      animation: webmarker-slide-in 0.3s ease-out;
    }
    
    @keyframes webmarker-slide-in {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// Show notification to user
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'webmarker-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'webmarker-slide-in 0.3s ease-out reverse';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
}
