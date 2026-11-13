// Browser-only Telegram WebApp + ad helpers. Call from effects/handlers only.
declare global { interface Window { Telegram?: any; show_12255910?: (opts?: any) => Promise<void> } }

export function webApp() { return typeof window === "undefined" ? undefined : window.Telegram?.WebApp; }

export function initTelegram() {
  const w = webApp();
  if (!w) return "";
  try {
    w.ready(); w.expand();
    if (w.isVersionAtLeast?.("8.0") && ["android", "ios"].includes(w.platform)) w.requestFullscreen?.();
    w.disableVerticalSwipes?.();
    w.setHeaderColor?.("#f3f5f9"); w.setBackgroundColor?.("#f3f5f9");
  } catch {}
  return (w.initData as string) || "";
}

export function haptic(kind: "light" | "success" | "error" = "light") {
  const h = webApp()?.HapticFeedback; if (!h) return;
  kind === "light" ? h.impactOccurred("light") : h.notificationOccurred(kind);
}

export async function showAd(): Promise<boolean> {
  const fn = window.show_12255910;
  if (!fn) return import.meta.env.DEV; // allow testing outside Telegram in dev
  try { await fn(); return true; } catch { return false; }
}

export function openLink(url: string) {
  const w = webApp();
  if (url.startsWith("https://t.me/") && w?.openTelegramLink) w.openTelegramLink(url);
  else if (w?.openLink) w.openLink(url); else window.open(url, "_blank");
}
