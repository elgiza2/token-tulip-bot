// Server-only helpers. Import dynamically inside handlers only.
import { BASE_RATE, SERVERS, SESSION_HOURS, SUPER_ADMINS } from "@/lib/config";

export async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function token() {
  const t = process.env["TELEGRAM_BOT_TOKEN"];
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN missing");
  return t;
}

const enc = new TextEncoder();
async function hmac(key: Uint8Array<ArrayBuffer>, data: string) {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

export type TgUser = { id: number; username?: string; first_name?: string; photo_url?: string };

export async function verifyInitData(initData: string): Promise<{ user: TgUser; startParam?: string | undefined }> {
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  if (!hash) throw new Error("Unauthorized");
  p.delete("hash");
  const check = [...p.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
  const secret = await hmac(enc.encode("WebAppData"), token());
  if (hex(await hmac(secret, check)) !== hash) throw new Error("Unauthorized");
  const authDate = Number(p.get("auth_date") || 0);
  if (Date.now() / 1000 - authDate > 86400 * 7) throw new Error("Session expired");
  const user = JSON.parse(p.get("user") || "null");
  if (!user?.id) throw new Error("Unauthorized");
  return { user, startParam: p.get("start_param") || undefined };
}

export async function webhookSecret() {
  return hex(await hmac(enc.encode("webhook"), token())).slice(0, 48);
}

export async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) console.error(`Telegram ${method} failed [${r.status}]`, JSON.stringify(j));
  return j;
}

export async function tgPhoto(chatId: string | number, photo: Blob, caption: string, reply_markup: unknown) {
  const fd = new FormData();
  fd.append("chat_id", String(chatId));
  fd.append("photo", photo, "post.png");
  fd.append("caption", caption);
  fd.append("parse_mode", "HTML");
  fd.append("reply_markup", JSON.stringify(reply_markup));
  const r = await fetch(`https://api.telegram.org/bot${token()}/sendPhoto`, { method: "POST", body: fd });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) console.error("sendPhoto failed", JSON.stringify(j));
  return j;
}

export async function rateFor(userId: number) {
  const s = await db();
  const { data } = await s.from("notm_user_servers").select("server_id").eq("user_id", userId);
  return (data ?? []).reduce((acc: number, r: any) => acc + (SERVERS.find((x) => x.id === r.server_id)?.rate ?? 0), BASE_RATE);
}

export function pendingMined(startedAt: string | null, rate: number) {
  if (!startedAt) return 0;
  const hrs = Math.min(SESSION_HOURS, (Date.now() - new Date(startedAt).getTime()) / 3.6e6);
  return Math.max(0, hrs * rate);
}

export async function addBalance(userId: number, amount: number) {
  const s = await db();
  const { data } = await s.from("notm_users").select("balance").eq("id", userId).single();
  const next = Number(data?.balance ?? 0) + amount;
  await s.from("notm_users").update({ balance: next }).eq("id", userId);
  return next;
}

export async function setting(key: string) {
  const s = await db();
  const { data } = await s.from("notm_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as string | undefined) ?? "";
}
export async function putSetting(key: string, value: string) {
  const s = await db();
  await s.from("notm_settings").upsert({ key, value });
}

export async function roleOf(username?: string): Promise<"admin" | "manager" | null> {
  const u = (username || "").toLowerCase();
  if (!u) return null;
  if (SUPER_ADMINS.includes(u)) return "admin";
  const s = await db();
  const { data } = await s.from("notm_task_managers").select("username").eq("username", u).maybeSingle();
  return data ? "manager" : null;
}

export async function notifyAdmins(text: string) {
  const s = await db();
  const { data } = await s.from("notm_users").select("id, username").in("username", SUPER_ADMINS);
  for (const a of data ?? []) await tg("sendMessage", { chat_id: a.id, text, parse_mode: "HTML" });
}

export async function registerUser(u: TgUser, ref?: number | undefined) {
  const s = await db();
  const { data: existing } = await s.from("notm_users").select("id").eq("id", u.id).maybeSingle();
  const fields = { username: u.username?.toLowerCase() ?? null, first_name: u.first_name ?? null, photo_url: u.photo_url ?? null };
  if (existing) {
    await s.from("notm_users").update(fields).eq("id", u.id);
    return false;
  }
  const referrer = ref && ref !== u.id ? ref : null;
  await s.from("notm_users").insert({ id: u.id, ...fields, referrer_id: referrer, balance: 0.5 });
  if (referrer) {
    const { data: r } = await s.from("notm_users").select("ref_count").eq("id", referrer).maybeSingle();
    if (r) {
      await s.from("notm_users").update({ ref_count: (r.ref_count ?? 0) + 1 }).eq("id", referrer);
      await addBalance(referrer, 1);
      await tg("sendMessage", { chat_id: referrer, text: `🎉 <b>New friend joined!</b>\n+1 NOT added to your balance.`, parse_mode: "HTML" });
    }
  }
  return true;
}
