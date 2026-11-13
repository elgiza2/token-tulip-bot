import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pickaxe, Server, ListChecks, Gamepad2, Wallet, Check, Copy, Users, Play, Sparkles, Lock, ChevronRight } from "lucide-react";
import { adWatched, bootstrap, checkPayment, claimMining, claimTask, createPayment, gameReward, requestWithdraw, verifyCommunity, type AppState } from "@/lib/app.functions";
import { initTelegram, haptic, showAd, openLink } from "@/lib/telegram";
import { Glass, Pill, CoinIcon, fmt } from "@/components/app/ui";
import { SERVER_LIST } from "@/lib/servers";
import { AD_TASK_REWARD, GAME_COOLDOWN_SEC, GRAM_FEE, MIN_WITHDRAW, SESSION_HOURS, WITHDRAW_ADS_REQUIRED } from "@/lib/config";
import { connectWallet, sendTonPayment, tonWallet } from '@/lib/ton-wallet';
import avatar from '@/assets/bot-avatar.jpg';
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOT Miner — Mine Notcoin in Telegram" },
      { name: "description", content: "Start a mining session, boost with servers, complete tasks and withdraw NOT to your TON wallet." },
      { property: "og:title", content: "NOT Miner — Mine Notcoin in Telegram" },
      { property: "og:description", content: "Mine NOT daily inside Telegram with servers, tasks and games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Tab = "mine" | "servers" | "tasks" | "games" | "wallet";
const TABS: { id: Tab; label: string; Icon: typeof Pickaxe }[] = [
  { id: "mine", label: "Mine", Icon: Pickaxe },
  { id: "servers", label: "Servers", Icon: Server },
  { id: "tasks", label: "Tasks", Icon: ListChecks },
  { id: "games", label: "Games", Icon: Gamepad2 },
  { id: "wallet", label: "Withdraw", Icon: Wallet },
];

function useApi() {
  const [initData, setInitData] = useState<string | null>(null);
  const [st, setSt] = useState<AppState | null>(null);
  const [err, setErr] = useState("");
  const boot = useServerFn(bootstrap);
  useEffect(() => {
    const d = initTelegram();
    setInitData(d);
    if (!d) { setErr("Open this app from the Telegram bot."); return; }
    boot({ data: { initData: d } }).then(setSt).catch((e) => setErr(e.message));
  }, []);
  return { initData: initData ?? "", st, setSt, err };
}

function App() {
  const { initData, st, setSt, err } = useApi();
  const [tab, setTab] = useState<Tab>("mine");
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab") as Tab | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, []);

  if (err) return <Center><Glass className="p-6 text-center"><img src={avatar} alt="NOT Miner duck" width={1024} height={1024} className="mx-auto mb-4 h-28 w-28 rounded-full" /><p className="text-lg font-bold">NOT Miner</p><p className="mt-2 text-muted-foreground">{err}</p><Pill className="mt-4" onClick={() => openLink('https://t.me/iiocasinobot?startapp')}>Open in Telegram</Pill></Glass></Center>;
  if (!st) return <Center><div className="coin h-16 w-16 animate-spin-slow rounded-full" /></Center>;

  const p = { st, setSt, initData };
  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-32" style={{ paddingTop: "calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px) + 12px)" }}>
      <Header st={st} />
      <div key={tab} className="animate-pop">
        {tab === "mine" && <MineTab {...p} />}
        {tab === "servers" && <ServersTab {...p} />}
        {tab === "tasks" && <TasksTab {...p} />}
        {tab === "games" && <GamesTab {...p} />}
        {tab === "wallet" && <WalletTab {...p} />}
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4" style={{ paddingBottom: "calc(var(--tg-safe-area-inset-bottom, 0px) + 12px)" }}>
        <Glass className="flex justify-between p-1.5">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { haptic(); setTab(id); }} className={cn("flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold transition", tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </Glass>
      </nav>
    </div>
  );
}

type P = { st: AppState; setSt: (s: AppState) => void; initData: string };

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh items-center justify-center p-6">{children}</div>;
}

