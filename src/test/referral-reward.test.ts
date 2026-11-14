import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), writes: [] as Array<Record<string, unknown>>, existing: false }));
vi.mock('@/integrations/supabase/client.server', () => ({ supabaseAdmin: { from: mocks.from } }));
import { registerUser } from '@/lib/server/tg';

describe('New friend referral credit', () => {
  beforeEach(() => {
    mocks.writes.length = 0;
    mocks.existing = false;
    mocks.from.mockImplementation(() => {
      let selected = '';
      const query = {
        select: (fields: string) => { selected = fields; return query; },
        eq: () => query,
        maybeSingle: async () => ({ data: selected === 'ref_count' ? { ref_count: 3 } : mocks.existing ? { id: 222 } : null }),
        single: async () => ({ data: { balance: 10 } }),
        update: (fields: Record<string, unknown>) => { mocks.writes.push(fields); return query; },
        insert: async () => ({ error: null }),
      };
      return query;
    });
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) }));
  });

  it('adds exactly 50 NOT when a new referred friend registers', async () => {
    expect(await registerUser({ id: 222 }, 111)).toBe(true);
    expect(mocks.writes).toContainEqual({ balance: 60 });
    expect(mocks.writes).toContainEqual({ ref_count: 4 });
  });

  it('does not pay again when an existing friend reopens the app', async () => {
    mocks.existing = true;
    expect(await registerUser({ id: 222 }, 111)).toBe(false);
    expect(mocks.writes.some((write) => 'balance' in write)).toBe(false);
  });
});