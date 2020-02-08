import BurnerCore from '@burner-wallet/core';
import Signer, { SignedTransaction } from '@burner-wallet/core/signers/Signer';

const STORAGE_KEY = 'burnerAccountCache';

interface PendingCall {
  tx?: any;
  msg?: string;
  resolve: (result: any) => void;
  reject: (error: any) => void;
}

export default class AccountCacheSigner extends Signer {
  private serveCache = true;
  private exteriorAccounts: string[] = [];
  private pendingCalls: { [account: string]: PendingCall[] } = {};

  constructor(startupTime: number = 5) {
    super({ id: 'cache' });
    this.accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    setTimeout(() => {
      this.serveCache = false;
      if (this.accounts.length > 0) {
        this.accounts = [];
        this.events.emit('accountChange');
        const droppedCalls = Object.values(this.pendingCalls)
          .reduce((total: number, list: Array<any>) => total + list.length, 0);
        if (droppedCalls > 0) {
          console.warn(`[AccountCacheSigner] Dropped ${droppedCalls}`);
        }
      }
    }, startupTime * 1000);
  }

  setCore(core: BurnerCore) {
    this.core = core;
    this.updateAccounts(core.getAccounts());
    core.onAccountChange((accounts: string[]) => this.updateAccounts(accounts));
  }

  isAvailable() {
    return this.serveCache;
  }

  permissions() {
    return [];
  }

  invoke(action: string) {
    throw new Error(`Unexpected action ${action}`);
  }

  signTx(tx: any) {
    return new Promise<SignedTransaction>((resolve, reject) => {
      if (this.exteriorAccounts.indexOf(tx.from) !== -1) {
        this.serveCache = false;
        Promise.resolve(this.core!.signTx(tx)).then(resolve, reject);
        this.serveCache = true;
      } else {
        this.addPending(tx.from, { tx, resolve, reject });
      }
    });
  }

  signMsg(msg: string, account: string) {
    return new Promise<string>((resolve, reject) => {
      if (this.exteriorAccounts.indexOf(account) !== -1) {
        this.serveCache = false;
        Promise.resolve(this.core!.signMsg(msg, account)).then(resolve, reject);
        this.serveCache = true;
      } else {
        this.addPending(account, { msg, resolve, reject });
      }
    });
  }

  addPending(account: string, pending: PendingCall) {
    this.pendingCalls[account] = this.pendingCalls[account] || [];
    this.pendingCalls[account].push(pending);
  }

  async sendPending() {
    let numSent = 0;
    for (const account of this.exteriorAccounts) {
      if (this.pendingCalls[account] && this.pendingCalls[account].length > 0) {
        for (const call of this.pendingCalls[account]) {
          try {
            const response = await (call.tx ? this.core!.signTx(call.tx) : this.core!.signMsg(call.msg!, account));
            call.resolve(response);
            numSent++;
          } catch (e) {
            call.reject(e);
          }
        }
        this.pendingCalls[account] = [];
      }
    }
    if (numSent > 0) {
      console.log(`[AccountCacheSigner] Signed ${numSent}`);
    }
  }

  updateAccounts(accounts: string[]) {
    if (this.serveCache) {
      this.serveCache = false;
      this.exteriorAccounts = this.core!.getAccounts();
      this.sendPending();
      this.serveCache = true;
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }
}
