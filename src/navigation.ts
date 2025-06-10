// src/navigation.ts

import { mountSummarizer } from "./ui";
import { TranscriptSession } from "./transcript";
import { getVid } from "./utils";

/*──────────────────── SPA navigation & session manager ────────────────────*/

let active: TranscriptSession | null = null;
let currentVid: string | null = null;
let lastUrl: string = location.href;

/**
 * Starts or restarts the transcript session when the video ID changes.
 * Also mounts the UI and updates lastUrl.
 */
export function boot() {
  const id = getVid();
  if (!id) {
    active?.stop();
    active = null;
    currentVid = null;
    lastUrl = location.href;
    return;
  }
  if (id === currentVid) return;
  active?.stop();
  active = new TranscriptSession(id);
  currentVid = id;
  active.start().catch(console.error);
  mountSummarizer();
  lastUrl = location.href;
}

// Initial boot on page load
boot();

/*──────────────────── wrap pushState/replaceState ────────────────────*/
["pushState", "replaceState"].forEach((method) => {
  const original = (history as any)[method];
  (history as any)[method] = function (...args: any[]) {
    original.apply(history, args);
    // small delay to let URL update
    setTimeout(() => {
      if (location.href !== lastUrl) {
        boot();
      }
    }, 50);
  };
});

/*──────────────────── listen to back/forward ────────────────────*/
window.addEventListener("popstate", () => {
  setTimeout(() => {
    if (location.href !== lastUrl) {
      boot();
    }
  }, 50);
});

/*──────────────── observe <title> mutations ────────────────────*/
const titleObserver = new MutationObserver((muts) => {
  if (
    muts.some(
      (m) =>
        m.type === "childList" &&
        (m.target as Element).nodeName.toUpperCase() === "TITLE"
    )
  ) {
    boot();
  }
});
titleObserver.observe(document, { childList: true, subtree: true });

/*──────────────── fallback periodic check ────────────────────*/
setInterval(() => {
  if (location.href !== lastUrl) {
    boot();
  }
}, 50);
