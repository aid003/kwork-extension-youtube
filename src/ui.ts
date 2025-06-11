/* src/ui.ts
 * Панель AI-Summarizer: выпадашки языка/детализации, кнопки Summarize /
 * Timestamps, поле вопроса, отображение ответа бекенда (копировать / закрыть).
 * Работает вместе с background.ts, который рассылает сообщение
 * { type: "summarizer-result", videoId, button, result }.
 */

import browser from "webextension-polyfill";
import { startTranscript } from "./transcript";
import { getVid } from "./utils";

/*─────────────────────────── constants ────────────────────────────────*/
export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

export const languages: DropdownOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
];

export const detailLevels: DropdownOption[] = [
  { value: "concise",  label: "Concise",  description: "Main points only" },
  { value: "standard", label: "Standard", description: "Key moments with context" },
  { value: "detailed", label: "Detailed", description: "Full chronological breakdown" },
];

/*────────────────────────── persistence ──────────────────────────────*/
const LANG_KEY   = "ai_lang";
const DETAIL_KEY = "ai_detail";
async function getSetting<T>(k: string, def: T): Promise<T> {
  const o = await browser.storage.local.get({ [k]: def });
  return (o as any)[k] as T;
}
function setSetting(k: string, v: string) { void browser.storage.local.set({ [k]: v }); }

/*──────────────────── dropdown generator ─────────────────────────────*/
function createDropdown(
  opts: DropdownOption[],
  init: string,
  icon: string,
  storageKey?: string,
  onChange?: (v: string) => void,
): HTMLDivElement {
  const dd = document.createElement("div");
  dd.className = "ai-dropdown";

  let sel = opts.find(o => o.value === init) ?? opts[0];

  const btn = document.createElement("button");
  btn.className = "ai-dropdown-button";
  const render = () => {
    btn.innerHTML = `
      <span class="ai-icon-left">${icon}</span>${sel.label}
      <span class="ai-icon-right arrow-icon">
        <img src="${browser.runtime.getURL("arrow-down.svg")}" />
      </span>`;
  };
  render();

  const list = document.createElement("div");
  list.className = "ai-dropdown-content";

  opts.forEach(o => {
    const item = document.createElement("div");
    item.className = "ai-dropdown-item" + (o.value === sel.value ? " selected" : "");
    item.innerHTML = `
      <div style="display:flex;align-items:center;width:100%;">
        <span class="checkmark" style="width:16px;text-align:center;">${o.value === sel.value ? "✓" : ""}</span>
        ${
          o.description
            ? `<div style="flex:1;"><div class="title">${o.label}</div><div class="description">${o.description}</div></div>`
            : `<div class="title" style="flex:1;">${o.label}</div>`
        }
      </div>`;
    item.onclick = () => {
      sel = o; render();
      list.querySelectorAll(".ai-dropdown-item").forEach(el => {
        el.classList.remove("selected");
        const mk = el.querySelector(".checkmark") as HTMLElement | null;
        if (mk) mk.textContent = "";
      });
      item.classList.add("selected");
      (item.querySelector(".checkmark") as HTMLElement).textContent = "✓";
      if (storageKey) setSetting(storageKey, o.value);
      onChange?.(o.value);
      dd.classList.remove("active");
    };
    list.appendChild(item);
  });

  btn.onclick = e => {
    e.stopPropagation();
    dd.classList.toggle("active");
    document.querySelectorAll(".ai-dropdown").forEach(el => el !== dd && el.classList.remove("active"));
  };
  if (!(document as any)._aiClose) {
    document.addEventListener("click", () =>
      document.querySelectorAll(".ai-dropdown").forEach(el => el.classList.remove("active")));
    (document as any)._aiClose = true;
  }

  dd.append(btn, list);
  return dd;
}