function Header({ st }: { st: AppState }) {
  const u = st.user;
  return (
    <div className="mb-4 flex items-center gap-3">
      {u.photo_url ? <img src={u.photo_url} alt="" className="h-10 w-10 rounded-full" /> : <div className="glass flex h-10 w-10 items-center justify-center rounded-full font-bold">{(u.first_name || "U")[0]}</div>}
      <div className="flex-1"><p className="text-xs text-muted-foreground">Welcome back</p><p className="font-bold leading-tight">{u.first_name || "Miner"}</p></div>
      <Glass className="flex items-center gap-1.5 rounded-full px-3 py-1.5"><CoinIcon size={18} /><span className="tabular text-sm font-bold">{fmt(Number(u.balance), 2)}</span></Glass>
    </div>
  );
}

function useAd(p: P, purpose: "mine" | "task" | "game" | "server") {
  const fn = useServerFn(adWatched);
  const [busy, setBusy] = useState(false);
  return {
    busy,
    run: async () => {
      setBusy(true);
      try {
        const ok = await showAd();
        if (!ok) { toast.error("Ad not available, try again in a moment"); return false; }
        p.setSt(await fn({ data: { initData: p.initData, purpose } }));
        haptic("success");
        return true;
      } catch (e: any) { toast.error(e.message); return false; } finally { setBusy(false); }
    },
  };
}

function MineTab(p: P) {
  const { st } = p;
  const started = st.user.mining_started_at ? new Date(st.user.mining_started_at).getTime() : 0;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 100); return () => clearInterval(t); }, []);
  const total = SESSION_HOURS * 3.6e6;
  const elapsed = started ? Math.min(total, now - started) : 0;
  const mined = (elapsed / 3.6e6) * st.rate;
  const done = started && elapsed >= total;
  const ad = useAd(p, "mine");
  const claim = useServerFn(claimMining);
  const left = total - elapsed;
  const hh = Math.floor(left / 3.6e6), mm = Math.floor((left % 3.6e6) / 6e4), ss = Math.floor((left % 6e4) / 1000);

  return (
    <div className="space-y-4">
      <Glass className="relative overflow-hidden p-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground">Total balance</p>
        <p className="tabular mt-1 text-4xl font-black tracking-tight">{fmt(Number(st.user.balance) + mined, 6)}</p>
        <p className="text-sm font-bold text-muted-foreground">NOT</p>
        <div className="relative mx-auto my-6 flex h-44 w-44 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--muted)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={283} strokeDashoffset={283 - (283 * elapsed) / total} />
          </svg>
          <div className={cn("coin flex h-28 w-28 items-center justify-center rounded-full text-5xl font-black text-accent-foreground shadow-xl", started && !done && "animate-float")}>N</div>
        </div>
        {started ? (
          <>
            <p className="tabular text-lg font-bold text-success">+{fmt(mined, 6)} mined</p>
            <p className="tabular text-sm text-muted-foreground">{done ? "Session complete" : `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")} left`}</p>
          </>
        ) : <p className="text-sm text-muted-foreground">Watch one short ad to start a {SESSION_HOURS}h session</p>}
      </Glass>

      <div className="grid grid-cols-2 gap-3">
        <Glass className="p-4"><p className="text-xs text-muted-foreground">Speed</p><p className="tabular text-lg font-bold">{fmt(st.rate, 3)}<span className="text-xs font-semibold text-muted-foreground"> NOT/h</span></p></Glass>
        <Glass className="p-4"><p className="text-xs text-muted-foreground">Servers</p><p className="text-lg font-bold">{st.owned.length + 1}<span className="text-xs font-semibold text-muted-foreground"> active</span></p></Glass>
      </div>

      {!started ? (
        <Pill tone="success" className="w-full" disabled={ad.busy} onClick={ad.run}><Play className="mr-1 inline h-4 w-4" /> Start mining</Pill>
      ) : done ? (
        <Pill tone="accent" className="w-full" onClick={async () => { p.setSt(await claim({ data: { initData: p.initData } })); haptic("success"); toast.success("Collected!"); }}>Collect & restart</Pill>
      ) : (
        <Pill tone="primary" className="w-full" disabled={ad.busy} onClick={ad.run}><Sparkles className="mr-1 inline h-4 w-4" /> Collect now & refresh session</Pill>
      )}
    </div>
  );
}

