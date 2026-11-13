import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AD_TASK_REWARD, GAME_COOLDOWN_SEC, GRAM_FEE, MIN_WITHDRAW, PAY_ADDRESS, SERVERS, WITHDRAW_ADS_REQUIRED } from "@/lib/config";

const auth = z.object({ initData: z.string().min(10).max(4096) });
const L = () => import("@/lib/server/tg");

async function me(initData: string): Promise<{ h: any; user: any; startParam?: string | undefined; s: any }> {
  const h = await L();
  const { user, startParam } = await h.verifyInitData(initData);
  return { h, user, startParam, s: await h.db() };
}

async function state(initData: string) {
  const { h, user, s } = await me(initData);
  const { data: u } = await s.from("notm_users").select("*").eq("id", user.id).single();
  const [{ data: owned }, { data: tasks }, { data: done }, { data: friends }, { data: wds }] = await Promise.all([
    s.from("notm_user_servers").select("server_id").eq("user_id", user.id),
    s.from("notm_tasks").select("*").eq("active", true).order("sort"),
    s.from("notm_task_done").select("task_id, created_at").eq("user_id", user.id),
    s.from("notm_users").select("first_name, username, created_at").eq("referrer_id", user.id).order("created_at", { ascending: false }).limit(50),
    s.from("notm_withdrawals").select("amount, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
  ]);
  const rate = await h.rateFor(user.id);
  const today = new Date().toISOString().slice(0, 10);
  const doneSet = new Set((done ?? []).map((d: any) => d.task_id));
  return {
    user: u,
    rate,
    owned: (owned ?? []).map((o: any) => o.server_id) as string[],
    tasks: (tasks ?? []).map((t: any) => ({
      ...t,
      done: t.kind === "checkin" ? u.last_checkin === today : doneSet.has(t.id),
      progress: t.kind === "ads" ? u.ads_watched : t.kind === "referral" ? u.ref_count : 0,
    })),
    friends: friends ?? [],
    withdrawals: wds ?? [],
    community: await h.setting("community"),
    bot: await h.setting("bot_username"),
    role: await h.roleOf(user.username),
  };
}
export type AppState = Awaited<ReturnType<typeof state>>;

export const bootstrap = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.parse(d))
  .handler(async ({ data }) => {
    const { h, user, startParam } = await me(data.initData);
    const ref = startParam?.startsWith("r") ? Number(startParam.slice(1)) : undefined;
    await h.registerUser(user, ref !== undefined && Number.isFinite(ref) ? ref : undefined);
    return state(data.initData);
  });

export const adWatched = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ purpose: z.enum(["mine", "task", "game", "server"]) }).parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const { data: u } = await s.from("notm_users").select("*").eq("id", user.id).single();
    const patch: Record<string, any> = { ads_watched: u.ads_watched + 1 };
    if (data.purpose === "task") patch["balance"] = Number(u.balance) + AD_TASK_REWARD;
    if (data.purpose === "mine") {
      const rate = await h.rateFor(user.id);
      const mined = h.pendingMined(u.mining_started_at, rate);
      patch["balance"] = Number(u.balance) + mined;
      patch["mining_started_at"] = new Date().toISOString();
    }
    if (data.purpose === "server") {
      const s1 = SERVERS[0];
      if (!s1) throw new Error("Server unavailable");
      const { data: has } = await s.from("notm_user_servers").select("id").eq("user_id", user.id).eq("server_id", s1.id);
      if (!has?.length && u.ads_watched + 1 >= s1.ads) await s.from("notm_user_servers").insert({ user_id: user.id, server_id: s1.id });
    }
    await s.from("notm_users").update(patch).eq("id", user.id);
    return state(data.initData);
  });

export const claimMining = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const { data: u } = await s.from("notm_users").select("*").eq("id", user.id).single();
    const mined = h.pendingMined(u.mining_started_at, await h.rateFor(user.id));
    await s.from("notm_users").update({ balance: Number(u.balance) + mined, mining_started_at: null }).eq("id", user.id);
    return state(data.initData);
  });

export const claimTask = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ taskId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const [{ data: u }, { data: t }] = await Promise.all([
      s.from("notm_users").select("*").eq("id", user.id).single(),
      s.from("notm_tasks").select("*").eq("id", data.taskId).eq("active", true).single(),
    ]);
    if (!t) throw new Error("Task not found");
    const today = new Date().toISOString().slice(0, 10);
    if (t.kind === "checkin") {
      if (u.last_checkin === today) throw new Error("Already checked in today");
      await s.from("notm_users").update({ last_checkin: today }).eq("id", user.id);
    } else {
      if (t.kind === "ads" && u.ads_watched < t.target) throw new Error("Watch more ads first");
      if (t.kind === "referral" && u.ref_count < t.target) throw new Error("Invite more friends first");
      const { error } = await s.from("notm_task_done").insert({ user_id: user.id, task_id: t.id });
      if (error) throw new Error("Already completed");
    }
    await h.addBalance(user.id, Number(t.reward));
    return state(data.initData);
  });

