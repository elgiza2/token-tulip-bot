// Browser-only SDK is loaded inside user actions, never during SSR.
let sdk: import('@tonconnect/ui').TonConnectUI | undefined;
export async function tonWallet() {
  if (!sdk) {
    const { TonConnectUI } = await import('@tonconnect/ui');
    sdk = new TonConnectUI({ manifestUrl: `${window.location.origin}/api/public/tonconnect-manifest` });
  }
  return sdk;
}

export async function connectWallet() {
  const ui = await tonWallet();
  if (!ui.wallet) await ui.openModal();
  return ui;
}

export async function sendTonPayment(payment: { address: string; amount: number; memo: string }) {
  const ui = await tonWallet();
  if (!ui.wallet) { await ui.openModal(); return false; }
  const { beginCell } = await import('@ton/core');
  const payload = beginCell().storeUint(0, 32).storeStringTail(payment.memo).endCell().toBoc().toString('base64');
  await ui.sendTransaction({ validUntil: Math.floor(Date.now() / 1000) + 300, messages: [{ address: payment.address, amount: String(Math.round(payment.amount * 1e9)), payload }] });
  return true;
}