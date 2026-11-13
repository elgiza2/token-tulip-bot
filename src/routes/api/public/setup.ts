import { createFileRoute } from "@tanstack/react-router";

// Registers the bot webhook + menu button to this deployment's origin. Requires ?key=<cron_key>.
export const Route = createFileRoute("/api/public/setup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const h = await import("@/lib/server/tg");
        const url = new URL(request.url);
        if (url.searchParams.get("key") !== (await h.setting("cron_key"))) return new Response("Unauthorized", { status: 401 });
        const origin = url.searchParams.get("origin") || url.origin;
        await h.putSetting("app_url", origin);
        const me = await h.tg("getMe", {});
        if (me?.result?.username) await h.putSetting("bot_username", me.result.username);
        const wh = await h.tg("setWebhook", { url: `${origin}/api/public/telegram/webhook`, secret_token: await h.webhookSecret(), allowed_updates: ["message", "callback_query"] });
        await h.tg("setChatMenuButton", { menu_button: { type: "web_app", text: "⛏ Mine", web_app: { url: origin } } });
        await h.tg("setMyCommands", { commands: [{ command: "start", description: "Open NOT Miner" }] });
        return Response.json({ webhook: wh, bot: me?.result?.username, origin });
      },
    },
  },
});
