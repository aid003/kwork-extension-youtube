// src/navigation.ts
import { mountSummarizer, resetSummarizerControls } from "./ui";
import { getVid, logT } from "./utils";

/*───────────────────────────────────────────────────────────────
 * Navigation watcher
 *  • не удаляет панель между роликами — UI живёт во вкладке постоянно
 *  • при смене videoId вызывает resetSummarizerControls()
 *  • если панель ещё не вставлена (первая загрузка), монтирует её
 *───────────────────────────────────────────────────────────────*/

let activeVid: string | null = null;

/*──────────────────── Boot / Refresh UI ──────────────────────*/
function refreshUI(): void {
  const vid = getVid();
  if (!vid) return;

  if (vid !== activeVid) {
    /* другой ролик: просто сбрасываем кнопки/индикаторы,
       язык и детализацию НЕ трогаем (берутся из storage). */
    activeVid = vid;
    logT("Video changed → reset controls", vid);
    resetSummarizerControls();
  }

  /* если панель ещё не вставлена — вставим */
  if (!document.getElementById("ai-video-summarizer")) {
    mountSummarizer();
  }
}

/*──────────────────── Event wiring ───────────────────────────*/

/* 1. первый запуск */
document.addEventListener("DOMContentLoaded", () => refreshUI());

/* 2. Router-эвент YouTube SPA */
window.addEventListener("yt-navigate-finish", () => setTimeout(refreshUI, 0));

/* 3. patch pushState / replaceState (резерв) */
["pushState", "replaceState"].forEach((m) => {
  const orig = (history as any)[m];
  (history as any)[m] = function (...a: any[]) {
    const r = orig.apply(this, a);
    setTimeout(refreshUI, 0);
    return r;
  };
});
window.addEventListener("popstate", () => setTimeout(refreshUI, 0));

/* 4. таймер-fallback (если всё вышеперечисленное не сработало) */
setInterval(() => {
  const vid = getVid();
  if (vid && vid !== activeVid) {
    logT("Fallback detect new video", vid);
    refreshUI();
  }
}, 200);
