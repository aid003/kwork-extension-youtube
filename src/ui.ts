// src/ui.ts
/* eslint-disable @typescript-eslint/no-misused-promises */
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
  { value: "concise", label: "Concise", description: "Main points only" },
  {
    value: "standard",
    label: "Standard",
    description: "Key moments with context",
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "Full chronological breakdown",
  },
];

/*────────────────────────── persistence ──────────────────────────────*/
const LANG_KEY = "ai_lang";
const DETAIL_KEY = "ai_detail";
async function getSetting<T>(k: string, def: T): Promise<T> {
  const o = await browser.storage.local.get({ [k]: def });
  return (o as any)[k] as T;
}
function setSetting(k: string, v: string) {
  void browser.storage.local.set({ [k]: v });
}

/*──────────────────── dropdown generator ─────────────────────────────*/
function createDropdown(
  opts: DropdownOption[],
  initial: string,
  iconHTML: string,
  storageKey?: string,
  onChange?: (v: string) => void,
): HTMLDivElement {
  const dd = document.createElement("div");
  dd.className = "ai-dropdown";

  let selected = opts.find((o) => o.value === initial) ?? opts[0];
  const btn = document.createElement("button");
  btn.className = "ai-dropdown-button";

  const renderBtn = () => {
    btn.innerHTML = `
      <span class="ai-icon-left">${iconHTML}</span>
      ${selected.label}
      <span class="ai-icon-right arrow-icon">
        <img src="${browser.runtime.getURL("arrow-down.svg")}" />
      </span>`;
  };
  renderBtn();

  const content = document.createElement("div");
  content.className = "ai-dropdown-content";

  opts.forEach((o) => {
    const item = document.createElement("div");
    item.className =
      "ai-dropdown-item" + (o.value === selected.value ? " selected" : "");
    item.innerHTML = `
      <div style="display:flex;align-items:center;width:100%;">
        <span class="checkmark" style="width:16px;text-align:center;">
          ${o.value === selected.value ? "✓" : ""}
        </span>
        ${
          o.description
            ? `<div style="flex:1;">
                 <div class="title">${o.label}</div>
                 <div class="description">${o.description}</div>
               </div>`
            : `<div class="title" style="flex:1;">${o.label}</div>`
        }
      </div>`;

    item.addEventListener("click", () => {
      selected = o;
      renderBtn();

      content.querySelectorAll(".ai-dropdown-item").forEach((el) => {
        el.classList.remove("selected");
        const mk = el.querySelector(".checkmark") as HTMLElement | null;
        if (mk) mk.textContent = "";
      });
      item.classList.add("selected");
      (item.querySelector(".checkmark") as HTMLElement).textContent = "✓";

      if (storageKey) setSetting(storageKey, o.value);
      onChange?.(o.value);
      dd.classList.remove("active");
    });

    content.appendChild(item);
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dd.classList.toggle("active");
    document.querySelectorAll(".ai-dropdown").forEach((el) => {
      if (el !== dd) el.classList.remove("active");
    });
  });
  if (!(document as any)._aiGlobalClose) {
    document.addEventListener("click", () =>
      document
        .querySelectorAll(".ai-dropdown")
        .forEach((el) => el.classList.remove("active")),
    );
    (document as any)._aiGlobalClose = true;
  }

  dd.append(btn, content);
  return dd;
}

