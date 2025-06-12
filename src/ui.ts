/* src/ui.ts */
import browser from "webextension-polyfill";
import { startTranscript } from "./transcript";
import { getVid } from "./utils";

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

const LANG_KEY = "ai_lang";
const DETAIL_KEY = "ai_detail";
async function getSetting<T>(k: string, def: T): Promise<T> {
  const o = await browser.storage.local.get({ [k]: def });
  return (o as any)[k] as T;
}
function setSetting(k: string, v: string) {
  void browser.storage.local.set({ [k]: v });
}

function createDropdown(
  opts: DropdownOption[],
  init: string,
  iconHTML: string,
  storageKey?: string,
  onChange?: (v: string) => void
): HTMLDivElement {
  const dd = document.createElement("div");
  dd.className = "ai-dropdown";

  let sel = opts.find((o) => o.value === init) ?? opts[0];

  const btn = document.createElement("button");
  btn.className = "ai-dropdown-button";
  const renderBtn = () => {
    btn.innerHTML = `
      <span class="ai-icon-left">${iconHTML}</span>${sel.label}
      <span class="ai-icon-right arrow-icon">
        <img src="${browser.runtime.getURL("arrow-down.svg")}" />
      </span>`;
  };
  renderBtn();

  const list = document.createElement("div");
  list.className = "ai-dropdown-content";

  opts.forEach((o) => {
    const item = document.createElement("div");
    item.className =
      "ai-dropdown-item" + (o.value === sel.value ? " selected" : "");
    item.innerHTML = `
      <div style="display:flex;align-items:center;width:100%;">
        <span class="checkmark" style="width:16px;text-align:center;">
          ${o.value === sel.value ? "✓" : ""}
        </span>
        ${
          o.description
            ? `<div style="flex:1;"><div class="title">${o.label}</div><div class="description">${o.description}</div></div>`
            : `<div class="title" style="flex:1;">${o.label}</div>`
        }
      </div>`;

    item.onclick = () => {
      sel = o;
      renderBtn();
      list.querySelectorAll(".ai-dropdown-item").forEach((el) => {
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

  btn.onclick = (e) => {
    e.stopPropagation();
    dd.classList.toggle("active");
    document
      .querySelectorAll(".ai-dropdown")
      .forEach((el) => el !== dd && el.classList.remove("active"));
  };
  if (!(document as any)._aiDDClose) {
    document.addEventListener("click", () =>
      document
        .querySelectorAll(".ai-dropdown")
        .forEach((el) => el.classList.remove("active"))
    );
    (document as any)._aiDDClose = true;
  }

  dd.append(btn, list);
  return dd;
}

export function createSummarizer(
  langInit: string,
  detailInit: string
): HTMLDivElement {
  let mode: "summarize" | "timestamps" | "question" | null = null;
  let currentLang = langInit;
  let currentDetail = detailInit;

  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";
  box.appendChild(
    Object.assign(document.createElement("div"), {
      className: "ai-summarizer-header",
      textContent: "Video Summarizer",
    })
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
      (v) => (currentLang = v)
    ),
    (() => {
      const dd = createDropdown(
        detailLevels,
        detailInit,
        `<img src="${browser.runtime.getURL("settings.svg")}" />`,
        DETAIL_KEY,
        (v) => (currentDetail = v)
      );
      dd.style.marginLeft = "15px";
      return dd;
    })()
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
    "button-send.svg"
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
    q: string | null
  ) =>
    browser.runtime.sendMessage({
      type: "summarizer-request",
      videoId: getVid(),
      button: btn,
      lang: currentLang,
      detail: currentDetail,
      query: q,
    });

  btnSend.onclick = () => {
    if (!input.value.trim()) return;
    postReq("question", input.value.trim());
    beginLoad("          Getting your answer…");
  };

  box.addEventListener("click", (e) => {
    const tgt = (e.target as HTMLElement).closest(".ai-button");
    if (!tgt) return;

    if (mode === "summarize" || mode === "timestamps") {
      beginLoad(
        mode === "summarize"
          ? "          Generating summary…"
          : "          Loading timestamps…"
      );
      postReq(mode, null);
      startTranscript();
    }
  });

  /*─────────────── показать результат ───────────────*/
  function showResult(raw: string) {
    endLoad();
    resultSlot.innerHTML = "";
    const escape = (s: string) =>
      s.replace(
        /[&<>]/g,
        (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;" } as any)[c])
      );

    const toHTML = (txt: string) => {
      let html = escape(txt).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

      const lines = html.split(/\r?\n/);
      const out: string[] = [];
      let para: string[] = [];

      const flushPara = () => {
        if (para.length) {
          out.push(`<p>${para.join("<br>")}</p>`);
          para = [];
        }
      };

      for (const lnRaw of lines) {
        const ln = lnRaw.trimEnd();

        const h = ln.match(/^#{1,6}\s+(.*)$/);
        if (h) {
          flushPara();
          const lvl = Math.min(h[0].indexOf(" "), 6);
          out.push(`<h${lvl + 2}>${h[1]}</h${lvl + 2}>`);
          continue;
        }

        if (/^\s*[\*\-]\s+/.test(ln) || /^\s*\d+[\.\)]\s+/.test(ln)) {
          flushPara();
          out.push(`<li>${ln.replace(/^\s*([\*\-]|\d+[\.\)])\s+/, "")}</li>`);
          continue;
        }

        if (!ln.trim()) {
          flushPara();
          continue;
        }

        para.push(ln);
      }
      flushPara();
      html = out.join("");
      html = html.replace(/(?:<li>.*?<\/li>)+/gs, (m) => {
        const useOl = /^\s*\d/.test(m);
        return `<${useOl ? "ol" : "ul"}>${m}</${useOl ? "ol" : "ul"}>`;
      });
      return html;
    };

    const card = document.createElement("div");
    const head = document.createElement("div");
    const btnCopy = document.createElement("button");
    const btnClose = document.createElement("button");
    const body = document.createElement("div");

    card.className = "ai-result-card";
    head.className = "ai-result-head";
    body.className = "ai-result-text";
    btnCopy.className = "ai-copy-btn";
    btnClose.className = "ai-close-btn";

    btnCopy.innerHTML = `<span class="label">Copy</span><img class="ai-btn-icon" src="${browser.runtime.getURL(
      "copy.svg"
    )}" />`;
    btnClose.innerHTML = `<img class="ai-btn-icon" src="${browser.runtime.getURL(
      "close.svg"
    )}" />`;

    btnCopy.onclick = async () => {
      await navigator.clipboard.writeText(raw);
      const lbl = btnCopy.querySelector(".label") as HTMLElement;
      lbl.textContent = "Copied";
      setTimeout(() => (lbl.textContent = "Copy"), 1000);
    };
    btnClose.onclick = () => {
      resultSlot.innerHTML = "";
    };

    body.innerHTML = toHTML(raw);

    head.append(btnCopy, btnClose);
    card.append(head, body);
    resultSlot.append(card);
  }
  browser.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "summarizer-result" && msg.videoId === getVid()) {
      showResult(msg.result);
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
    "#secondary-inner.style-scope.ytd-watch-flexy"
  );

  if (sec) {
    const panel = createSummarizer(lang, det);
    sec.insertBefore(panel, sec.firstChild);
  } else {
    setTimeout(mountSummarizer, 500);
  }
}

export function resetSummarizerControls(): void {
  document.getElementById("ai-video-summarizer")?.remove();
}
document.addEventListener("DOMContentLoaded", () => void mountSummarizer());
