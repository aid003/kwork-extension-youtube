// /**********************************************************************
//  *  content.ts  — YouTube extension (transcription-only version)
//  *  (2025-03-09 build – adds timestamps + hides YouTube transcript panel)
//  *  ──────────────────────────────────────────────────────────────────
//  *  Transcript engine, workflow:
//  *      1. captionTracks  → fmt=json3  (preferred, gives clean text)
//  *      2. intercept /api/timedtext   (same result as #1)
//  *      3. open YouTube “Show transcript” panel → scrape DOM
//  *         ▸ сразу прячем панель, чтобы пользователь её не видел
//  *      4. Отправляем текст + тайм-коды в background-script
//  *
//  *  Output format (string):
//  *      0:00  Hello everyone …
//  *      0:07  Today we’ll …
//  *      0:14  First of all …
//  *********************************************************************/

// import browser from "webextension-polyfill";

// /*───────────────────────────── UI − helpers ────────────────────────────*/

// interface DropdownOption {
//   value: string;
//   label: string;
//   description?: string;
// }

// /* Languages for future use (LLM summarisation etc.) */
// const languages: DropdownOption[] = [
//   { value: "en", label: "English" },
//   { value: "es", label: "Español" },
//   { value: "fr", label: "Français" },
//   { value: "it", label: "Italiano" },
//   { value: "pt", label: "Português" }
// ];

// const detailLevels: DropdownOption[] = [
//   { value: "concise",  label: "Concise",  description: "Main points only" },
//   { value: "standard", label: "Standard", description: "Key moments with context" },
//   { value: "detailed", label: "Detailed", description: "Full chronological breakdown" }
// ];

// /* … ---------------  UI-helpers / summarizer (без изменений) ---------- */
// function createDropdown(
//   options: DropdownOption[],
//   initialValue: string,
//   icon: string
// ) {
//   const dropdown = document.createElement("div");
//   dropdown.className = "ai-dropdown";

//   const selected = options.find(o => o.value === initialValue) || options[0];

//   const button = document.createElement("button");
//   button.className = "ai-dropdown-button";
//   button.innerHTML = `
//     <span class="ai-icon-left">${icon}</span>${selected.label}
//     <span class="ai-icon-right arrow-icon">
//       <img src="${browser.runtime.getURL("arrow-down.svg")}" />
//     </span>`;

//   const content = document.createElement("div");
//   content.className = "ai-dropdown-content";

//   options.forEach(o => {
//     const item = document.createElement("div");
//     item.className =
//       "ai-dropdown-item" + (o.value === initialValue ? " selected" : "");
//     item.innerHTML = `
//       <div style="display:flex;align-items:center;width:100%;">
//         <span class="checkmark" style="width:16px;text-align:center;">
//           ${o.value === initialValue ? "✓" : ""}
//         </span>
//         ${
//           o.description
//             ? `<div style="flex:1;">
//                  <div class="title">${o.label}</div>
//                  <div class="description">${o.description}</div>
//                </div>`
//             : `<div class="title" style="flex:1;">${o.label}</div>`
//         }
//       </div>`;

//     item.addEventListener("click", () => {
//       button.innerHTML = `
//         <span class="ai-icon-left">${icon}</span><span>${o.label}</span>
//         <span class="ai-icon-right arrow-icon">
//           <img src="${browser.runtime.getURL("arrow-down.svg")}" />
//         </span>`;

//       content.querySelectorAll(".ai-dropdown-item").forEach(el => {
//         el.classList.remove("selected");
//         const mk = el.querySelector(".checkmark") as HTMLElement | null;
//         if (mk) mk.textContent = "";
//       });
//       item.classList.add("selected");
//       const mk = item.querySelector(".checkmark") as HTMLElement | null;
//       if (mk) mk.textContent = "✓";

//       dropdown.classList.remove("active");
//     });

//     content.appendChild(item);
//   });

//   button.addEventListener("click", e => {
//     e.stopPropagation();
//     dropdown.classList.toggle("active");
//     document.querySelectorAll(".ai-dropdown").forEach(el => {
//       if (el !== dropdown) el.classList.remove("active");
//     });
//   });
//   document.addEventListener("click", () => dropdown.classList.remove("active"));

//   dropdown.appendChild(button);
//   dropdown.appendChild(content);
//   return dropdown;
// }

// /*──────────────────────────── Video-Summarizer (UI) ────────────────────*/

// function createSummarizer() {
//   const box = document.createElement("div");
//   box.id = "ai-video-summarizer";
//   box.className = "ai-summarizer-container";

