import Signer from '@burner-wallet/core/signers/Signer';
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const arrayEquals = (a: any[], b: any[]) => a.length === b.length && a.every((val, i) => val === b[i]);

export default class FortmaticSigner extends Signer {
  private fortmatic: any;
  private isLoggedIn: boolean;
  private web3: Web3;

  constructor(key: string) {
    super({ id: 'fortmatic' });
    this.fortmatic = new Fortmatic(key);
    this.isLoggedIn = false;
    this.web3 = new Web3(this.fortmatic.getProvider());

    this.updateAccounts();
  }

  isAvailable() {
    return this.isLoggedIn;
  }

  signTx(tx: any): Promise<string> {
    throw new Error('Not implemented');
  }

  // @ts-ignore
  signMsg(msg: any, account: string) {
    return this.web3.eth.sign(msg, account);
  }

  permissions() {
    return this.isLoggedIn ? [] : ['enable'];
  }

  invoke(action: string) {
    switch (action) {
      case 'enable':
        return this.enable();
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  async enable() {
    await this.fortmatic.getProvider().enable();
    await this.updateAccounts();
  }

  async updateAccounts() {
    this.isLoggedIn = await this.fortmatic.user.isLoggedIn();

    const accounts = this.isLoggedIn ? await this.web3.eth.getAccounts() : [];

    if (!arrayEquals(accounts, this.accounts)) {
      this.accounts = accounts;
      this.events.emit('accountChange');
    }
  }
}
