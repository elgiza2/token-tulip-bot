// Browser-safe app constants shared by UI and server.
export const COIN = "NOT";
export const PAY_ADDRESS = "UQAp1QxnLJ2z44IooUovvtVShw7hJBEdxCRV3RlbCYC3D8qj";
export const SUPER_ADMINS = ["eigiza", "torker"];
export const AD_ZONE = "12255910";
export const BASE_RATE = 0.04; // NOT per hour
export const SESSION_HOURS = 6;
export const MIN_WITHDRAW = 50;
export const WITHDRAW_ADS_REQUIRED = 25;
export const GRAM_FEE = 1; // TON
export const GAME_COOLDOWN_SEC = 30;
export const REF_BONUS = 1;

export type ServerDef = { id: string; name: string; rate: number; priceTon: number; ads: number; img: string; tint: string };
export const SERVERS: Omit<ServerDef, "img">[] = [
  { id: "s1", name: "Nano Node", rate: 0.03, priceTon: 0, ads: 10, tint: "warm" },
  { id: "s2", name: "Rack Pro", rate: 0.35, priceTon: 0.5, ads: 0, tint: "cool" },
  { id: "s3", name: "Tower X", rate: 1.6, priceTon: 2, ads: 0, tint: "amber" },
  { id: "s4", name: "Quantum Core", rate: 5, priceTon: 5, ads: 0, tint: "magenta" },
];
