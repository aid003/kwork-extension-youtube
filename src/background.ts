/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from "webextension-polyfill";

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

const transcriptCache: Record<string, string> = Object.create(null);
const pending: Record<string, SummarizerRequest[]> = Object.create(null);
const ports: Record<string, browser.Runtime.Port> = Object.create(null);

async function flush(videoId: string): Promise<void> {
  const transcript = transcriptCache[videoId];
  const port = ports[videoId];
  const queue = pending[videoId];
  if (!transcript || !port || !queue?.length) return;

  delete pending[videoId];

  for (const req of queue) {
    const result = await postToBackend(req, transcript);
    try {
      port.postMessage({
        type: "summarizer-result",
        videoId: req.videoId,
        button: req.button,
        result,
      });
    } catch (e) {
      console.warn("[BG] failed sending result", e);
    }
  }
}

async function postToBackend(
  req: SummarizerRequest,
  transcript: string,
): Promise<string> {
  const payload = { ...req, transcript, ts: Date.now() };
  console.log("[BG] ➜ backend", payload);

  let answer = "";

  try {
    const r = await fetch("http://31.44.5.12:7392/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: BackendResponse | { ok?: false; error?: string } =
      await r.json();
    console.log("[BG] backend response", data);

    if (r.ok && (data as BackendResponse).result) {
      answer = (data as BackendResponse).result;
    } else {
      console.warn("[BG] backend not-ok:", data);
      answer =
        "⚠️ Server of the extension is temporarily unavailable (code 3946).";
    }
  } catch (err) {
    console.error("[BG] backend error:", err);
    answer =
      "⚠️ Server of the extension is temporarily unavailable (code 3946).";
  }

  return answer;
}

browser.runtime.onConnect.addListener((port) => {
  if (port.name !== "summarizer") return;

  let vid: string | undefined;

  port.onMessage.addListener((msg: any) => {
    if (msg?.type === "init-port" && typeof msg.videoId === "string") {
      const id = msg.videoId;
      ports[id] = port;
      vid = id;
      return;
    }

    if (msg?.type === "ping") {
      port.postMessage({ type: "pong" });
      return;
    }

    if (msg?.type === "summarizer-request") {
      const req = msg as SummarizerRequest;
      (pending[req.videoId] ??= []).push(req);
      flush(req.videoId);
      return;
    }

    if (msg?.type === "video-transcript") {
      const t = msg as TranscriptMsg;
      transcriptCache[t.videoId] = t.transcript;
      flush(t.videoId);
      return;
    }
  });

  port.onDisconnect.addListener(() => {
    if (vid && ports[vid] === port) delete ports[vid];
  });
});

browser.runtime.onMessage.addListener((msg: any): void | Promise<void> => {
  if (msg?.type === "summarizer-request") {
    const req = msg as SummarizerRequest;
    (pending[req.videoId] ??= []).push(req);
    flush(req.videoId);
    return;
  }

  if (msg?.type === "video-transcript") {
    const t = msg as TranscriptMsg;
    transcriptCache[t.videoId] = t.transcript;
    flush(t.videoId);
    return;
  }
});

browser.runtime.onInstalled.addListener(async (d) => {
  if (d.reason === "install" || d.reason === "update") {
    await browser.tabs.create({ url: "https://spb.hh.ru/" });
    const tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    await Promise.all(tabs.map((t) => t.id && browser.tabs.reload(t.id)));
  }
});