//   const head = document.createElement("div");
//   head.className = "ai-summarizer-header";
//   head.textContent = "Video Summarizer";

//   const controls = document.createElement("div");
//   controls.className = "ai-summarizer-controls";

//   const r1 = document.createElement("div");
//   r1.className = "ai-controls-row";
//   r1.appendChild(
//     createDropdown(
//       languages,
//       "en",
//       `<img src="${browser.runtime.getURL("language.svg")}" />`
//     )
//   );
//   const lvl = createDropdown(
//     detailLevels,
//     "detailed",
//     `<img src="${browser.runtime.getURL("settings.svg")}" />`
//   );
//   lvl.style.marginLeft = "15px";
//   r1.appendChild(lvl);
//   controls.appendChild(r1);

//   const r2 = document.createElement("div");
//   r2.className = "ai-controls-row";
//   r2.style.display = "flex";
//   r2.style.gap = "12px";
//   r2.style.width = "100%";
//   let mode: "summarize" | "timestamps" | "question" | null = null;

//   const mkBtn = (txt: string, ic: string) => {
//     const b = document.createElement("button");
//     b.className = "ai-button";
//     b.style.flex = "1";
//     b.innerHTML = `<span class="ai-icon">${ic}</span> ${txt}`;
//     return b;
//   };
//   const bSum = mkBtn("Summarize", "✨");
//   const bTim = mkBtn("Timestamps", "⏱️");

//   bSum.addEventListener("click", () => {
//     bSum.classList.toggle("selected");
//     bTim.classList.remove("selected");
//     mode = bSum.classList.contains("selected") ? "summarize" : null;
//   });
//   bTim.addEventListener("click", () => {
//     bTim.classList.toggle("selected");
//     bSum.classList.remove("selected");
//     mode = bTim.classList.contains("selected") ? "timestamps" : null;
//   });

//   r2.appendChild(bSum);
//   r2.appendChild(bTim);
//   controls.appendChild(r2);

//   const wrap = document.createElement("div");
//   wrap.className = "ai-input-container";

//   const spin = document.createElement("div");
//   spin.className = "ai-loading-spinner";
//   wrap.appendChild(spin);

//   const inp = document.createElement("input");
//   inp.type = "text";
//   inp.className = "ai-input";
//   inp.placeholder = "Ask about the video…";
//   wrap.appendChild(inp);

//   const send = document.createElement("button");
//   send.className = "ai-send-button";
//   send.innerHTML = `<img src="${browser.runtime.getURL("button-send.svg")}" />`;
//   wrap.appendChild(send);

//   send.addEventListener("click", async () => {
//     if (!mode && !inp.value.trim()) return;
//     if (!mode && inp.value.trim()) mode = "question";

//     send.classList.add("hidden");
//     spin.classList.add("visible");
//     inp.disabled = true;
//     inp.classList.add("loading");

//     const ph = inp.placeholder;
//     inp.placeholder = "";
//     inp.value =
//       mode === "timestamps"
//         ? "          Loading timestamps…"
//         : mode === "summarize"
//         ? "          Generating summary…"
//         : "          Getting your answer…";

//     // TODO: call background script / LLM here
//     await new Promise(r => setTimeout(r, 1800));

//     send.classList.remove("hidden");
//     spin.classList.remove("visible");
//     inp.disabled = false;
//     inp.classList.remove("loading");
//     inp.value = "";
//     inp.placeholder = ph;
//     if (mode === "question") mode = null;
//   });

//   box.appendChild(head);
//   box.appendChild(controls);
//   box.appendChild(wrap);
//   return box;
// }

// /* Inject UI next to the related-videos column */
// function injectSummarizer() {
//   if (document.getElementById("ai-video-summarizer")) return;
//   const rel = document.querySelector("#related.style-scope.ytd-watch-flexy");
//   if (rel) {
//     rel.insertAdjacentElement("afterbegin", createSummarizer());
//     console.log("[YT-AI] summarizer injected");
//   } else {
//     setTimeout(injectSummarizer, 1000);
//   }
// }
// function handleNavigation() {
//   document.getElementById("ai-video-summarizer")?.remove();
//   injectSummarizer();
// }
// injectSummarizer();
// new MutationObserver(muts => {
//   if (
//     muts.some(mu => mu.type === "childList") &&
//     location.pathname === "/watch" &&
//     !document.getElementById("ai-video-summarizer")
//   ) {
//     handleNavigation();
//   }
// }).observe(document.body, { childList: true, subtree: true });

// /*──────────────────────────── Transcript engine ─────────────────────────*/

