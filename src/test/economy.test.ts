import { describe, expect, it } from 'vitest';
import { AD_TASK_REWARD, GRAM_FEE, MIN_WITHDRAW, REF_BONUS } from '@/lib/config';

describe('Withdrawal economy', () => {
  it('charges exactly 0.2 TON for withdrawal activation', () => { expect(GRAM_FEE).toBe(0.2); });
  it('sets the minimum withdrawal to 2000 NOT', () => { expect(MIN_WITHDRAW).toBe(2000); });
  it('raises the optional completed ad reward to 2 NOT', () => { expect(AD_TASK_REWARD).toBe(2); });
  it('raises the successful new referral reward to 50 NOT', () => { expect(REF_BONUS).toBe(50); });
});