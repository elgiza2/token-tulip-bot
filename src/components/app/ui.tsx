import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Glass({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass rounded-3xl", className)}>{children}</div>;
}

export function Pill({ tone = "primary", className, children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "success" | "accent" | "ghost" | "danger" }) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    accent: "coin text-accent-foreground",
    ghost: "bg-secondary text-secondary-foreground",
    danger: "bg-destructive text-destructive-foreground",
  };
  return <button {...p} className={cn("h-12 rounded-2xl px-5 font-bold text-[15px] transition active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100", tones[tone], className)}>{children}</button>;
}

export function CoinIcon({ size = 20 }: { size?: number }) {
  return <span className="coin inline-flex items-center justify-center rounded-full font-black text-accent-foreground shadow-sm" style={{ width: size, height: size, fontSize: size * 0.42 }}>N</span>;
}

export function fmt(n: number, d = 4) { return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
