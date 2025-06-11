// import browser from "webextension-polyfill";
// import { logT, sleep } from "./utils";

// export class TranscriptSession {
//   private stopped = false;

//   constructor(readonly id: string) {}

//   /** Entry point: click transcript UI and parse DOM */
//   async start() {
//     logT("start DOM transcript", this.id);
//     try {
//       await this.openPanelAndRead();
//     } catch (err) {
//       logT("failed DOM transcript", err as any);
//     }
//   }

//   stop() {
//     if (this.stopped) return;
//     this.stopped = true;
//     logT("stop", this.id);
//   }

//   private async openPanelAndRead() {
//     if (this.stopped) return;
//     logT("open transcript panel DOM", this.id);

//     // a) expand description if needed
//     const expandBtn = document.getElementById(
//       "expand"
//     ) as HTMLButtonElement | null;
//     if (expandBtn && expandBtn.offsetParent !== null) {
//       expandBtn.click();
//       await sleep(60);
//     }

//     // b) click "Show transcript" button in description area
//     const showBtn = document.querySelector<HTMLButtonElement>(
//       "ytd-video-description-transcript-section-renderer ytd-button-renderer button"
//     );
//     if (showBtn && showBtn.offsetParent !== null) {
//       showBtn.click();
//     } else {
//       throw new Error("Show transcript button not found");
//     }

//     // c) wait for transcript panel
//     const panel = await this.waitPanel();
//     if (!panel) throw new Error("Transcript panel not found");

//     // hide panel
//     (panel as HTMLElement).style.cssText = `
//       position: fixed !important;
//       top: -9999px !important;
//       left: -9999px !important;
//       width: 0 !important;
//       height: 0 !important;
//       opacity: 0 !important;
//       pointer-events: none !important;
//     `;

//     // parse text segments
//     const lines: string[] = [];
//     panel
//       .querySelectorAll<HTMLElement>("ytd-transcript-segment-renderer")
//       .forEach((seg) => {
//         const ts =
//           seg.querySelector(".segment-timestamp")?.textContent?.trim() ?? "";
//         const txt =
//           seg.querySelector(".segment-text")?.textContent?.trim() ?? "";
//         if (txt) lines.push(`${ts}  ${txt}`);
//       });
//     const transcript = lines.join("\n").trim();
//     if (transcript) {
//       await this.flush(transcript);
//     }
//   }

//   private waitPanel(timeout = 15000): Promise<Element | null> {
//     return new Promise((resolve) => {
//       const check = () => {
//         const p = document.querySelector(
//           'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
//         );
//         if (p && p.querySelector("ytd-transcript-segment-renderer")) {
//           resolve(p);
//           return true;
//         }
//         return false;
//       };
//       if (check()) return;
//       const mo = new MutationObserver(() => check() && mo.disconnect());
//       mo.observe(document.body, { childList: true, subtree: true });
//       setTimeout(() => {
//         mo.disconnect();
//         resolve(null);
//       }, timeout);
//     });
//   }

//   private async flush(text: string) {
//     if (this.stopped || !text) return;
//     logT("flush DOM transcript", text.slice(0, 100));
//     try {
//       await browser.runtime.sendMessage({
//         type: "video-transcript",
//         videoId: this.id,
//         transcript: text,
//       });
//     } catch (e) {
//       logT("background unreachable:", e);
//     }
//   }
// }

import browser from "webextension-polyfill";
import { getTextAndOffset } from "./rf";
import { convertToCompactString } from "./bf";
import { Kn, Zn, Xn, Yn, Qn, ei, ti } from "./domUtils";
import { isNewUI } from "./zn";
import { ni } from "./retry";
import { logT, sleep } from "./utils";

export class TranscriptSession {
  private stopped = false;

  constructor(readonly id: string) {}

  /**
   * Entry point: try API first, then fallback to DOM parsing
   */
  async start() {
    logT("Transcript start", this.id);
    // First attempt via API
    try {
      const apiData = await getTextAndOffset();
      const compact = convertToCompactString(apiData.offset);
      if (!compact) throw new Error("Empty API transcript");
      await this.flush(compact);
      return;
    } catch (err) {
      logT("API transcript failed, falling back to DOM", err as any);
    }

    // Fallback via DOM
    try {
      await this.fallbackDOM();
    } catch (err) {
      logT("DOM transcript failed", err as any);
    }
  }

  stop() {
    if (this.stopped) return;
    this.stopped = true;
    logT("Transcript stopped", this.id);
  }

  /**
   * Fallback logic: open panel, read segments, send
   */
  private async fallbackDOM() {
    if (this.stopped) return;
    logT("DOM fallback start", this.id);

    // locate panel
    const panel = Kn();
    if (!panel) throw new Error("Transcript panel container not found");

    // choose opener depending on UI version
    const opener = (await isNewUI()) ? Yn : Qn;

    // use retry wrapper ni to ensure panel opens and segments load
    const segments = await ni(ei, opener, panel);
    const compact = convertToCompactString(segments || []);
    if (!compact) throw new Error("No segments extracted");

    await this.flush(compact);
  }

  /**
   * Send transcript to background
   */
  private async flush(text: string) {
    if (this.stopped || !text) return;
    logT("Flush transcript", text.slice(0, 100));
    try {
      await browser.runtime.sendMessage({
        type: "video-transcript",
        videoId: this.id,
        transcript: text,
      });
    } catch (e) {
      logT("Background unreachable", e);
    }
  }
}

// Utility: convert timestamp string to seconds
export function ti(timestamp: string): number {
  if (!timestamp) return 0;
  const parts = timestamp.split(":").map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts.length === 2
    ? parts[0] * 60 + parts[1]
    : 0;
}
