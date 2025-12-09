import browser from 'webextension-polyfill';
import { type BrowserMessageType, type ColorScheme } from './models';
import { containsSecret } from './encoding-utils';
import { updateSidebar } from './content-sidebar/sidebar';

// State to track if we found hidden content
let detectedTextSnippet = '';
let isSidebarVisible = false;

// --- Detection Logic ---

function findHiddenContent() {
  // We will scan text nodes for zero-width characters.
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (text && containsSecret(text)) {
      // Found it! We take the whole text node content as the snippet.
      detectedTextSnippet = text.trim();
      return true;
    }
  }
  detectedTextSnippet = '';
  return false;
}

function runDetectionAndNotify() {
  const found = findHiddenContent();
  
  // Update the sidebar state regardless of visibility, so when it opens, it has the latest data.
  updateSidebar(isSidebarVisible, detectedTextSnippet);
  
  if (found) {
    console.log('Ghostpost: Hidden content detected on page.');
  }
}

// Run detection immediately and set up a MutationObserver for dynamic content
runDetectionAndNotify();

// Observe changes to the DOM to detect dynamically loaded content or text changes
const observer = new MutationObserver(runDetectionAndNotify);
observer.observe(document.body, { childList: true, subtree: true, characterData: true });


// --- Message Handling ---

browser.runtime.onMessage.addListener(message => {
  console.log('got message', message);
  switch (message.type as BrowserMessageType) {
    case 'getColorScheme': {
      return Promise.resolve(getColorScheme());
    }
    case 'toggleSidebar': {
      isSidebarVisible = !isSidebarVisible;
      
      // Update the sidebar visibility and content
      updateSidebar(isSidebarVisible, detectedTextSnippet);
      
      // Return the new state of visibility
      return Promise.resolve(isSidebarVisible);
    }
  }
});

function getColorScheme() {
  let scheme: ColorScheme = 'light';
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (darkModeMediaQuery.matches) {
    scheme = 'dark';
  }
  return scheme;
}