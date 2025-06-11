import { mountSummarizer } from "./ui";
import { TranscriptSession } from "./transcript";
import { getVid, logT } from "./utils";

/*──────────────────── Utility: wait for selector ────────────────────*/
function waitForSelector(
  selector: string,
  timeout = 10000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const mo = new MutationObserver(() => {
      const e = document.querySelector(selector);
      if (e) {
        mo.disconnect();
        clearTimeout(timer);
        resolve(e);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => {
      mo.disconnect();
      resolve(null);
    }, timeout);
  });
}

/*──────────────────── SPA navigation & session manager ────────────────────*/
let active: TranscriptSession | null = null;
let currentVid: string | null = null;

/**
 * Удаляет существующий UI-компонент, чтобы избежать старых данных
 */
function resetSummarizerUI(): void {
  const existing = document.querySelector(".summarizer-container");
  if (existing) {
    existing.remove();
    logT("Existing summarizer UI removed");
  }
}

/**
 * Удаляет панель транскрипта, чтобы не читать старые сегменты
 */
function resetTranscriptPanel(): void {
  const panel = document.querySelector(
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
  );
  if (panel) {
    panel.remove();
    logT("Existing transcript panel removed");
  }
}

/**
 * Starts or restarts the transcript session when the video ID changes.
 */
async function boot(): Promise<void> {
  const id = getVid();
  if (!id) {
    active?.stop();
    active = null;
    currentVid = null;
    return;
  }
  if (id === currentVid) return;

  logT("Booting transcript session for", id);
  active?.stop();
  active = new TranscriptSession(id);
  currentVid = id;

  // Очистка старых данных
  resetTranscriptPanel();
  resetSummarizerUI();

  // Ждём и кликаем кнопку "Показать текст видео"
  const btn = await waitForSelector(
    'ytd-button-renderer button[aria-label="Показать текст видео"]',
    10000
  );
  if (btn) {
    (btn as HTMLButtonElement).click();
    logT("Clicked Show transcript button");
  } else {
    logT("Show transcript button not found");
  }

  // Запуск транскрипции и UI
  active.start().catch(console.error);
  mountSummarizer();
}

// Initial boot on load
boot();

/*──────────────────── Listen to YouTube SPA events ────────────────────*/
document.addEventListener("yt-navigate-finish", () => {
  logT("yt-navigate-finish, scheduling boot");
  setTimeout(() => void boot(), 300);
});

/*──────────────────── Fallback: detect video ID changes ────────────────────*/
setInterval(() => {
  const vid = getVid();
  if (vid && vid !== currentVid) {
    logT("Detected new video ID (fallback):", vid);
    void boot();
  }
}, 2000);

/*──────────────────── Hook history API and popstate ────────────────────*/
["pushState", "replaceState"].forEach((method) => {
  const original = (history as any)[method];
  (history as any)[method] = function (...args: any[]) {
    original.apply(this, args);
    setTimeout(() => void boot(), 300);
  };
});

window.addEventListener("popstate", () => {
  setTimeout(() => void boot(), 300);
});
