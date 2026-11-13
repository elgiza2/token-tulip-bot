# NOT Mining — Telegram Mini App + Bot

A new Telegram full-screen app with a clean iOS-style glass look (rebuilt from scratch, not reusing the old repo design). Users mine **NOT (Notcoin)** in small amounts.

## Screens
- **Mine (home)**: big balance, live mining counter, speed. Watching one ad starts a mining session.
- **Servers**: buy faster mining servers (each with its own image) by paying GRAM/TON to `UQAp1Qx...D8qj`, or unlock small ones via ads.
- **Tasks**: many tasks — invite friends (1/3/5/10/25), watch ads (5/10/25), join channels, daily check-in.
- **Games**: 2 small games (tap game + lucky wheel) that pay small coins; one ad between rounds.
- **Withdraw**: conditions: pay 1 GRAM, join community, and either 1 referral or 25 ads watched. Requests go to admin for manual payout.
- **Friends**: referral link + list.

Collection rewards are tiny and slow per step, but frequent visible progress so it feels easy.

## Ads
Monetag rewarded ads (zone 12255910) for starting mining, between games, and ad tasks.

## Bot
- Bold, clean /start message with colored buttons opening the full-screen app.
- Daily notifications to all users (several per day).
- Gift messages in chat with a "Claim" button that credits the account automatically.
- Daily auto posts (2–3) to the news community with an image, text and an "Open app" button — **waits on you creating the channel** and adding the bot as admin.

## Admin panel (opens via /101)
- Full admins: @eigiza and @torker — stats, payment alerts, withdrawal approvals, tasks, assigning task managers.
- Task managers: can only add/edit/delete tasks, see no other data.

## Technical
- Lovable Cloud database for users, balances, sessions, tasks, payments, withdrawals, admins.
- Telegram login via verified initData (server-side check with bot token).
- Bot webhook at `/api/public/telegram/webhook`; scheduled jobs via cron server routes.
- TON payments verified by checking incoming transactions to the payout address (comment = user id).
- Published through Lovable (no Vercel token needed — please revoke it).
