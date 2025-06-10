/*─────────────────────────  src/utils.ts  ──────────────────────────
 * Общие утилиты, которыми пользуются и UI, и Transcript-engine
 * (без прямой зависимости от DOM или WebExtension-API)
 * -----------------------------------------------------------------*/

/** pause N ms */
export const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/** консольный префикс для всех логов расширения */
export const logT = (...a: unknown[]) =>
  console.log("[YT-Transcript]", ...a);

/** pad-helper: 7 → "07" */
export const two = (n: number) => n.toString().padStart(2, "0");

/** seconds → "H:MM:SS" / "M:SS" */
export function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

/** добавляет к URL параметр, если его там ещё нет */
export const ensureParam = (u: string, key: string, value: string) =>
  u.includes(`${key}=`) ? u
    : u + (u.includes("?") ? "&" : "?") + `${key}=${value}`;

/** извлекает id текущего YouTube-видео из location.search */
export const getVid = (): string | null =>
  new URLSearchParams(location.search).get("v");
