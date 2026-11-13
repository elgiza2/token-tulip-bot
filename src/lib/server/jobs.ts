// Broadcast jobs: daily notifications, chat gifts, community posts. Batched with a cursor in notm_settings.
type H = typeof import("@/lib/server/tg");

const NOTES = [
  "⛏ <b>Your miner is waiting!</b>\nStart a new session and keep your NOT flowing.",
  "⚡ <b>Mining boost hour</b>\nOpen the app, watch one ad and start mining now.",
  "🎯 <b>New tasks just dropped</b>\nComplete them today for extra NOT.",
  "🎮 <b>Play & earn</b>\nA quick game round can add NOT to your balance.",
  "👥 <b>Invite a friend</b>\nEvery friend gives you +1 NOT instantly.",
];

const BATCH = 120;

export async function runJob(kind: "notify" | "gift" | "post", slot: string, h: H) {
  const appUrl = await h.setting("app_url");
  const openBtn = (text: string) => ({ inline_keyboard: [[{ text, web_app: { url: appUrl } }]] });
  if (kind === "post") {
    const community = await h.setting("community");
    if (!community) return { sent: 0, note: "No community set" };
    const done = await h.setting(`job:${slot}`);
    if (done === "done") return { sent: 0 };
    await h.putSetting(`job:${slot}`, "done");
    const { img, text } = await makePost();
    const url = (await h.setting("bot_username")) ? `https://t.me/${await h.setting("bot_username")}?startapp=news` : appUrl;
    const markup = { inline_keyboard: [[{ text: "🚀 Open NOT Miner", url }]] };
    if (img) await h.tgPhoto(community, img, text, markup);
    else await h.tg("sendMessage", { chat_id: community, text, parse_mode: "HTML", reply_markup: markup });
    return { sent: 1 };
  }
  const key = `job:${slot}`;
  const cur = await h.setting(key);
  if (cur === "done") return { sent: 0 };
  const s = await h.db();
  const { data: users } = await s.from("notm_users").select("id").eq("blocked", false).gt("id", Number(cur || 0)).order("id").limit(BATCH);
  let sent = 0;
  for (const u of users ?? []) {
    if (kind === "notify") {
      const r = await h.tg("sendMessage", { chat_id: u.id, text: NOTES[new Date().getUTCHours() % NOTES.length], parse_mode: "HTML", reply_markup: openBtn("⛏ Start mining") });
      if (r?.error_code === 403) await s.from("notm_users").update({ blocked: true }).eq("id", u.id);
    } else {
      const amount = [0.1, 0.2, 0.25, 0.5][Math.floor(Math.random() * 4)];
      const { data: g } = await s.from("notm_gifts").insert({ user_id: u.id, amount }).select("id").single();
      const r = await h.tg("sendMessage", { chat_id: u.id, parse_mode: "HTML", text: `🎁 <b>You received a gift!</b>\n\n<b>${amount} NOT</b> is waiting for you.\nTap the button to add it to your balance.`, reply_markup: { inline_keyboard: [[{ text: "🎁 Claim gift", callback_data: `gift:${g.id}` }]] } });
      if (r?.error_code === 403) await s.from("notm_users").update({ blocked: true }).eq("id", u.id);
    }
    sent++;
  }
  const last = users?.at(-1)?.id;
  await h.putSetting(key, !users || users.length < BATCH ? "done" : String(last));
  return { sent };
}

async function makePost(): Promise<{ img: Blob | null; text: string }> {
  const key = process.env["LOVABLE_API_KEY"];
  const topics = ["mining tips", "Notcoin ecosystem news style update", "referral challenge", "weekend boost", "new tasks available", "community milestone"];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  let text = `⛏ <b>NOT Miner update</b>\n\nNew tasks and boosts are live. Open the app and keep mining!`;
  let img: Blob | null = null;
  if (!key) return { img, text };
  try {
    const headers = { Authorization: `Bearer ${key}`, "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" };
    const r = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST", headers,
      body: JSON.stringify({ model: "openai/gpt-6-astra", stream: true, store: false, reasoning: { effort: "low" }, input: `Write a short, upbeat Telegram channel post (max 300 chars) in English for a NOT (Notcoin) mining mini app about: ${topic}. Start with a bold title line using <b></b> HTML tags and one emoji. Plain Telegram HTML only (b, i), no markdown. Never promise guaranteed profit.` }),
    });
    if (r.ok && r.body) {
      let out = "", buf = "";
      const reader = r.body.getReader(); const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() || "";
        for (const l of lines) {
          if (!l.startsWith("data:")) continue;
          try { const ev = JSON.parse(l.slice(5)); if (ev.type === "response.output_text.delta") out += ev.delta; } catch {}
        }
      }
      if (out.trim()) text = out.trim();
    } else console.error("AI text failed", r.status, await r.text());
    const ir = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST", headers,
      body: JSON.stringify({ model: "openai/gpt-image-2.5-sunburst", n: 1, size: "1024x1024", prompt: `Clean glossy 3D illustration, soft frosted glass iOS style, light background, theme: crypto mining, ${topic}. No text.` }),
    });
    if (ir.ok) {
      const d = (await ir.json()).data?.[0];
      if (d?.b64_json) img = new Blob([Uint8Array.from(atob(d.b64_json), (c) => c.charCodeAt(0))], { type: "image/png" });
      else if (d?.url) img = await (await fetch(d.url)).blob();
    } else console.error("AI image failed", ir.status, await ir.text());
  } catch (e) { console.error(e); }
  return { img, text };
}
