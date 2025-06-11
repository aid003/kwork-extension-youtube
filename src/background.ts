// src/background.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from "webextension-polyfill";

/*─────────────────────────── Типы ───────────────────────────*/
interface SummarizerRequest {
  type: "summarizer-request";
  videoId: string;
  button: "summarize" | "timestamps" | "question";
  lang: string;
  detail: string;
  query: string | null;
}

interface TranscriptMsg {
  type: "video-transcript";
  videoId: string;
  transcript: string;
}

/*──────────────────── Кэш и очереди ────────────────────────
 * transcriptCache[videoId] → последний полученный расшифр.
 * pending[videoId]         → массив запросов, ждущих текста.
 */
const transcriptCache: Record<string, string> = Object.create(null);
const pending: Record<string, SummarizerRequest[]> = Object.create(null);

/*──────────────────── Отправка на бекенд ───────────────────*/
async function postToBackend(req: SummarizerRequest, transcript: string) {
  const payload = {
    ...req,
    transcript,
    ts: Date.now(),
  };
  console.log("[BG] ➜ backend", payload);

  try {
    const response = await fetch("http://localhost:7392/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("[BG] backend response", data);
  } catch (err) {
    console.error("[BG] backend error:", err);
  }
}

/*─────────────────── Главный listener ─────────────────────*/
browser.runtime.onMessage.addListener((msg: any): void | Promise<void> => {
  /* -------- 1. Пришёл запрос из UI -------- */
  if (msg?.type === "summarizer-request") {
    const req = msg as SummarizerRequest;
    console.log("[BG] store request", req.videoId, req.button);

    /* Если транскрипт уже получен — отвечаем сразу */
    const cached = transcriptCache[req.videoId];
    if (cached) return postToBackend(req, cached);

    /* Иначе ставим в очередь ожидания */
    (pending[req.videoId] ??= []).push(req);
    return;
  }

  /* -------- 2. Пришёл транскрипт -------- */
  if (msg?.type === "video-transcript") {
    const t = msg as TranscriptMsg;
    console.log("[BG] got transcript", t.videoId);

    /* Кэшируем текст */
    transcriptCache[t.videoId] = t.transcript;

    /* Отвечаем на все висящие запросы */
    const queue = pending[t.videoId] ?? [];
    delete pending[t.videoId];

    const posts = queue.map((r) => postToBackend(r, t.transcript));
    return Promise.all(posts).then(() => undefined);
  }
});

/*────────────────── Установка / обновление ─────────────────*/
browser.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed:", details);

  if (details.reason === "install" || details.reason === "update") {
    await browser.tabs.create({ url: browser.runtime.getURL("/welcome.html") });

    const ytTabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    await Promise.all(ytTabs.map((t) => t.id && browser.tabs.reload(t.id)));
  }
});