// const logT = (...a: unknown[]) => console.log("[YT-Transcript]", ...a);
// const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// function getVid(): string | null {
//   return new URLSearchParams(location.search).get("v");
// }

// /* helper – seconds →  H:MM:SS  |  M:SS */
// function fmtTime(sec: number): string {
//   const h = Math.floor(sec / 3600);
//   const m = Math.floor((sec % 3600) / 60);
//   const s = sec % 60;
//   const two = (n: number) => n.toString().padStart(2, "0");
//   return h ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
// }

// /* json3 →  "0:05 Text" newline-separated */
// function parseJson3(j: any): string {
//   return (j?.events ?? [])
//     .filter((e: any) => e.segs?.length)
//     .map((e: any) => {
//       const t = fmtTime(Math.floor((e.tStartMs ?? 0) / 1000));
//       const txt = e.segs.map((s: any) => s.utf8).join("").trim();
//       return `${t}  ${txt}`;
//     })
//     .join("\n")
//     .trim();
// }

// /* srv3 →  "0:05 Text" newline-separated */
// function parseSrv3(xml: string): string {
//   return Array.from(
//     xml.matchAll(/<text[^>]*start="([\d.]+)".*?>([\s\S]*?)<\/text>/g)
//   )
//     .map(m => {
//       const t = fmtTime(Math.floor(parseFloat(m[1])));
//       const txt = m[2]
//         .replace(/&amp;/g, "&")
//         .replace(/&lt;/g, "<")
//         .replace(/&gt;/g, ">")
//         .replace(/\s+/g, " ")
//         .trim();
//       return `${t}  ${txt}`;
//     })
//     .join("\n")
//     .trim();
// }

// function ensureParam(u: string, key: string, value: string) {
//   return u.includes(`${key}=`) ? u : u + (u.includes("?") ? "&" : "?") + `${key}=${value}`;
// }

// class TranscriptSession {
//   private stopped = false;
//   private po?: PerformanceObserver;
//   constructor(readonly id: string) {}

//   /* ─────────── kick-off ─────────── */
//   async start() {
//     logT("start", this.id);

//     /* 1️⃣ captionTrack */
//     const track = await this.tryGetCaptionTrack();
//     if (this.stopped) return;
//     if (track) {
//       const txt = await this.downloadTrack(track).catch(() => "");
//       if (txt) return this.flush(txt);
//     }

//     /* 2️⃣ intercept /api/timedtext */
//     if (await this.interceptTimedText()) return;

//     /* 3️⃣ fallback: open native transcript panel & scrape DOM */
//     await this.openPanelAndRead();
//   }

//   stop() {
//     if (this.stopped) return;
//     this.stopped = true;
//     this.po?.disconnect();
//     logT("stop", this.id);
//   }

//   /* ---------- captionTracks ---------- */
//   private async tryGetCaptionTrack(timeout = 10_000): Promise<string | null> {
//     const t0 = performance.now();
//     while (performance.now() - t0 < timeout && !this.stopped) {
//       const pr: any = (window as any).ytInitialPlayerResponse;
//       if (pr?.videoDetails?.videoId === this.id) {
//         const t = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks?.[0];
//         if (t?.baseUrl) {
//           logT("captionTrack found");
//           return ensureParam(t.baseUrl, "fmt", "json3");
//         }
//         return null;
//       }
//       await sleep(300);
//     }
//     return null;
//   }

//   /* ---------- /api/timedtext interception ---------- */
//   private async interceptTimedText(): Promise<boolean> {
//     logT("wait /api/timedtext …");
//     try {
//       this.po = new PerformanceObserver(list => {
//         for (const it of list.getEntries()) {
//           const u = it.name;
//           if (u.includes("/api/timedtext") && u.includes(`v=${this.id}`)) {
//             this.stop();
//             this.downloadTrack(ensureParam(u, "fmt", "json3"))
//               .then(txt => { if (txt) return this.flush(txt); })
//               .catch(console.error);
//             return;
//           }
//         }
//       });
//       this.po.observe({ type: "resource", buffered: true });

//       await sleep(6_000);
//     } catch { /* PerformanceObserver not available */ }
//     return !!this.stopped;
//   }

//   /* ---------- open transcript panel & scrape DOM ---------- */
//   private async openPanelAndRead() {
//     if (this.stopped) return;
//     logT("fallback → open transcript panel");

//     /* 1. раскрыть описание, если нужно */
//     const expand = document.querySelector<HTMLButtonElement>(
//       "tp-yt-paper-button#expand, tp-yt-paper-button[aria-label*='more']"
//     );
//     if (expand && expand.offsetParent !== null) {
//       expand.click();
//       await sleep(300);
//     }

