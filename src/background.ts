import browser from "webextension-polyfill";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
  
  if (details.reason === "install" || details.reason === "update") {
    // Show welcome page
    browser.tabs.create({
      url: browser.runtime.getURL("/welcome.html")
    });
  }
});
