import { describe, expect, it } from 'vitest';
import { AD_TASK_REWARD, BASE_RATE, GRAM_FEE, MIN_WITHDRAW } from '@/lib/config';

describe('Withdrawal economy', () => {
  it('charges exactly 0.1 TON for withdrawal activation', () => { expect(GRAM_FEE).toBe(0.1); });
  it('requires between one and two days of base mining from zero', () => {
    expect(MIN_WITHDRAW / BASE_RATE).toBeGreaterThanOrEqual(24);
    expect(MIN_WITHDRAW / BASE_RATE).toBeLessThanOrEqual(48);
  });
  it('credits the optional ad task reward', () => { expect(AD_TASK_REWARD).toBe(0.01); });
});