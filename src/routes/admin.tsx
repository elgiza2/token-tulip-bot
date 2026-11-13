import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { adminOverview, broadcastNow, deleteTask, saveTask, setCommunity, setManager, setWithdrawal } from "@/lib/admin.functions";
import { initTelegram } from "@/lib/telegram";
import { Glass, Pill, fmt } from "@/components/app/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — NOT Miner" },
      { name: "description", content: "NOT Miner admin panel." },
      { property: "og:title", content: "Admin — NOT Miner" },
      { property: "og:description", content: "NOT Miner admin panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Data = Awaited<ReturnType<typeof adminOverview>>;
const blank = { title: "", kind: "link" as const, url: "", target: 1, reward: 1, active: true, sort: 50 };

function Admin() {
  const [initData, setInitData] = useState("");
  const [d, setD] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [edit, setEdit] = useState<any>(null);
  const [mgr, setMgr] = useState("");
  const [comm, setComm] = useState("");
  const load = useServerFn(adminOverview);
  const save = useServerFn(saveTask), del = useServerFn(deleteTask), setM = useServerFn(setManager), setW = useServerFn(setWithdrawal), setC = useServerFn(setCommunity), bc = useServerFn(broadcastNow);
  const refresh = async (id = initData) => { try { const r = await load({ data: { initData: id } }); setD(r); setComm(r.community); } catch (e: any) { setErr(e.message); } };
  useEffect(() => { const id = initTelegram(); setInitData(id); if (!id) setErr("Open from Telegram with /101"); else refresh(id); }, []);
  const act = async (fn: () => Promise<unknown>, msg = "Saved") => { try { await fn(); toast.success(msg); await refresh(); } catch (e: any) { toast.error(e.message); } };

  if (err) return <div className="p-6 text-center font-bold">{err}</div>;
  if (!d) return <div className="p-6 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-md space-y-4 p-4 pb-16" style={{ paddingTop: "calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px) + 12px)" }}>
      <h1 className="text-2xl font-black">Admin {d.role === "manager" && <span className="text-base text-muted-foreground">· Tasks</span>}</h1>

      {d.stats && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {[["Users", d.stats.users], ["New 24h", d.stats.newToday], ["TON earned", fmt(d.stats.tonEarned, 2)], ["Pending payouts", d.stats.pending]].map(([k, v]) => (
              <Glass key={k as string} className="p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="text-xl font-black">{v}</p></Glass>
            ))}
          </div>

          <Glass className="space-y-2 p-4">
            <p className="font-bold">Broadcast now</p>
            <div className="grid grid-cols-3 gap-2">
              <Pill className="h-10 text-sm" onClick={() => act(() => bc({ data: { initData, kind: "notify" } }), "Sent batch")}>Notify</Pill>
              <Pill tone="accent" className="h-10 text-sm" onClick={() => act(() => bc({ data: { initData, kind: "gift" } }), "Gifts sent")}>Gift</Pill>
              <Pill tone="success" className="h-10 text-sm" onClick={() => act(() => bc({ data: { initData, kind: "post" } }), "Posted")}>Post</Pill>
            </div>
          </Glass>

          <Glass className="space-y-2 p-4">
            <p className="font-bold">Community channel</p>
            <div className="flex gap-2"><input value={comm} onChange={(e) => setComm(e.target.value)} placeholder="@channel" className="h-11 flex-1 rounded-2xl bg-secondary px-3 text-sm outline-none" /><Pill className="h-11 text-sm" onClick={() => act(() => setC({ data: { initData, community: comm } }))}>Save</Pill></div>
            <p className="text-xs text-muted-foreground">Add the bot as admin of the channel.</p>
          </Glass>

          <Glass className="space-y-2 p-4">
            <p className="font-bold">Withdrawals</p>
            {d.withdrawals.length === 0 && <p className="text-sm text-muted-foreground">None yet</p>}
            {d.withdrawals.map((w: any) => (
              <div key={w.id} className="space-y-1 border-t border-border pt-2 text-sm">
                <div className="flex justify-between"><b>{fmt(Number(w.amount), 2)} NOT</b><span className="capitalize text-muted-foreground">{w.status}</span></div>
                <p className="break-all font-mono text-xs" onClick={() => { navigator.clipboard.writeText(w.wallet); toast.success("Copied"); }}>{w.wallet}</p>
                {w.status === "pending" && <div className="flex gap-2"><Pill tone="success" className="h-9 flex-1 text-sm" onClick={() => act(() => setW({ data: { initData, id: w.id, status: "paid" } }))}>Mark paid</Pill><Pill tone="danger" className="h-9 flex-1 text-sm" onClick={() => act(() => setW({ data: { initData, id: w.id, status: "rejected" } }))}>Reject</Pill></div>}
              </div>
            ))}
          </Glass>

          <Glass className="space-y-2 p-4">
            <p className="font-bold">Recent payments</p>
            {d.payments.map((p: any) => <div key={p.id} className="flex justify-between text-sm"><span>{p.purpose}</span><b>{p.amount_ton} TON</b></div>)}
          </Glass>

          <Glass className="space-y-2 p-4">
            <p className="font-bold">Task managers</p>
            {d.managers.map((m: string) => <div key={m} className="flex items-center justify-between text-sm">@{m}<button onClick={() => act(() => setM({ data: { initData, username: m, add: false } }))}><Trash2 className="h-4 w-4 text-destructive" /></button></div>)}
            <div className="flex gap-2"><input value={mgr} onChange={(e) => setMgr(e.target.value)} placeholder="@username" className="h-11 flex-1 rounded-2xl bg-secondary px-3 text-sm outline-none" /><Pill className="h-11 text-sm" onClick={() => act(() => setM({ data: { initData, username: mgr, add: true } })).then(() => setMgr(""))}>Add</Pill></div>
          </Glass>
        </>
      )}

      <Glass className="space-y-2 p-4">
        <div className="flex items-center justify-between"><p className="font-bold">Tasks</p><button onClick={() => setEdit({ ...blank })} className="flex items-center gap-1 text-sm font-bold text-primary"><Plus className="h-4 w-4" />New</button></div>
        {d.tasks.map((t: any) => (
          <div key={t.id} className="flex items-center gap-2 border-t border-border pt-2 text-sm">
            <button className="flex-1 text-left" onClick={() => setEdit({ ...t, reward: Number(t.reward) })}><b>{t.title}</b><p className="text-xs text-muted-foreground">{t.kind} · +{Number(t.reward)} · {t.active ? "on" : "off"}</p></button>
            <button onClick={() => act(() => del({ data: { initData, id: t.id } }), "Deleted")}><Trash2 className="h-4 w-4 text-destructive" /></button>
          </div>
        ))}
      </Glass>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/20 p-4">
          <Glass className="mx-auto w-full max-w-md space-y-2 bg-popover p-4">
            <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Title" className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm outline-none" />
            <select value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value })} className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm">
              <option value="link">Open link / join channel</option><option value="ads">Watch ads</option><option value="referral">Invite friends</option><option value="checkin">Daily check-in</option>
            </select>
            {edit.kind === "link" && <input value={edit.url ?? ""} onChange={(e) => setEdit({ ...edit, url: e.target.value })} placeholder="https://t.me/..." className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm outline-none" />}
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs">Target<input type="number" value={edit.target} onChange={(e) => setEdit({ ...edit, target: Number(e.target.value) })} className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm" /></label>
              <label className="text-xs">Reward<input type="number" step="0.01" value={edit.reward} onChange={(e) => setEdit({ ...edit, reward: Number(e.target.value) })} className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm" /></label>
              <label className="text-xs">Order<input type="number" value={edit.sort} onChange={(e) => setEdit({ ...edit, sort: Number(e.target.value) })} className="h-11 w-full rounded-2xl bg-secondary px-3 text-sm" /></label>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />Active</label>
            <div className="flex gap-2">
              <Pill tone="ghost" className="flex-1" onClick={() => setEdit(null)}>Cancel</Pill>
              <Pill tone="success" className="flex-1" onClick={() => act(() => save({ data: { initData, task: { id: edit.id, title: edit.title, kind: edit.kind, url: edit.url || null, target: edit.target, reward: edit.reward, active: edit.active, sort: edit.sort } } })).then(() => setEdit(null))}>Save</Pill>
            </div>
          </Glass>
        </div>
      )}
    </div>
  );
}
