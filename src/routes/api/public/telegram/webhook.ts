import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const h = await import("@/lib/server/tg");
        if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== (await h.webhookSecret())) return new Response("Unauthorized", { status: 401 });
        const update = await request.json();
        const appUrl = (await h.setting("app_url")) || new URL(request.url).origin;
        const s = await h.db();

        if (update.callback_query) {
          const cq = update.callback_query;
          const m = /^gift:([0-9a-f-]{36})$/.exec(cq.data || "");
          if (m) {
            const { data: g } = await s.from("notm_gifts").update({ claimed: true }).eq("id", m[1]).eq("user_id", cq.from.id).eq("claimed", false).select().maybeSingle();
            if (g) {
              await h.addBalance(cq.from.id, Number(g.amount));
              await h.tg("answerCallbackQuery", { callback_query_id: cq.id, text: `✅ ${g.amount} NOT added to your balance!`, show_alert: true });
              await h.tg("editMessageReplyMarkup", { chat_id: cq.message.chat.id, message_id: cq.message.message_id, reply_markup: { inline_keyboard: [[{ text: "✅ Claimed — open app", web_app: { url: appUrl } }]] } });
            } else await h.tg("answerCallbackQuery", { callback_query_id: cq.id, text: "This gift was already claimed." });
          }
          return Response.json({ ok: true });
        }

        const msg = update.message;
        if (!msg?.text || msg.chat?.type !== "private") return Response.json({ ok: true });
        const text: string = msg.text.trim();
        if (text.startsWith("/start")) {
          const arg = text.split(" ")[1];
          const ref = arg?.startsWith("r") ? Number(arg.slice(1)) : undefined;
          await h.registerUser(msg.from, Number.isFinite(ref) ? ref : undefined);
          const link = `${appUrl}${arg ? `?tgWebAppStartParam=${encodeURIComponent(arg)}` : ""}`;
          const custom = (await h.setting('duck_emoji_enabled')) === 'true';
          const emoji = (id: string, fallback: string) => custom ? `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>` : fallback;
          const welcome = {
            chat_id: msg.chat.id, parse_mode: "HTML",
            text: `<b>${emoji('5413694143601842851', '👋')} Welcome to NOT Miner, ${escape(msg.from.first_name || "friend")}!</b>\n\n${emoji('5386399931378440814', '😎')} <b>Mine NOT inside Telegram.</b>\n\nStart a 6-hour mining session with one ad.\nComplete tasks, play games and invite friends.\n\n${emoji('5395357957552609518', '🤩')} <b>Withdraw from 2000 NOT.</b>\nOne-time activation: <b>0.2 TON</b>, plus 1 friend or 25 ads. Wallet network fees are separate. Manual payout review.\n\nNew users receive <b>0.5 NOT</b>.`,
            reply_markup: { inline_keyboard: [
              [{ text: "⛏ Start mining", web_app: { url: link }, style: "success" }],
              [{ text: "🎯 Tasks", web_app: { url: `${appUrl}?tab=tasks` }, style: "primary" }, { text: "🎮 Games", web_app: { url: `${appUrl}?tab=games` }, style: "primary" }],
              [{ text: "👥 Invite friends", url: `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/${await h.setting('bot_username')}?start=r${msg.from.id}`)}`, style: "danger" }],
            ] },
          };
          const sent = await h.tg("sendMessage", welcome);
          if (!sent.ok && custom) await h.tg('sendMessage', { ...welcome, text: welcome.text.replace(/<\/?tg-emoji[^>]*>/g, '') });
        } else if (text === "/101") {
          const role = await h.roleOf(msg.from.username);
          if (role) await h.tg("sendMessage", { chat_id: msg.chat.id, parse_mode: "HTML", text: `<b>🛠 Admin panel</b>\nRole: ${role === "admin" ? "Full admin" : "Task manager"}`, reply_markup: { inline_keyboard: [[{ text: "Open panel", web_app: { url: `${appUrl}/admin` }, style: "primary" }]] } });
        }
        return Response.json({ ok: true });
      },
    },
  },
});

function escape(s: string) { return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] ?? c); }
