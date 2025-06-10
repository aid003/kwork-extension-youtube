// src/transcript.ts

import browser from "webextension-polyfill";
import { logT, sleep, fmtTime, ensureParam, getVid } from "./utils";

/** Parse JSON3 caption format into lines "M:SS  text" */
function parseJson3(j: any): string {
  return (j?.events ?? [])
    .filter((e: any) => e.segs?.length)
    .map((e: any) => {
      const t = fmtTime(Math.floor((e.tStartMs ?? 0) / 1000));
      const txt = e.segs
        .map((s: any) => s.utf8)
        .join("")
        .trim();
      return `${t}  ${txt}`;
    })
    .join("\n")
    .trim();
}

/** Parse SRV3 (XML) caption format into lines "M:SS  text" */
function parseSrv3(xml: string): string {
  return Array.from(
    xml.matchAll(/<text[^>]*start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)
  )
    .map((m) => {
      const t = fmtTime(Math.floor(parseFloat(m[1])));
      const txt = m[2]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
      return `${t}  ${txt}`;
    })
    .join("\n")
    .trim();
}

export class TranscriptSession {
  private stopped = false;
  private po?: PerformanceObserver;

  constructor(readonly id: string) {}

  /** Entry point: try all three methods in order */
  async start() {
    logT("start", this.id);

    // 1️⃣ captionTrack in playerResponse
    const track = await this.tryGetCaptionTrack();
    if (this.stopped) return;
    if (track) {
      try {
        const txt = await this.downloadTrack(track);
        if (txt) {
          return this.flush(txt);
        }
      } catch {}
    }

    // 2️⃣ intercept /api/timedtext via PerformanceObserver
    if (await this.interceptTimedText()) return;

    // 3️⃣ fallback: open native transcript panel & scrape DOM
    await this.openPanelAndRead();
  }

  stop() {
    if (this.stopped) return;
    this.stopped = true;
    this.po?.disconnect();
    logT("stop", this.id);
  }

  /** 1️⃣ captionTracks approach */
  private async tryGetCaptionTrack(timeout = 10000): Promise<string | null> {
    const t0 = performance.now();
    while (performance.now() - t0 < timeout && !this.stopped) {
      const pr: any = (window as any).ytInitialPlayerResponse;
      if (pr?.videoDetails?.videoId === this.id) {
        const t =
          pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks?.[0];
        if (t?.baseUrl) {
          logT("captionTrack found");
          return ensureParam(t.baseUrl, "fmt", "json3");
        }
        return null;
      }
      await sleep(300);
    }
    return null;
  }

  /** 2️⃣ PerformanceObserver on /api/timedtext */
  private async interceptTimedText(): Promise<boolean> {
    logT("wait /api/timedtext …");
    try {
      this.po = new PerformanceObserver((list) => {
        for (const it of list.getEntries()) {
          const u = it.name;
          if (u.includes("/api/timedtext") && u.includes(`v=${this.id}`)) {
            this.stop();
            this.downloadTrack(ensureParam(u, "fmt", "json3"))
              .then((txt) => {
                if (txt) {
                  return this.flush(txt);
                }
              })
              .catch(console.error);
            return;
          }
        }
      });
      this.po.observe({ type: "resource", buffered: true });
      await sleep(6000);
    } catch {
      // PerformanceObserver not supported
    }
    return !!this.stopped;
  }

  /** 3️⃣ Click “Show transcript”, hide panel, scrape DOM */
  private async openPanelAndRead() {
    if (this.stopped) return;
    logT("fallback → open transcript panel");

    // a) expand description if collapsed
    const expandBtn = document.querySelector<HTMLButtonElement>(
      "tp-yt-paper-button#expand, tp-yt-paper-button[aria-label*='more']"
    );
    if (expandBtn && expandBtn.offsetParent !== null) {
      expandBtn.click();
      await sleep(60);
    }

    // b) click “Show transcript”
    const showBtn =
      document.querySelector<HTMLButtonElement>(
        "ytd-video-description-transcript-section-renderer ytd-button-renderer button"
      ) ??
      document.querySelector<HTMLButtonElement>(
        "ytd-button-renderer button span, ytd-button-renderer button"
      );
    if (showBtn && /transcript/i.test(showBtn.textContent || "")) {
      showBtn.click();
    } else {
      // fallback old menu
      const moreBtn = document.querySelector<HTMLButtonElement>(
        "#button[aria-label*='More actions'], #button[aria-label*='Ещё']"
      );
      if (moreBtn) {
        moreBtn.click();
        await sleep(60);
        const menuItem =
          document.querySelector(
            "ytd-menu-service-item-renderer[aria-label*='Transcript'], ytd-menu-service-item-renderer[aria-label*='Субтитры']"
          ) ||
          document.querySelector(
            "tp-yt-paper-item[role='menuitem'][aria-label*='Transcript'], tp-yt-paper-item[role='menuitem'][aria-label*='Субтитры']"
          );
        (menuItem as HTMLElement)?.click();
      }
    }

    // c) wait for panel and hide it
    const panel = await this.waitPanel();
    if (!panel) {
      logT("panel not found");
      return;
    }
    (panel as HTMLElement).style.cssText = `
      position: fixed !important;
      top: -9999px !important;
      left: -9999px !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    `;

    const text = this.readFromPanel(panel);
    if (text) await this.flush(text);
  }

  private waitPanel(timeout = 15000): Promise<Element | null> {
    return new Promise((res) => {
      const ready = () => {
        const p = document.querySelector(
          'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
        );
        if (p && p.querySelector("ytd-transcript-segment-renderer")) {
          res(p);
          return true;
        }
        return false;
      };
      if (ready()) return;
      const mo = new MutationObserver(() => ready() && mo.disconnect());
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        mo.disconnect();
        res(null);
      }, timeout);
    });
  }

  private readFromPanel(panel: Element): string {
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

  /** Fetch and parse track URL */
  private async downloadTrack(url: string): Promise<string> {
    logT("download", url.slice(0, 120) + "…");
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.statusText);
    const fmt = new URL(url).searchParams.get("fmt") || "";
    if (fmt === "json3") return parseJson3(await r.json());
    if (fmt === "srv3") return parseSrv3(await r.text());
    try {
      return parseJson3(await r.clone().json());
    } catch {
      return parseSrv3(await r.text());
    }
  }

  /** Send transcript to background */
  private async flush(text: string) {
    if (this.stopped || !text) return;
    logT("flush", text.slice(0, 110) + "…");
    try {
      await browser.runtime.sendMessage({
        type: "video-transcript",
        videoId: this.id,
        transcript: text,
      });
    } catch (e) {
      logT("background unreachable:", e);
    }
  }
}