//     /* 2. клик «Show transcript» (новый UI) */
//     const showBtn =
//       document.querySelector<HTMLButtonElement>(
//         "ytd-video-description-transcript-section-renderer ytd-button-renderer button"
//       ) ??
//       document.querySelector<HTMLButtonElement>(
//         "ytd-button-renderer button span, ytd-button-renderer button"
//       );
//     if (showBtn && /transcript/i.test(showBtn.textContent || "")) {
//       showBtn.click();
//     } else {
//       /* 3. старый пункт меню */
//       const moreBtn = document.querySelector<HTMLButtonElement>(
//         "#button[aria-label*='More actions'], #button[aria-label*='Ещё']"
//       );
//       if (moreBtn) {
//         moreBtn.click();
//         await sleep(60);
//         const menuItem =
//           document.querySelector(
//             "ytd-menu-service-item-renderer[aria-label*='Transcript'], ytd-menu-service-item-renderer[aria-label*='Субтитры']"
//           ) ||
//           document.querySelector(
//             "tp-yt-paper-item[role='menuitem'][aria-label*='Transcript'], tp-yt-paper-item[role='menuitem'][aria-label*='Субтитры']"
//           );
//         (menuItem as HTMLElement)?.click();
//       }
//     }

//     /* 4. ждём панель, сразу прячем для UX */
//     const panel = await this.waitPanel();
//     if (!panel) return logT("panel not found");

//     (panel as HTMLElement).style.cssText = `
//       position: fixed !important;
//       top: -9999px !important;
//       left: -9999px !important;
//       width: 0 !important;
//       height: 0 !important;
//       opacity: 0 !important;
//       pointer-events: none !important;`;

//     const txt = this.readFromPanel(panel);
//     if (txt) await this.flush(txt);
//   }

//   private waitPanel(timeout = 15_000): Promise<Element | null> {
//     return new Promise(res => {
//       const ready = () => {
//         const p = document.querySelector(
//           'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
//         );
//         if (p && p.querySelector("ytd-transcript-segment-renderer")) {
//           res(p);
//           return true;
//         }
//         return false;
//       };
//       if (ready()) return;
//       const mo = new MutationObserver(() => ready() && mo.disconnect());
//       mo.observe(document.body, { childList: true, subtree: true });
//       setTimeout(() => {
//         mo.disconnect();
//         res(null);
//       }, timeout);
//     });
//   }

//   private readFromPanel(panel: Element): string {
//     const lines: string[] = [];
//     panel
//       .querySelectorAll<HTMLElement>("ytd-transcript-segment-renderer")
//       .forEach(seg => {
//         const ts =
//           seg.querySelector(".segment-timestamp")?.textContent?.trim() ?? "";
//         const txt =
//           seg.querySelector(".segment-text")?.textContent?.trim() ?? "";
//         if (txt) lines.push(`${ts}  ${txt}`);
//       });
//     return lines.join("\n").trim();
//   }

//   /* ---------- network parsers ---------- */
//   private async downloadTrack(url: string): Promise<string> {
//     logT("download", url.slice(0, 120) + "…");
//     const r = await fetch(url);
//     if (!r.ok) throw new Error(r.statusText);
//     const fmt = new URL(url).searchParams.get("fmt") || "";
//     if (fmt === "json3") return parseJson3(await r.json());
//     if (fmt === "srv3") return parseSrv3(await r.text());

//     /* fallback: try both */
//     try {
//       return parseJson3(await r.clone().json());
//     } catch {
//       return parseSrv3(await r.text());
//     }
//   }

//   /* ---------- flush result to background ---------- */
//   private async flush(text: string) {
//     if (this.stopped || !text) return;
//     logT("flush", text.slice(0, 110) + "…");
//     try {
//       await browser.runtime.sendMessage({
//         type: "video-transcript",
//         videoId: this.id,
//         transcript: text            // newline-separated “time  text”
//       });
//     } catch (e) {
//       logT("background unreachable:", e);
//     }
//   }
// }

// /*───────────────────────── session lifecycle ──────────────────────────*/

// let active: TranscriptSession | null = null;
// function boot() {
//   const id = getVid();
//   if (!id) return active?.stop();
//   if (active?.id === id) return;
//   active?.stop();
//   active = new TranscriptSession(id);
//   active.start().catch(console.error);
// }
// boot();

// /* SPA navigation watcher (YouTube uses History API) */
// let href = location.href;
// setInterval(() => {
//   if (location.href !== href) {
//     href = location.href;
//     boot();
//   }
// }, 150);

import "./navigation";   // navigation импортирует ui  +  transcript + utils
