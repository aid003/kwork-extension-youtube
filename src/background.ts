/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from "webextension-polyfill";

/*────────────── Типы ─────────────*/
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
interface BackendResponse {
  result: string;
}

/*── кэш / очередь ──*/
const transcriptCache: Record<string, string> = Object.create(null);
const pending: Record<string, SummarizerRequest[]> = Object.create(null);

/*──────────── post → backend + broadcast табам ───────────*/
async function postToBackend(req: SummarizerRequest, transcript: string) {
  const payload = { ...req, transcript, ts: Date.now() };
  console.log("[BG] ➜ backend", payload);

  try {
    const r = await fetch("http://localhost:7392/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: BackendResponse = await r.json();
    console.log("[BG] backend response", data);

    /* рассылаем результат всем вкладкам YouTube */
    const tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    for (const t of tabs) {
      if (t.id)
        browser.tabs.sendMessage(t.id, {
          type: "summarizer-result",
          videoId: req.videoId,
          button: req.button,
          result: data.result,
        });
    }
  } catch (err) {
    console.error("[BG] backend error:", err);
  }
}

/*──────────── основной listener ───────────*/
browser.runtime.onMessage.addListener((msg: any): void | Promise<void> => {
  if (msg?.type === "summarizer-request") {
    const req = msg as SummarizerRequest;
    const cached = transcriptCache[req.videoId];
    if (cached) return postToBackend(req, cached);
    (pending[req.videoId] ??= []).push(req);
    return;
  }

  if (msg?.type === "video-transcript") {
    const t = msg as TranscriptMsg;
    transcriptCache[t.videoId] = t.transcript;

    const queue = pending[t.videoId] ?? [];
    delete pending[t.videoId];
    return Promise.all(queue.map((r) => postToBackend(r, t.transcript))).then(
      () => undefined,
    );
  }
});

/*──────────── install/update ───────────*/
browser.runtime.onInstalled.addListener(async (d) => {
  if (d.reason === "install" || d.reason === "update") {
    await browser.tabs.create({ url: browser.runtime.getURL("/welcome.html") });
    const tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    await Promise.all(tabs.map((t) => t.id && browser.tabs.reload(t.id)));
  }
});