/*────────────────────────── summarizer UI ─────────────────────────────*/
export function createSummarizer(
  langInit: string,
  detailInit: string,
): HTMLDivElement {
  let mode: "summarize" | "timestamps" | "question" | null = null;
  let currentLang = langInit;
  let currentDetail = detailInit;

  /* root */
  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";

  /* header */
  const head = document.createElement("div");
  head.className = "ai-summarizer-header";
  head.textContent = "Video Summarizer";
  box.appendChild(head);

  /* controls */
  const controls = document.createElement("div");
  controls.className = "ai-summarizer-controls";

  /* row #1 */
  const row1 = document.createElement("div");
  row1.className = "ai-controls-row";
  row1.append(
    createDropdown(
      languages,
      langInit,
      `<img src="${browser.runtime.getURL("language.svg")}" />`,
      LANG_KEY,
      (v) => (currentLang = v),
    ),
  );
  const ddDetail = createDropdown(
    detailLevels,
    detailInit,
    `<img src="${browser.runtime.getURL("settings.svg")}" />`,
    DETAIL_KEY,
    (v) => (currentDetail = v),
  );
  ddDetail.style.marginLeft = "15px";
  row1.append(ddDetail);
  controls.append(row1);

  /* row #2 buttons */
  const row2 = document.createElement("div");
  row2.className = "ai-controls-row";
  Object.assign(row2.style, { display: "flex", gap: "12px", width: "100%" });

  const makeBtn = (txt: string, icon: string) => {
    const b = document.createElement("button");
    b.className = "ai-button";
    b.style.flex = "1";
    b.innerHTML = `<span class="ai-icon">${icon}</span>${txt}`;
    return b;
  };
  const btnSum = makeBtn("Summarize", "✨");
  const btnTim = makeBtn("Timestamps", "⏱️");

  btnSum.addEventListener("click", () => {
    btnSum.classList.toggle("selected");
    btnTim.classList.remove("selected");
    mode = btnSum.classList.contains("selected") ? "summarize" : null;
  });
  btnTim.addEventListener("click", () => {
    btnTim.classList.toggle("selected");
    btnSum.classList.remove("selected");
    mode = btnTim.classList.contains("selected") ? "timestamps" : null;
  });

  row2.append(btnSum, btnTim);
  controls.append(row2);

  /* input + spinner + send */
  const inputWrap = document.createElement("div");
  inputWrap.className = "ai-input-container";

  const spinner = document.createElement("div");
  spinner.className = "ai-loading-spinner";
  inputWrap.append(spinner);

  const input = document.createElement("input");
  input.type = "text";
  input.className = "ai-input";
  input.placeholder = "Ask about the video…";
  inputWrap.append(input);

  const btnSend = document.createElement("button");
  btnSend.className = "ai-send-button";
  btnSend.innerHTML = `<img src="${browser.runtime.getURL(
    "button-send.svg",
  )}" />`;
  inputWrap.append(btnSend);

  /* helpers */
  function beginLoading(text: string) {
    spinner.classList.add("visible");
    input.disabled = true;
    input.placeholder = "";
    input.value = text;
    btnSend.classList.add("hidden");
  }
  function endLoading() {
    spinner.classList.remove("visible");
    input.disabled = false;
    input.value = "";
    input.placeholder = "Ask about the video…";
    btnSend.classList.remove("hidden");
  }
  function postRequest(
    btn: "summarize" | "timestamps" | "question",
    query: string | null,
  ) {
    browser.runtime.sendMessage({
      type: "summarizer-request",
      videoId: getVid(),
      button: btn,
      lang: currentLang,
      detail: currentDetail,
      query,
    });
  }

  /* send button for questions */
  btnSend.addEventListener("click", async () => {
    if (!input.value.trim()) return;
    postRequest("question", input.value.trim());
    beginLoading("          Getting your answer…");
    await new Promise((r) => setTimeout(r, 2000));
    endLoading();
  });

  /* delegate clicks for summarization/timestamps */
  box.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest(
      ".ai-button",
    ) as HTMLButtonElement | null;
    if (!b) return;

    if (mode === "summarize" || mode === "timestamps") {
      const loadingText =
        mode === "summarize"
          ? "          Generating summary…"
          : "          Loading timestamps…";
      postRequest(mode, null);
      beginLoading(loadingText);
      startTranscript();

      // убираем анимацию по таймеру (замените на обработку ответа)
      setTimeout(endLoading, 4000);
    }
  });

  box.append(controls, inputWrap);
  return box;
}

/*───────────────────────── mount & reset ──────────────────────────────*/
export async function mountSummarizer(): Promise<void> {
  if (document.getElementById("ai-video-summarizer")) return;
  const [lang, detail] = await Promise.all([
    getSetting(LANG_KEY, "en"),
    getSetting(DETAIL_KEY, "detailed"),
  ]);

  const related = document.querySelector(
    "#related.style-scope.ytd-watch-flexy",
  );
  if (related)
    related.insertAdjacentElement("afterbegin", createSummarizer(lang, detail));
  else setTimeout(mountSummarizer, 1000);
}

export function resetSummarizerControls(): void {
  document.getElementById("ai-video-summarizer")?.remove();
}

/*──────────────────────── bootstrap ───────────────────────────────────*/
document.addEventListener("DOMContentLoaded", () => void mountSummarizer());
