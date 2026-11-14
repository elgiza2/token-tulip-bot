<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Referral crediting and its displayed amounts must use the shared reward constant, so balance updates and notifications cannot drift.
- All app tables use the `notm_` prefix (the database is shared with other apps); RLS on with no policies, accessed only server-side via service role after verifying Telegram initData.
- Telegram identity comes from `verifyInitData` in `src/lib/server/tg.ts`; every server function takes `initData`. Server helpers are imported dynamically inside handlers.
- Scheduled broadcasts run through `/api/public/cron?key=<notm_settings.cron_key>` called by an external scheduler; `/api/public/setup` re-registers the bot webhook to a given origin.
- TON Connect loads only inside browser actions and uses a same-origin public manifest; transfers include the server-generated payment memo so receipt verification stays server-side.