function usePay(p: P) {
  const create = useServerFn(createPayment);
  const check = useServerFn(checkPayment);
  const [pending, setPending] = useState<{ id: string; memo: string; amount: number; address: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  return {
    pending,
    checking,
    sending,
    start: async (purpose: string) => {
      try {
        const r = await create({ data: { initData: p.initData, purpose } });
        setPending(r);
        await connectWallet();
      } catch (e: any) { toast.error(e.message); }
    },
    send: async () => {
      if (!pending || sending) return;
      setSending(true);
      try { if (await sendTonPayment(pending)) toast.success('Transfer submitted — check payment after confirmation.'); }
      catch (e: any) { toast.error(e.message || 'Transfer cancelled'); }
      finally { setSending(false); }
    },
    verify: async () => {
      if (!pending) return;
      setChecking(true);
      try {
        const r = await check({ data: { initData: p.initData, id: pending.id } });
        if (r.paid && r.state) { p.setSt(r.state); setPending(null); haptic("success"); toast.success("Payment confirmed!"); }
        else toast("Not found yet — it can take up to a minute.");
      } catch (e: any) { toast.error(e.message); } finally { setChecking(false); }
    },
    cancel: () => setPending(null),
  };
}

function PaySheet({ pay }: { pay: ReturnType<typeof usePay> }) {
  if (!pay.pending) return null;
  const { amount, address, memo } = pay.pending;
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/20 p-4" onClick={pay.cancel}>
      <Glass className="animate-pop mx-auto w-full max-w-md space-y-3 bg-popover p-5" >
        <div onClick={(e) => e.stopPropagation()} className="space-y-3">
          <p className="text-lg font-black">Pay {amount} TON</p>
          <p className="text-sm text-muted-foreground">Include the comment exactly — it links the payment to your account.</p>
          <Pill className="w-full" disabled={pay.sending} onClick={pay.send}><Wallet className="mr-2 inline h-4 w-4" />{pay.sending ? 'Confirm in wallet…' : 'Pay with TON Connect'}</Pill>
          <button onClick={() => copy(address)} className="flex w-full items-center justify-between rounded-2xl bg-secondary p-3 text-left text-xs"><span className="truncate font-mono">{address}</span><Copy className="ml-2 h-4 w-4 shrink-0" /></button>
          <button onClick={() => copy(memo)} className="flex w-full items-center justify-between rounded-2xl bg-secondary p-3 text-left text-sm"><span>Comment: <b className="font-mono">{memo}</b></span><Copy className="h-4 w-4" /></button>
          <Pill tone="success" className="w-full" disabled={pay.checking} onClick={pay.verify}>{pay.checking ? "Checking…" : "I've paid — check"}</Pill>
        </div>
      </Glass>
    </div>
  );
}

function ServersTab(p: P) {
  const pay = usePay(p);
  const ad = useAd(p, "server");
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-black">Servers</h1>
      <p className="text-sm text-muted-foreground">Each server adds permanent mining speed.</p>
      {SERVER_LIST.map((s) => {
        const owned = p.st.owned.includes(s.id);
        return (
          <Glass key={s.id} className="flex items-center gap-3 p-3">
            <img src={s.img} alt={s.name} loading="lazy" width={816} height={816} className="h-20 w-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-bold">{s.name}</p>
              <p className="text-sm font-semibold text-success">+{s.rate} NOT/h</p>
              {s.ads > 0 && !owned && <p className="text-xs text-muted-foreground">{Math.min(p.st.user.ads_watched, s.ads)}/{s.ads} ads</p>}
            </div>
            {owned ? <span className="flex items-center gap-1 rounded-full bg-success/15 px-3 py-1.5 text-sm font-bold text-success"><Check className="h-4 w-4" />Active</span>
              : s.priceTon > 0 ? <Pill className="h-10 px-4 text-sm" onClick={() => pay.start(`server:${s.id}`)}>{s.priceTon} TON</Pill>
              : <Pill tone="accent" className="h-10 px-4 text-sm" disabled={ad.busy} onClick={ad.run}>Watch ad</Pill>}
          </Glass>
        );
      })}
      <PaySheet pay={pay} />
    </div>
  );
}

