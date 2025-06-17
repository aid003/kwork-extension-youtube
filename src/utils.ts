export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const logT = (...a: unknown[]) => console.log("[YT-Transcript]", ...a);

export const two = (n: number) => n.toString().padStart(2, "0");

export function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

export const ensureParam = (u: string, key: string, value: string) =>
  u.includes(`${key}=`)
    ? u
    : u + (u.includes("?") ? "&" : "?") + `${key}=${value}`;

export const getVid = (): string | null =>
  new URLSearchParams(location.search).get("v");


