/* ───────────────────────────────  src/ui.ts  ───────────────────────────────
 * Главный UI-модуль расширения. Панель «Video Summarizer» поддерживает:
 *   • Summary / Timestamps / Question-запросы
 *   • одинаковый блок вывода для всех ответов
 *   • отправку вопроса по клику и клавишей Enter
 *   • корректную обработку ошибок с остановкой спиннера
 * ------------------------------------------------------------------------- */

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

/*────────────────────────── UI-панель ──────────────────────────*/
export function createSummarizer(
  langInit: string,
  detailInit: string,
): HTMLDivElement {
  let mode: "summarize" | "timestamps" | "question" | null = null;
  let currentLang = langInit;
  let currentDetail = detailInit;

  /*──── контейнер + заголовок ────*/
  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";
  box.appendChild(
    Object.assign(document.createElement("div"), {
      className: "ai-summarizer-header",
      textContent: "Video Summarizer",
    }),
  );

  /*──── блок управления ────*/
  const controls = document.createElement("div");
  controls.className = "ai-summarizer-controls";

  /* row 1: язык + детализация */
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

  /* row 2: кнопки Summarize / Timestamps */
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
    btnSum.classList.toggle("selected");
    btnTim.classList.remove("selected");
    mode = btnSum.classList.contains("selected") ? "summarize" : null;
  };
  btnTim.onclick = () => {
    btnTim.classList.toggle("selected");
    btnSum.classList.remove("selected");
    mode = btnTim.classList.contains("selected") ? "timestamps" : null;
  };
  row2.append(btnSum, btnTim);
  controls.append(row2);

  /* слот для результата */
  const resultSlot = document.createElement("div");
  resultSlot.className = "ai-result-slot";
  controls.append(resultSlot);

  /* input «Ask about the video…» + спиннер */
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

  /* helpers beginLoad / endLoad / postReq */
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
  ) =>
    browser.runtime.sendMessage({
      type: "summarizer-request",
      videoId: getVid(),
      button: btn,
      lang: currentLang,
      detail: currentDetail,
      query: q,
    });

  /*──────────────── отправка вопроса ────────────────*/
  const sendQuestion = () => {
    const q = input.value.trim();
    if (!q) return;
    postReq("question", q);
    beginLoad("          Getting your answer…");
    startTranscript(); // ← теперь транскрипт запускается и для вопроса
  };
  btnSend.onclick = sendQuestion;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !input.disabled) {
      e.preventDefault();
      sendQuestion();
    }
  });

  /*──────────────── клики Summarize / Timestamps ────────────────*/
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

  /*──────────────── получение ответа ────────────────*/
  browser.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "summarizer-result" && msg.videoId === getVid()) {
      endLoad();
      showResultCard(resultSlot, String(msg.result ?? "⚠️ Unknown error"));
    }
  });

  box.append(controls, wrap);
  return box;
}

/*────────────────── mount / reset / auto-mount ──────────────────*/
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
