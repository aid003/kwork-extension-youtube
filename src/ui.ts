/* eslint-disable @typescript-eslint/no-explicit-any */
import browser from "webextension-polyfill";
import { startTranscript } from "./transcript";
import { getVid } from "./utils";

import {
  languages,
  detailLevels,
  LANG_KEY,
  DETAIL_KEY,
  getSetting,
  createDropdown,
  showResultCard,
} from "./ui-core";

export type { DropdownOption } from "./ui-core";
export { languages, detailLevels } from "./ui-core";

export function createSummarizer(
  langInit: string,
  detailInit: string,
): HTMLDivElement {
  const FLASH_MS = 200;

  let mode: "summarize" | "timestamps" | "question" | null = null;
  let currentLang = langInit;
  let currentDetail = detailInit;

  let activePort: browser.Runtime.Port;

  const initPort = () => {
    activePort = browser.runtime.connect({ name: "summarizer" });

    activePort.postMessage({ type: "init-port", videoId: getVid() });

    const pingTimer = setInterval(() => {
      try {
        activePort.postMessage({ type: "ping" });
      } catch {}
    }, 25_000);

    activePort.onDisconnect.addListener(() => {
      clearInterval(pingTimer);
      initPort();
    });

    activePort.onMessage.addListener((msg) => {
      if (msg?.type === "summarizer-result" && msg.videoId === getVid()) {
        endLoad();
        showResultCard(resultSlot, String(msg.result ?? "⚠️ Unknown error"));
      }
    });
  };

  initPort();

  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";
  box.appendChild(
    Object.assign(document.createElement("div"), {
      className: "ai-summarizer-header",
      textContent: "Video Summarizer",
    }),
  );

  const controls = document.createElement("div");
  controls.className = "ai-summarizer-controls";

  const row1 = Object.assign(document.createElement("div"), {
    className: "ai-controls-row",
  });
  row1.append(
    createDropdown(
      languages,
      langInit,
      `<img src="${browser.runtime.getURL("language.svg")}" />`,
      LANG_KEY,
      (v) => (currentLang = v),
    ),
    (() => {
      const dd = createDropdown(
        detailLevels,
        detailInit,
        `<img src="${browser.runtime.getURL("settings.svg")}" />`,
        DETAIL_KEY,
        (v) => (currentDetail = v),
      );
      dd.style.marginLeft = "15px";
      return dd;
    })(),
  );
  controls.append(row1);

  const row2 = Object.assign(document.createElement("div"), {
    className: "ai-controls-row",
  });
  Object.assign(row2.style, { display: "flex", gap: "12px", width: "100%" });

  const mkBtn = (txt: string, ic: string) => {
    const b = document.createElement("button");
    b.className = "ai-button";
    b.style.flex = "1";
    b.innerHTML = `<span class="ai-icon">${ic}</span>${txt}`;
    return b;
  };
  const btnSum = mkBtn("Summarize", "✨");
  const btnTim = mkBtn("Timestamps", "⏱️");

  btnSum.onclick = () => {
    btnSum.classList.remove("selected");
    btnTim.classList.remove("selected");
    mode = "summarize";
    setTimeout(() => btnSum.classList.add("selected"), FLASH_MS);
  };

  btnTim.onclick = () => {
    btnTim.classList.remove("selected");
    btnSum.classList.remove("selected");
    mode = "timestamps";
    setTimeout(() => btnTim.classList.add("selected"), FLASH_MS);
  };

  row2.append(btnSum, btnTim);
  controls.append(row2);

  const resultSlot = document.createElement("div");
  resultSlot.className = "ai-result-slot";
  controls.append(resultSlot);

  const wrap = document.createElement("div");
  wrap.className = "ai-input-container";
  const spinner = document.createElement("div");
  spinner.className = "ai-loading-spinner";
  const input = Object.assign(document.createElement("input"), {
    className: "ai-input",
    placeholder: "Ask about the video…",
  });
  const btnSend = document.createElement("button");
  btnSend.className = "ai-send-button";
  btnSend.innerHTML = `<img src="${browser.runtime.getURL(
    "button-send.svg",
  )}" />`;
  wrap.append(spinner, input, btnSend);

  const beginLoad = (txt: string) => {
    spinner.classList.add("visible");
    input.disabled = true;
    input.value = txt;
    btnSend.classList.add("hidden");
  };
  const endLoad = () => {
    spinner.classList.remove("visible");
    input.disabled = false;
    input.value = "";
    btnSend.classList.remove("hidden");
  };

  const postReq = (
    btn: "summarize" | "timestamps" | "question",
    q: string | null,
  ) => {
    activePort.postMessage({
      type: "summarizer-request",
      videoId: getVid(),
      button: btn,
      lang: currentLang,
      detail: currentDetail,
      query: q,
    });
  };

  const sendQuestion = () => {
    const q = input.value.trim();
    if (!q) return;
    postReq("question", q);
    beginLoad("          Getting your answer…");
    startTranscript();
  };
  btnSend.onclick = sendQuestion;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !input.disabled) {
      e.preventDefault();
      sendQuestion();
    }
  });

  box.addEventListener("click", (e) => {
    const tgt = (e.target as HTMLElement).closest(".ai-button");
    if (!tgt) return;

    if (mode === "summarize" || mode === "timestamps") {
      beginLoad(
        mode === "summarize"
          ? "          Generating summary…"
          : "          Loading timestamps…",
      );
      postReq(mode, null);
      startTranscript();
    }
  });

  browser.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "summarizer-result" && msg.videoId === getVid()) {
      endLoad();
      showResultCard(resultSlot, String(msg.result ?? "⚠️ Unknown error"));
    }
  });

  box.append(controls, wrap);
  return box;
}

export async function mountSummarizer(): Promise<void> {
  if (document.getElementById("ai-video-summarizer")) return;

  const [lang, det] = await Promise.all([
    getSetting(LANG_KEY, "en"),
    getSetting(DETAIL_KEY, "detailed"),
  ]);

  const sec = document.querySelector<HTMLDivElement>(
    "#secondary-inner.style-scope.ytd-watch-flexy",
  );

  if (sec) {
    sec.insertBefore(createSummarizer(lang, det), sec.firstChild);
  } else {
    setTimeout(mountSummarizer, 500);
  }
}

export function resetSummarizerControls(): void {
  document.getElementById("ai-video-summarizer")?.remove();
}

document.addEventListener("DOMContentLoaded", () => void mountSummarizer());
