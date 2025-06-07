import browser from "webextension-polyfill";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed:", details);
  
  if (details.reason === "install" || details.reason === "update") {
    // Show welcome page
    browser.tabs.create({
      url: browser.runtime.getURL("/welcome.html")
    });

    // Find and reload all existing YouTube tabs
    const tabs = await browser.tabs.query({
      url: "*://*.youtube.com/*"
    });

    // Reload each YouTube tab to inject the content script
    for (const tab of tabs) {
      if (tab.id) {
        await browser.tabs.reload(tab.id);
      }
    }
  }
});
