import { createFileRoute } from "@tanstack/react-router";

// Call every 5–10 minutes with ?key=<cron_key>. Slots (UTC): notify 8/14/20, gift 17, post 10/15/19.
export const Route = createFileRoute("/api/public/cron")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const h = await import("@/lib/server/tg");
        const key = new URL(request.url).searchParams.get("key") || request.headers.get("x-cron-key");
        if (!key || key !== (await h.setting("cron_key"))) return new Response("Unauthorized", { status: 401 });
        const { runJob } = await import("@/lib/server/jobs");
        const now = new Date();
        const hr = now.getUTCHours();
        const day = now.toISOString().slice(0, 10);
        const out: Record<string, unknown> = {};
        const due = (hours: number[]) => hours.filter((x) => x <= hr && hr - x < 4);
        for (const x of due([8, 14, 20])) out[`notify-${x}`] = await runJob("notify", `notify-${day}-${x}`, h);
        for (const x of due([17])) out[`gift-${x}`] = await runJob("gift", `gift-${day}-${x}`, h);
        for (const x of due([10, 15, 19])) out[`post-${x}`] = await runJob("post", `post-${day}-${x}`, h);
        return Response.json(out);
      },
    },
  },
});
