import s1 from "@/assets/server-1.jpg";
import s2 from "@/assets/server-2.jpg";
import s3 from "@/assets/server-3.jpg";
import s4 from "@/assets/server-4.jpg";
import { SERVERS } from "@/lib/config";
const imgs: Record<string, string> = { s1, s2, s3, s4 };
export const SERVER_LIST = SERVERS.map((s) => ({ ...s, img: imgs[s.id] }));
