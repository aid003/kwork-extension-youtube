import browser from "webextension-polyfill";
import { startTranscript } from "./transcript";

/*──────────────────────────────  src/ui.ts  ──────────────────────────────
 * Содержит только UI-код (dropdown + summarizer).  Логика расшифровки
 * и навигационный SPA-observer вынесены в другие модули.
 * ----------------------------------------------------------------------*/

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
  { value: "pt", label: "Português" }
];

export const detailLevels: DropdownOption[] = [
  { value: "concise",  label: "Concise",  description: "Main points only" },
  { value: "standard", label: "Standard", description: "Key moments with context" },
  { value: "detailed", label: "Detailed", description: "Full chronological breakdown" }
];

export function createDropdown(
  options: DropdownOption[],
  initialValue: string,
  icon: string
) {
  const dropdown = document.createElement("div");
  dropdown.className = "ai-dropdown";

  const selected = options.find(o => o.value === initialValue) || options[0];

  const button = document.createElement("button");
  button.className = "ai-dropdown-button";
  button.innerHTML = `
    <span class="ai-icon-left">${icon}</span>${selected.label}
    <span class="ai-icon-right arrow-icon">
      <img src="${browser.runtime.getURL("arrow-down.svg")}" />
    </span>`;

  const content = document.createElement("div");
  content.className = "ai-dropdown-content";

  options.forEach(o => {
    const item = document.createElement("div");
    item.className =
      "ai-dropdown-item" + (o.value === initialValue ? " selected" : "");

    item.innerHTML = `
      <div style="display:flex;align-items:center;width:100%;">
        <span class="checkmark" style="width:16px;text-align:center;">
          ${o.value === initialValue ? "✓" : ""}
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
      button.innerHTML = `
        <span class="ai-icon-left">${icon}</span><span>${o.label}</span>
        <span class="ai-icon-right arrow-icon">
          <img src="${browser.runtime.getURL("arrow-down.svg")}" />
        </span>`;

      content.querySelectorAll(".ai-dropdown-item").forEach(el => {
        el.classList.remove("selected");
        const mk = el.querySelector(".checkmark") as HTMLElement | null;
        if (mk) mk.textContent = "";
      });
      item.classList.add("selected");
      const mk = item.querySelector(".checkmark") as HTMLElement | null;
      if (mk) mk.textContent = "✓";

      dropdown.classList.remove("active");
    });

    content.appendChild(item);
  });

  button.addEventListener("click", e => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
    document.querySelectorAll(".ai-dropdown").forEach(el => {
      if (el !== dropdown) el.classList.remove("active");
    });
  });
  document.addEventListener("click", () => dropdown.classList.remove("active"));

  dropdown.appendChild(button);
  dropdown.appendChild(content);
  return dropdown;
}

export function createSummarizer() {
  const box = document.createElement("div");
  box.id = "ai-video-summarizer";
  box.className = "ai-summarizer-container";

  const head = document.createElement("div");
  head.className = "ai-summarizer-header";
  head.textContent = "Video Summarizer";

  const controls = document.createElement("div");
  controls.className = "ai-summarizer-controls";

  const row1 = document.createElement("div");
  row1.className = "ai-controls-row";
  row1.appendChild(
    createDropdown(
      languages,
      "en",
      `<img src="${browser.runtime.getURL("language.svg")}" />`
    )
  );
  const detailDD = createDropdown(
    detailLevels,
    "detailed",
    `<img src="${browser.runtime.getURL("settings.svg")}" />`
  );
  detailDD.style.marginLeft = "15px";
  row1.appendChild(detailDD);
  controls.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "ai-controls-row";
  row2.style.display = "flex";
  row2.style.gap = "12px";
  row2.style.width = "100%";

  let mode: "summarize" | "timestamps" | "question" | null = null;

  const mkBtn = (txt: string, ic: string) => {
    const b = document.createElement("button");
    b.className = "ai-button";
    b.style.flex = "1";
    b.innerHTML = `<span class="ai-icon">${ic}</span> ${txt}`;
    return b;
  };
  const bSum = mkBtn("Summarize", "✨");
  const bTim = mkBtn("Timestamps", "⏱️");

  // Start transcription when mode buttons are clicked
  [bSum, bTim].forEach(btn => {
    btn.addEventListener("click", () => {
      startTranscript();
    });
  });

  bSum.addEventListener("click", () => {
    bSum.classList.toggle("selected");
    bTim.classList.remove("selected");
    mode = bSum.classList.contains("selected") ? "summarize" : null;
  });
  bTim.addEventListener("click", () => {
    bTim.classList.toggle("selected");
    bSum.classList.remove("selected");
    mode = bTim.classList.contains("selected") ? "timestamps" : null;
  });

  row2.appendChild(bSum); row2.appendChild(bTim);
  controls.appendChild(row2);

  const wrap = document.createElement("div");
  wrap.className = "ai-input-container";

  const spinner = document.createElement("div");
  spinner.className = "ai-loading-spinner";
  wrap.appendChild(spinner);

  const input = document.createElement("input");
  input.type = "text";
  input.className = "ai-input";
  input.placeholder = "Ask about the video…";
  wrap.appendChild(input);

  const send = document.createElement("button");
  send.className = "ai-send-button";
  send.innerHTML = `<img src="${browser.runtime.getURL("button-send.svg")}" />`;
  wrap.appendChild(send);

  // Trigger transcription on send as well
  send.addEventListener("click", () => {
    startTranscript();
  });

  send.addEventListener("click", async () => {
    if (!mode && !input.value.trim()) return;
    if (!mode && input.value.trim()) mode = "question";

    send.classList.add("hidden");
    spinner.classList.add("visible");
    input.disabled = true;
    input.classList.add("loading");

    const ph = input.placeholder;
    input.placeholder = "";
    input.value =
      mode === "timestamps"
        ? "          Loading timestamps…"
        : mode === "summarize"
        ? "          Generating summary…"
        : "          Getting your answer…";

    await new Promise(r => setTimeout(r, 1800));

    send.classList.remove("hidden");
    spinner.classList.remove("visible");
    input.disabled = false;
    input.classList.remove("loading");
    input.value = "";
    input.placeholder = ph;
    if (mode === "question") mode = null;
  });

  box.appendChild(head);
  box.appendChild(controls);
  box.appendChild(wrap);
  return box;
}

export function mountSummarizer() {
  if (document.getElementById("ai-video-summarizer")) return;
  const rel = document.querySelector("#related.style-scope.ytd-watch-flexy");
  if (rel) rel.insertAdjacentElement("afterbegin", createSummarizer());
  else setTimeout(mountSummarizer, 1000);
}
