import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const auth = z.object({ initData: z.string().min(10).max(4096) });

async function guard(initData: string, need: "admin" | "manager") {
  const h = await import("@/lib/server/tg");
  const { user } = await h.verifyInitData(initData);
  const role = await h.roleOf(user.username);
  if (!role || (need === "admin" && role !== "admin")) throw new Error("Forbidden");
  return { h, s: await h.db(), role };
}

export const adminOverview = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.parse(d))
  .handler(async ({ data }) => {
    const { h, s, role } = await guard(data.initData, "manager");
    const { data: tasks } = await s.from("notm_tasks").select("*").order("sort");
    if (role !== "admin") return { role, tasks: tasks ?? [], stats: null, withdrawals: [], payments: [], managers: [], community: "" };
    const day = new Date(Date.now() - 864e5).toISOString();
    const [users, today, paid, pend] = await Promise.all([
      s.from("notm_users").select("id", { count: "exact", head: true }),
      s.from("notm_users").select("id", { count: "exact", head: true }).gte("created_at", day),
      s.from("notm_payments").select("amount_ton").eq("status", "paid"),
      s.from("notm_withdrawals").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    const { data: payments } = await s.from("notm_payments").select("*").eq("status", "paid").order("created_at", { ascending: false }).limit(30);
    const { data: managers } = await s.from("notm_task_managers").select("username");
    return {
      role,
      tasks: tasks ?? [],
      stats: { users: users.count ?? 0, newToday: today.count ?? 0, tonEarned: (paid.data ?? []).reduce((a: number, p: any) => a + Number(p.amount_ton), 0), pending: (pend.data ?? []).filter((w: any) => w.status === "pending").length },
      withdrawals: pend.data ?? [],
      payments: payments ?? [],
      managers: (managers ?? []).map((m: any) => m.username as string),
      community: await h.setting("community"),
    };
  });

const taskSchema = z.object({ id: z.string().uuid().optional(), title: z.string().min(1).max(120), kind: z.enum(["link", "ads", "referral", "checkin"]), url: z.string().max(300).nullable(), target: z.number().int().min(1).max(100000), reward: z.number().min(0).max(100000), active: z.boolean(), sort: z.number().int() });

export const saveTask = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ task: taskSchema }).parse(d))
  .handler(async ({ data }) => {
    const { s } = await guard(data.initData, "manager");
    const { id, ...rest } = data.task;
    if (id) await s.from("notm_tasks").update(rest).eq("id", id);
    else await s.from("notm_tasks").insert(rest);
    return true;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { s } = await guard(data.initData, "manager");
    await s.from("notm_tasks").delete().eq("id", data.id);
    return true;
  });

export const setManager = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ username: z.string().min(3).max(40), add: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const { s } = await guard(data.initData, "admin");
    const u = data.username.replace("@", "").toLowerCase();
    if (data.add) await s.from("notm_task_managers").upsert({ username: u });
    else await s.from("notm_task_managers").delete().eq("username", u);
    return true;
  });

export const setWithdrawal = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ id: z.string().uuid(), status: z.enum(["paid", "rejected"]) }).parse(d))
  .handler(async ({ data }) => {
    const { h, s } = await guard(data.initData, "admin");
    const { data: w } = await s.from("notm_withdrawals").select("*").eq("id", data.id).eq("status", "pending").single();
    if (!w) throw new Error("Already processed");
    await s.from("notm_withdrawals").update({ status: data.status }).eq("id", w.id);
    if (data.status === "rejected") await h.addBalance(w.user_id, Number(w.amount));
    await h.tg("sendMessage", { chat_id: w.user_id, parse_mode: "HTML", text: data.status === "paid" ? `✅ <b>Withdrawal sent!</b>\n${w.amount} NOT is on its way to your wallet.` : `↩️ <b>Withdrawal returned</b>\n${w.amount} NOT was added back to your balance.` });
    return true;
  });

export const setCommunity = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ community: z.string().max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { h } = await guard(data.initData, "admin");
    const c = data.community.trim();
    await h.putSetting("community", c && !c.startsWith("@") && !c.startsWith("-") ? "@" + c : c);
    return true;
  });

export const broadcastNow = createServerFn({ method: "POST" })
  .inputValidator((d) => auth.extend({ kind: z.enum(["notify", "gift", "post"]) }).parse(d))
  .handler(async ({ data, }) => {
    const { h } = await guard(data.initData, "admin");
    const { runJob } = await import("@/lib/server/jobs");
    return runJob(data.kind, `manual-${data.kind}-${Date.now()}`, h);
  });
