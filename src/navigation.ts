import { mountSummarizer, resetSummarizerControls } from "./ui";
import { getVid, logT } from "./utils";

let activeVid: string | null = null;

function refreshUI(): void {
  const vid = getVid();
  if (!vid) return;

  if (vid !== activeVid) {
    activeVid = vid;
    logT("Video changed → reset controls", vid);
    resetSummarizerControls();
  }

  if (!document.getElementById("ai-video-summarizer")) {
    mountSummarizer();
  }
}

document.addEventListener("DOMContentLoaded", () => refreshUI());

window.addEventListener("yt-navigate-finish", () => setTimeout(refreshUI, 0));

["pushState", "replaceState"].forEach((m) => {
  const orig = (history as any)[m];
  (history as any)[m] = function (...a: any[]) {
    const r = orig.apply(this, a);
    setTimeout(refreshUI, 0);
    return r;
  };
});
window.addEventListener("popstate", () => setTimeout(refreshUI, 0));

setInterval(() => {
  const vid = getVid();
  if (vid && vid !== activeVid) {
    logT("Fallback detect new video", vid);
    refreshUI();
  }
}, 200);