/*────────────────────────── summarizer UI ─────────────────────────────*/
export function createSummarizer(langInit: string, detailInit: string): HTMLDivElement {
  /* state */
  let mode: "summarize" | "timestamps" | "question" | null = null;
  let currentLang = langInit;
  let currentDetail = detailInit;

  /* root container */
  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";

  /* header */
  box.appendChild(Object.assign(document.createElement("div"), {
    className: "ai-summarizer-header",
    textContent: "Video Summarizer",
  }));

  /* controls */
  const controls = document.createElement("div");
  controls.className = "ai-summarizer-controls";

  /* row 1 — dropdowns */
  const row1 = Object.assign(document.createElement("div"), { className: "ai-controls-row" });
  row1.append(
    createDropdown(
      languages,
      langInit,
      `<img src="${browser.runtime.getURL("language.svg")}" />`,
      LANG_KEY,
      v => (currentLang = v),
    ),
    (() => {
      const dd = createDropdown(
        detailLevels,
        detailInit,
        `<img src="${browser.runtime.getURL("settings.svg")}" />`,
        DETAIL_KEY,
        v => (currentDetail = v),
      );
      dd.style.marginLeft = "15px";
      return dd;
    })(),
  );
  controls.append(row1);

  /* row 2 — mode buttons */
  const row2 = Object.assign(document.createElement("div"), { className: "ai-controls-row" });
  Object.assign(row2.style, { display: "flex", gap: "12px", width: "100%" });

  const mkBtn = (txt: string, ic: string) => {
    const b = document.createElement("button");
    b.className = "ai-button";
    b.style.flex = "1";
    b.innerHTML = `<span class="ai-icon">${ic}</span>${txt}`;
    return b;
  };
  const btnSum = mkBtn("Summarize",  "✨");
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

  /* slot for backend result */
  const resultSlot = document.createElement("div");
  resultSlot.className = "ai-result-slot";
  controls.append(resultSlot);

  /* input + send */
  const inputWrap = Object.assign(document.createElement("div"), { className: "ai-input-container" });

  const spinner = Object.assign(document.createElement("div"), { className: "ai-loading-spinner" });
  inputWrap.append(spinner);

  const input = Object.assign(document.createElement("input"), {
    className: "ai-input",
    placeholder: "Ask about the video…",
  });
  inputWrap.append(input);

  const btnSend = Object.assign(document.createElement("button"), {
    className: "ai-send-button",
    innerHTML: `<img src="${browser.runtime.getURL("button-send.svg")}" />`,
  });
  inputWrap.append(btnSend);

  /* loading helpers */
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

  const postReq = (btn: "summarize" | "timestamps" | "question", q: string | null) =>
    browser.runtime.sendMessage({
      type: "summarizer-request",
      videoId: getVid(),
      button: btn,
      lang: currentLang,
      detail: currentDetail,
      query: q,
    });

  /* question send */
  btnSend.onclick = () => {
    if (!input.value.trim()) return;
    postReq("question", input.value.trim());
    beginLoad("          Getting your answer…");
  };

  /* summarize / timestamps click */
  box.addEventListener("click", e => {
    const tgt = (e.target as HTMLElement).closest(".ai-button");
    if (!tgt) return;

    if (mode === "summarize" || mode === "timestamps") {
      const txt = mode === "summarize"
        ? "          Generating summary…"
        : "          Loading timestamps…";
      postReq(mode, null);
      beginLoad(txt);
      startTranscript();
    }
  });

  /* показ ответа бекенда */
  function showResult(result: string) {
    endLoad();
    resultSlot.innerHTML = "";

    const card = document.createElement("div");
    card.className = "ai-result-card";

    const head = Object.assign(document.createElement("div"), { className: "ai-result-head" });
    const btnCopy = Object.assign(document.createElement("button"), {
      className: "ai-copy-btn",
      textContent: "Copy",
    });
    btnCopy.onclick = () => navigator.clipboard.writeText(result);
    const btnClose = Object.assign(document.createElement("button"), {
      className: "ai-close-btn",
      textContent: "×",
    });
    btnClose.onclick = () => (resultSlot.innerHTML = "");
    head.append(btnCopy, btnClose);

    const pre = Object.assign(document.createElement("pre"), {
      className: "ai-result-text",
      textContent: result,
    });
    card.append(head, pre);
    resultSlot.append(card);
  }

  /* receive from background */
  browser.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "summarizer-result" && msg.videoId === getVid()) {
      showResult(msg.result);
    }
  });

  box.append(controls, inputWrap);
  return box;
}

/*───────────────────────── mount & reset ──────────────────────────────*/
export async function mountSummarizer() {
  if (document.getElementById("ai-video-summarizer")) return;
  const [lang, det] = await Promise.all([
    getSetting(LANG_KEY, "en"),
    getSetting(DETAIL_KEY, "detailed"),
  ]);
  const rel = document.querySelector<HTMLDivElement>("#related.style-scope.ytd-watch-flexy");
  if (rel) rel.insertAdjacentElement("afterbegin", createSummarizer(lang, det));
  else setTimeout(mountSummarizer, 1000);
}
export function resetSummarizerControls() {
  document.getElementById("ai-video-summarizer")?.remove();
}

/* bootstrap */
document.addEventListener("DOMContentLoaded", () => void mountSummarizer());
