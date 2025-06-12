//  src/transcript.ts 
import browser from "webextension-polyfill";
import { logT, sleep, getVid } from "./utils";

const HIDDEN_CSS_ID = "ai-stealth-transcript-style";

function injectStealthCSS(): void {
  if (document.getElementById(HIDDEN_CSS_ID)) return;

  const st = document.createElement("style");
  st.id = HIDDEN_CSS_ID;
  st.textContent = `
    /* выносим панель из потока, делаем невидимой */
    .ai-stealth-transcript{
      position:fixed!important;
      top:0;left:0;
      width:1px;height:1px;
      overflow:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
      z-index:-1!important;
    }
  `;
  document.head.appendChild(st);
}

export class TranscriptSession {
  private stopped = false;
  private panelEl?: HTMLElement;

  constructor(readonly id: string) {}

  async start(): Promise<void> {
    logT("start DOM transcript", this.id);
    try {
      await this.openPanelAndRead();
    } catch (err) {
      logT("failed DOM transcript", err as any);
    }
  }

  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    logT("stop", this.id);
    this.panelEl?.remove();
  }

  private async openPanelAndRead(): Promise<void> {
    if (this.stopped) return;

    const expandBtn = document.getElementById(
      "expand",
    ) as HTMLButtonElement | null;
    if (expandBtn && expandBtn.offsetParent !== null) {
      expandBtn.click();
      await sleep(60);
    }

    const showBtn = document.querySelector<HTMLButtonElement>(
      "ytd-video-description-transcript-section-renderer ytd-button-renderer button",
    );
    if (!showBtn || showBtn.offsetParent === null) {
      throw new Error("Show transcript button not found");
    }
    showBtn.click();

    const panel = await this.waitPanel();
    if (!panel) throw new Error("Transcript panel not found");
    this.panelEl = panel as HTMLElement;

    injectStealthCSS();
    document.body.appendChild(this.panelEl);
    this.panelEl.classList.add("ai-stealth-transcript");

    await this.forceLoadAllSegments(this.panelEl);
   
    const transcript = this.collectText(this.panelEl);
    if (transcript) await this.flush(transcript);
  }

  private waitPanel(timeout = 15_000): Promise<Element | null> {
    return new Promise((resolve) => {
      const ready = (): boolean => {
        const p = document.querySelector(
          'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]',
        );
        if (p && p.querySelector("ytd-transcript-segment-renderer")) {
          resolve(p);
          return true;
        }
        return false;
      };
      if (ready()) return;

      const mo = new MutationObserver(() => ready() && mo.disconnect());
      mo.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        mo.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  private async forceLoadAllSegments(panel: Element): Promise<void> {
    const list = panel.querySelector<HTMLElement>(
      "ytd-transcript-segment-list-renderer #segments-container",
    );
    if (!list) return;

    let prev = 0;
    for (let i = 0; i < 20; i++) {
      // максимум ~2-3 секунды
      list.scrollTo({ top: list.scrollHeight });
      await sleep(120);
      const curr = list.querySelectorAll(
        "ytd-transcript-segment-renderer",
      ).length;
      if (curr === prev || curr === 0) break;
      prev = curr;
    }
  }

  private collectText(panel: Element): string {
    const lines: string[] = [];
    panel
      .querySelectorAll<HTMLElement>("ytd-transcript-segment-renderer")
      .forEach((seg) => {
        const ts =
          seg.querySelector(".segment-timestamp")?.textContent?.trim() ?? "";
        const txt =
          seg.querySelector(".segment-text")?.textContent?.trim() ?? "";
        if (txt) lines.push(`${ts}  ${txt}`);
      });
    return lines.join("\n").trim();
  }

  private async flush(text: string): Promise<void> {
    if (this.stopped || !text) return;
    logT("flush DOM transcript", text.slice(0, 120));

    try {
      await browser.runtime.sendMessage({
        type: "video-transcript",
        videoId: this.id,
        transcript: text,
      });
    } catch (e) {
      logT("background unreachable:", e);
    } finally {
      this.panelEl?.remove();
      this.panelEl = undefined;
    }
  }
}

let active: TranscriptSession | null = null;
export function startTranscript(): void {
  active?.stop();

  const videoId = getVid();
  if (!videoId) {
    console.error("Не удалось определить videoId для транскрибации");
    return;
  }

  active = new TranscriptSession(videoId);
  active.start();
}