function TasksTab(p: P) {
  const claim = useServerFn(claimTask);
  const ad = useAd(p, "task");
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const refLink = `https://t.me/${p.st.bot || "bot"}?start=r${p.st.user.id}`;
  const doClaim = async (id: string) => {
    try { p.setSt(await claim({ data: { initData: p.initData, taskId: id } })); haptic("success"); toast.success("Reward added!"); } catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-black">Tasks</h1>
      <Glass className="space-y-3 p-4">
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><p className="font-bold">Invite friends</p><span className="ml-auto text-sm font-bold">{p.st.user.ref_count} joined</span></div>
        <p className="text-sm text-muted-foreground">+1 NOT for every friend who joins.</p>
        <div className="flex gap-2">
          <Pill className="flex-1" onClick={() => openLink(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("⛏ Mine NOT with me!")}`)}>Invite</Pill>
          <Pill tone="ghost" onClick={() => { navigator.clipboard.writeText(refLink); toast.success("Link copied"); }}><Copy className="h-4 w-4" /></Pill>
        </div>
        {p.st.friends.length > 0 && <div className="space-y-1 border-t border-border pt-2">{p.st.friends.slice(0, 5).map((f: any, i: number) => <p key={i} className="text-sm">{f.first_name || f.username}</p>)}</div>}
      </Glass>
      <Pill tone="accent" className="w-full" disabled={ad.busy} onClick={ad.run}><Play className="mr-1 inline h-4 w-4" /> Watch ad · +{AD_TASK_REWARD} NOT</Pill>
      <p className="text-xs text-muted-foreground">Optional rewarded ads · {p.st.user.ads_watched} completed. Availability depends on the ad provider.</p>
      {p.st.tasks.map((t: any) => {
        const ready = t.kind === "link" ? opened[t.id] : t.kind === "checkin" ? true : t.progress >= t.target;
        return (
          <Glass key={t.id} className="flex items-center gap-3 p-4">
            <div className="flex-1">
              <p className="font-semibold">{t.title}</p>
              <p className="flex items-center gap-1 text-sm font-bold text-muted-foreground"><CoinIcon size={14} /> +{t.reward}{(t.kind === "ads" || t.kind === "referral") && <span className="ml-2 font-medium">{Math.min(t.progress, t.target)}/{t.target}</span>}</p>
            </div>
            {t.done ? <Check className="h-6 w-6 text-success" />
              : t.kind === "link" && !opened[t.id] ? <Pill className="h-10 px-4 text-sm" onClick={() => { openLink(t.url); setOpened((o) => ({ ...o, [t.id]: true })); }}>Open <ChevronRight className="inline h-4 w-4" /></Pill>
              : <Pill tone="success" className="h-10 px-4 text-sm" disabled={!ready} onClick={() => doClaim(t.id)}>{ready ? "Claim" : <Lock className="h-4 w-4" />}</Pill>}
          </Glass>
        );
      })}
    </div>
  );
}

function GamesTab(p: P) {
  const [game, setGame] = useState<"tap" | "wheel" | null>(null);
  const ad = useAd(p, "game");
  const reward = useServerFn(gameReward);
  const start = async (g: "tap" | "wheel") => { if (await ad.run()) setGame(g); };
  const finish = async (g: "tap" | "wheel", score: number) => {
    try { const r = await reward({ data: { initData: p.initData, game: g, score } }); p.setSt(r.state); toast.success(`+${fmt(r.reward, 3)} NOT`); haptic("success"); }
    catch (e: any) { toast.error(e.message); }
    setGame(null);
  };
  if (game === "tap") return <TapGame onEnd={(s) => finish("tap", s)} />;
  if (game === "wheel") return <WheelGame onEnd={(s) => finish("wheel", s)} />;
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-black">Games</h1>
      <p className="text-sm text-muted-foreground">Watch a short ad before each round. {GAME_COOLDOWN_SEC}s between rounds.</p>
      {[{ id: "tap" as const, t: "Coin Rush", d: "Tap falling coins for 15 seconds", e: "🪙" }, { id: "wheel" as const, t: "Lucky Wheel", d: "Spin for a random NOT prize", e: "🎡" }].map((g) => (
        <Glass key={g.id} className="flex items-center gap-4 p-4">
          <div className="coin flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">{g.e}</div>
          <div className="flex-1"><p className="font-bold">{g.t}</p><p className="text-sm text-muted-foreground">{g.d}</p></div>
          <Pill tone="primary" className="h-10 px-4 text-sm" disabled={ad.busy} onClick={() => start(g.id)}>Play</Pill>
        </Glass>
      ))}
    </div>
  );
}

function TapGame({ onEnd }: { onEnd: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(15);
  const [coins, setCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const ended = useRef(false);
  const scoreRef = useRef(0);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    const c = setInterval(() => setCoins((cs) => [...cs.slice(-6), { id: Math.random(), x: 10 + Math.random() * 75, y: 10 + Math.random() * 70 }]), 450);
    return () => { clearInterval(t); clearInterval(c); };
  }, []);
  useEffect(() => { if (left <= 0 && !ended.current) { ended.current = true; onEnd(scoreRef.current); } }, [left]);
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-lg font-black"><span>🪙 {score}</span><span className="tabular">{Math.max(0, left)}s</span></div>
      <Glass className="relative h-[60dvh] overflow-hidden">
        {coins.map((c) => (
          <button key={c.id} className="coin animate-pop absolute h-14 w-14 rounded-full text-xl font-black text-accent-foreground shadow-lg" style={{ left: `${c.x}%`, top: `${c.y}%` }}
            onClick={() => { haptic(); scoreRef.current++; setScore((s) => s + 1); setCoins((cs) => cs.filter((x) => x.id !== c.id)); }}>N</button>
        ))}
      </Glass>
    </div>
  );
}

const PRIZES = [0.02, 0.05, 0.1, 0.03, 0.2, 0.01, 0.5, 0.04];
function WheelGame({ onEnd }: { onEnd: (score: number) => void }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    const idx = Math.floor(Math.random() * 8);
    setSpinning(true);
    setRot(360 * 6 + (360 - idx * 45 - 22.5));
    setTimeout(() => onEnd(idx), 4200);
  };
  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      <div className="relative h-72 w-72">
        <div className="absolute left-1/2 top-[-6px] z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-primary" />
        <div className="glass h-full w-full rounded-full transition-transform duration-[4000ms] ease-out" style={{ transform: `rotate(${rot}deg)`, background: "conic-gradient(var(--accent) 0 45deg, var(--card) 45deg 90deg, var(--accent) 90deg 135deg, var(--card) 135deg 180deg, var(--accent) 180deg 225deg, var(--card) 225deg 270deg, var(--accent) 270deg 315deg, var(--card) 315deg 360deg)" }}>
          {PRIZES.map((p, i) => <span key={i} className="absolute left-1/2 top-1/2 text-sm font-black" style={{ transform: `rotate(${i * 45 + 22.5}deg) translateY(-110px) translateX(-50%)` }}>{p}</span>)}
        </div>
      </div>
      <Pill tone="success" className="w-48" disabled={spinning} onClick={spin}>{spinning ? "Spinning…" : "Spin"}</Pill>
    </div>
  );
}

function WalletTab(p: P) {
  const u = p.st.user;
  const pay = usePay(p);
  const verify = useServerFn(verifyCommunity);
  const withdraw = useServerFn(requestWithdraw);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [joinOpened, setJoinOpened] = useState(false);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;
    tonWallet().then((ui) => {
      if (!active) return;
      const update = () => { const a = ui.account; setConnected(Boolean(a)); if (a) setWallet(a.address); };
      update(); unsubscribe = ui.onStatusChange(update);
    }).catch(() => {});
    return () => { active = false; unsubscribe?.(); };
  }, []);
  const activity = u.ref_count >= 1 || u.ads_watched >= WITHDRAW_ADS_REQUIRED;
  const steps = [
    { t: `One-time withdrawal activation: ${GRAM_FEE} TON`, ok: u.paid_gram, action: <Pill className="h-9 px-3 text-sm" onClick={() => pay.start("gram")}>Pay</Pill> },
    { t: "Join our community", ok: u.joined_community, action: p.st.community ? (joinOpened ? <Pill tone="success" className="h-9 px-3 text-sm" onClick={async () => { try { p.setSt(await verify({ data: { initData: p.initData } })); } catch (e: any) { toast.error(e.message); } }}>Verify</Pill> : <Pill className="h-9 px-3 text-sm" onClick={() => { openLink(`https://t.me/${p.st.community.replace("@", "")}`); setJoinOpened(true); }}>Join</Pill>) : <span className="text-xs text-muted-foreground">Soon</span> },
    { t: `Invite 1 friend or watch ${WITHDRAW_ADS_REQUIRED} ads`, ok: activity, action: <span className="tabular text-xs font-bold text-muted-foreground">{Math.min(u.ads_watched, WITHDRAW_ADS_REQUIRED)}/{WITHDRAW_ADS_REQUIRED}</span> },
  ];
  const ready = steps.every((s) => s.ok);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-black">Withdraw</h1>
      <Glass className="p-5 text-center"><p className="text-sm text-muted-foreground">Available</p><p className="tabular text-3xl font-black">{fmt(Number(u.balance), 4)} <span className="text-base">NOT</span></p><p className="text-xs text-muted-foreground">Minimum {MIN_WITHDRAW} NOT</p></Glass>
      <p className="text-xs text-muted-foreground">About 37.5 active mining hours from zero at base speed; restart every {SESSION_HOURS} hours. Rewards can shorten this. Manual payouts, not guaranteed earnings. Wallet network fees are separate.</p>
      <Glass className="divide-y divide-border">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold", s.ok ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground")}>{s.ok ? <Check className="h-4 w-4" /> : i + 1}</span>
            <p className="flex-1 text-sm font-semibold">{s.t}</p>
            {!s.ok && s.action}
          </div>
        ))}
      </Glass>
      <Glass className="space-y-3 p-4">
        <Pill tone="ghost" className="w-full" onClick={async () => { try { const ui = await tonWallet(); if (connected) await ui.disconnect(); else await connectWallet(); } catch (e: any) { toast.error(e.message); } }}><Wallet className="mr-2 inline h-4 w-4" />{connected ? 'Disconnect wallet' : 'Connect TON wallet'}</Pill>
        <input value={wallet} onChange={(e) => setWallet(e.target.value.trim())} placeholder="TON wallet address" className="h-12 w-full rounded-2xl bg-secondary px-4 text-sm outline-none" />
        <div className="flex gap-2">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="Amount" className="h-12 flex-1 rounded-2xl bg-secondary px-4 text-sm outline-none" />
          <Pill tone="ghost" onClick={() => setAmount(String(Math.floor(Number(u.balance) * 100) / 100))}>Max</Pill>
        </div>
        <Pill tone="success" className="w-full" disabled={!ready} onClick={async () => {
          try { p.setSt(await withdraw({ data: { initData: p.initData, amount: Number(amount), wallet } })); setAmount(""); toast.success("Request sent! Payouts are reviewed manually."); } catch (e: any) { toast.error(e.message); }
        }}>Withdraw</Pill>
      </Glass>
      {p.st.withdrawals.length > 0 && <Glass className="divide-y divide-border">{p.st.withdrawals.map((w: any, i: number) => <div key={i} className="flex justify-between p-3 text-sm"><span>{fmt(Number(w.amount), 2)} NOT</span><span className="font-semibold capitalize text-muted-foreground">{w.status}</span></div>)}</Glass>}
      <PaySheet pay={pay} />
    </div>
  );
}
