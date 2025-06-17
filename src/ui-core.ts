/* ───────────────────────────  src/ui-core.ts  ────────────────────────────
 * Общие константы, helpers и renderer для карточек результатов.
 * Поддержка «временных меток»:
 *   • описания фикс-ширины 270 px, выровнены вправо
 *   • контейнер со скроллом (кастомный скроллбар)
 *   • распознаёт строки **с необязательным маркером списка** “- ” или “* ”
 * ------------------------------------------------------------------------ */

import browser from "webextension-polyfill";

/*────────────────────── типы и константы ──────────────────────*/
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
  { value: "ru", label: "Русский" },
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

/*────────────────────── storage-helpers ──────────────────────*/
export const LANG_KEY = "ai_lang";
export const DETAIL_KEY = "ai_detail";

export async function getSetting<T>(k: string, def: T): Promise<T> {
  const o = await browser.storage.local.get({ [k]: def });
  return (o as any)[k] as T;
}
export function setSetting(k: string, v: string) {
  void browser.storage.local.set({ [k]: v });
}

export function createDropdown(
  opts: DropdownOption[],
  init: string,
  iconHTML: string,
  storageKey?: string,
  onChange?: (v: string) => void,
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
            ? `<div style="flex:1;">
                 <div class="title">${o.label}</div>
                 <div class="description">${o.description}</div>
               </div>`
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
        .forEach((el) => el.classList.remove("active")),
    );
    (document as any)._aiDDClose = true;
  }

  dd.append(btn, list);
  return dd;
}

export const escapeHTML = (s: string) =>
  s.replace(
    /[&<>]/g,
    (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;" } as any)[c]),
  );

export function toHTML(txt: string): string {
  let html = escapeHTML(txt).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

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
}

function ensureStyle() {
  if (document.getElementById("ai-ts-style")) return;
  const css = `
    .ai-ts-wrap {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 7px;
    }
    .ai-ts-wrap::-webkit-scrollbar {
      width: 6px;
    }
    .ai-ts-wrap::-webkit-scrollbar-track {
      background: transparent;
    }
    .ai-ts-wrap::-webkit-scrollbar-thumb {
      background: #4a4a4a;
      border-radius: 3px;
    }
    .ai-ts-wrap::-webkit-scrollbar-thumb:hover {
      background: #5a5a5a;
    }

    .ai-ts-row  { display:flex; align-items:center; margin:4px 0; cursor:pointer; }
    .ai-ts-time {
      min-width:43px; height:26px; display:flex; align-items:center; justify-content:center;
      font-family:Roboto; font-weight:500; font-size:16px; line-height:100%;
      color:#3B82F6; background:#699CF133;
      border:1px solid #639EFF73; border-radius:5px; flex-shrink:0;
    }
    .ai-ts-desc {
      width:270px; margin-left:auto;
      padding:4px 8px;
      font-family:Roboto; font-weight:500; font-size:16px; line-height:100%;
      background:#AFAFAF26; border:1px solid #ADADAD59; border-radius:5px; color:#fff;
      display:flex; align-items:center;
    }
  `;
  const style = Object.assign(document.createElement("style"), {
    id: "ai-ts-style",
    textContent: css,
  });
  document.head.append(style);
}

export function showResultCard(resultSlot: HTMLElement, raw: string): void {
  ensureStyle();
  resultSlot.innerHTML = "";

  /* ── Парсер временных меток ── */
  const lines = raw.trim().split(/\r?\n/);
  const tsRe = /^\s*(?:[\-\*]\s*)?\[(\d{1,2}:\d{2})]\s*(.+)$/; // ← допускает «- » или «* »
  const isTS = lines.filter((l) => l.trim()).every((l) => tsRe.test(l));

  if (isTS) {
    const wrap = document.createElement("div");
    wrap.className = "ai-ts-wrap";

    lines.forEach((l) => {
      const m = l.match(tsRe);
      if (!m) return;
      const [, t, txt] = m;

      const row = document.createElement("div");
      row.className = "ai-ts-row";
      row.dataset.time = t;

      const time = Object.assign(document.createElement("div"), {
        className: "ai-ts-time",
        textContent: t,
      });
      const desc = Object.assign(document.createElement("div"), {
        className: "ai-ts-desc",
        textContent: txt.trim(),
      });

      const seek = () => {
        const [min, sec] = t.split(":").map((n) => parseInt(n, 10));
        const v = document.querySelector<HTMLVideoElement>("video");
        if (v) v.currentTime = min * 60 + sec;
      };
      row.onclick = seek;
      time.onclick = seek;
      desc.onclick = seek;

      row.append(time, desc);
      wrap.append(row);
    });

    resultSlot.append(wrap);
    return;
  }

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

  btnCopy.innerHTML = `<span class="label">Copy</span>
    <img class="ai-btn-icon" src="${browser.runtime.getURL("copy.svg")}" />`;
  btnClose.innerHTML = `<img class="ai-btn-icon" src="${browser.runtime.getURL(
    "close.svg",
  )}" />`;

  btnCopy.onclick = async () => {
    await navigator.clipboard.writeText(raw);
    const lbl = btnCopy.querySelector(".label") as HTMLElement;
    lbl.textContent = "Copied";
    setTimeout(() => (lbl.textContent = "Copy"), 1000);
  };
  btnClose.onclick = () => (resultSlot.innerHTML = "");

  body.innerHTML = toHTML(raw);

  head.append(btnCopy, btnClose);
  card.append(head, body);
  resultSlot.append(card);
}
