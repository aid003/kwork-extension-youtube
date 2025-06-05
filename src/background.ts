import browser from "webextension-polyfill";

console.log("Hello from the background!");

// Function to inject into existing YouTube tabs
async function injectIntoExistingTabs() {
  const tabs = await browser.tabs.query({
    url: "*://*.youtube.com/watch?*"
  });

  for (const tab of tabs) {
    if (tab.id) {
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["src/content.js"]
        });
      } catch (error) {
        console.error('Failed to inject script:', error);
      }
    }
  }
}

// Listen for tab updates
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com/watch?')) {
    try {
      await browser.scripting.executeScript({
        target: { tabId },
        files: ["src/content.js"]
      });
    } catch (error) {
      console.error('Failed to inject script:', error);
    }
  }
});

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
  
  if (details.reason === "install" || details.reason === "update") {
    // Show welcome page
    browser.tabs.create({
      url: browser.runtime.getURL("/welcome.html")
    });

    // Inject into existing YouTube tabs
    injectIntoExistingTabs();
  }
});
