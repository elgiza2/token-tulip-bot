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
          await h.tg("sendMessage", {
            chat_id: msg.chat.id, parse_mode: "HTML",
            text: `<b>⛏ Welcome to NOT Miner, ${escape(msg.from.first_name || "friend")}!</b>\n\n<b>Mine Notcoin every day — right inside Telegram.</b>\n\n<b>▸ Start a session</b> with one tap\n<b>▸ Boost</b> with servers, tasks & games\n<b>▸ Invite friends</b> for +1 NOT each\n<b>▸ Withdraw</b> to your TON wallet\n\n🎁 <b>0.5 NOT welcome bonus is already in your balance.</b>`,
            reply_markup: { inline_keyboard: [
              [{ text: "⛏ Start mining", web_app: { url: link }, style: "success" }],
              [{ text: "🎯 Tasks", web_app: { url: `${appUrl}?tab=tasks` }, style: "primary" }, { text: "🎮 Games", web_app: { url: `${appUrl}?tab=games` }, style: "primary" }],
              [{ text: "👥 Invite friends", switch_inline_query: "", style: "danger" }],
            ] },
          });
        } else if (text === "/101") {
          const role = await h.roleOf(msg.from.username);
          if (role) await h.tg("sendMessage", { chat_id: msg.chat.id, parse_mode: "HTML", text: `<b>🛠 Admin panel</b>\nRole: ${role === "admin" ? "Full admin" : "Task manager"}`, reply_markup: { inline_keyboard: [[{ text: "Open panel", web_app: { url: `${appUrl}/admin` }, style: "primary" }]] } });
        }
        return Response.json({ ok: true });
      },
    },
  },
});

function escape(s: string) { return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!); }