export const gameReward = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ game: z.enum(["tap", "wheel"]), score: z.number().int().min(0).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const { data: u } = await s.from("notm_users").select("last_game_at").eq("id", user.id).single();
    if (u.last_game_at && Date.now() - new Date(u.last_game_at).getTime() < GAME_COOLDOWN_SEC * 1000) throw new Error("Slow down a little");
    const reward = data.game === "tap" ? Math.min(data.score, 150) * 0.002 : ([0.02, 0.05, 0.1, 0.03, 0.2, 0.01, 0.5, 0.04][data.score % 8] ?? 0.01);
    await s.from("notm_users").update({ last_game_at: new Date().toISOString() }).eq("id", user.id);
    await h.addBalance(user.id, reward);
    return { reward, state: await state(data.initData) };
  });

export const createPayment = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ purpose: z.string().regex(/^(gram|server:s[1-9])$/) }).parse(d))
  .handler(async ({ data }) => {
    const { user, s } = await me(data.initData);
    const amount = data.purpose === "gram" ? GRAM_FEE : SERVERS.find((x) => `server:${x.id}` === data.purpose)?.priceTon;
    if (!amount) throw new Error("Not purchasable");
    const memo = `N${user.id}-${Math.random().toString(36).slice(2, 8)}`;
    const { data: p } = await s.from("notm_payments").insert({ user_id: user.id, purpose: data.purpose, amount_ton: amount, memo }).select().single();
    return { id: p.id as string, memo, amount, address: PAY_ADDRESS };
  });

export const checkPayment = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const { data: p } = await s.from("notm_payments").select("*").eq("id", data.id).eq("user_id", user.id).single();
    if (!p) throw new Error("Payment not found");
    if (p.status === "paid") return { paid: true, state: await state(data.initData) };
    const r = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${PAY_ADDRESS}&limit=60`);
    const j = await r.json().catch(() => ({}));
    const tx = (j.result ?? []).find((t: any) => {
      const m = t.in_msg;
      return m && (m.message === p.memo || m.msg_data?.text && atob(m.msg_data.text) === p.memo) && Number(m.value) >= Number(p.amount_ton) * 1e9 * 0.99;
    });
    if (!tx) return { paid: false, state: null };
    const { error } = await s.from("notm_payments").update({ status: "paid", tx_hash: tx.transaction_id.hash }).eq("id", p.id).eq("status", "pending");
    if (error) throw new Error("Transaction already used");
    if (p.purpose === "gram") await s.from("notm_users").update({ paid_gram: true }).eq("id", user.id);
    else await s.from("notm_user_servers").insert({ user_id: user.id, server_id: p.purpose.split(":")[1] });
    await h.notifyAdmins(`💎 <b>Payment received</b>\nUser: ${user.username ? "@" + user.username : user.id}\nAmount: ${p.amount_ton} TON\nFor: ${p.purpose}`);
    return { paid: true, state: await state(data.initData) };
  });

export const verifyCommunity = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const community = await h.setting("community");
    if (!community) throw new Error("Community is not open yet");
    const r = await h.tg("getChatMember", { chat_id: community, user_id: user.id });
    if (!["member", "administrator", "creator"].includes(r?.result?.status)) throw new Error("Join the community first");
    await s.from("notm_users").update({ joined_community: true }).eq("id", user.id);
    return state(data.initData);
  });

export const requestWithdraw = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ amount: z.number().positive().max(1e7), wallet: z.string().min(40).max(70) }).parse(d))
  .handler(async ({ data }) => {
    const { h, user, s } = await me(data.initData);
    const { data: u } = await s.from("notm_users").select("*").eq("id", user.id).single();
    if (!u.paid_gram) throw new Error(`Pay the ${GRAM_FEE} TON withdrawal activation first`);
    if (!u.joined_community) throw new Error("Join the community first");
    if (u.ref_count < 1 && u.ads_watched < WITHDRAW_ADS_REQUIRED) throw new Error("Invite 1 friend or watch 25 ads");
    if (data.amount < MIN_WITHDRAW) throw new Error(`Minimum is ${MIN_WITHDRAW} NOT`);
    if (data.amount > Number(u.balance)) throw new Error("Not enough balance");
    await s.from("notm_users").update({ balance: Number(u.balance) - data.amount }).eq("id", user.id);
    await s.from("notm_withdrawals").insert({ user_id: user.id, amount: data.amount, wallet: data.wallet });
    await h.notifyAdmins(`📤 <b>Withdrawal request</b>\nUser: ${user.username ? "@" + user.username : user.id}\n${data.amount} NOT → <code>${data.wallet}</code>`);
    return state(data.initData);
  });
