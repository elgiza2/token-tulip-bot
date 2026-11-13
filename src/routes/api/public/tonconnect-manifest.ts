import { createFileRoute } from '@tanstack/react-router';
import avatar from '@/assets/bot-avatar.jpg';

export const Route = createFileRoute('/api/public/tonconnect-manifest')({
  server: { handlers: { GET: async ({ request }) => {
    const origin = new URL(request.url).origin;
    return Response.json({ url: origin, name: 'NOT Miner', iconUrl: new URL(avatar, origin).href });
  } } },
});