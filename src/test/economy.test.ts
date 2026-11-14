import { describe, expect, it } from 'vitest';
import { AD_TASK_REWARD, BASE_RATE, GRAM_FEE, MIN_WITHDRAW } from '@/lib/config';

describe('Withdrawal economy', () => {
  it('charges exactly 0.1 TON for withdrawal activation', () => { expect(GRAM_FEE).toBe(0.1); });
  it('sets the minimum withdrawal to 2000 NOT', () => { expect(MIN_WITHDRAW).toBe(2000); });
  it('credits the optional ad task reward', () => { expect(AD_TASK_REWARD).toBe(0.01); });
});