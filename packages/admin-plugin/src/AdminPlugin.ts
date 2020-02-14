import { BurnerPluginContext, Plugin, PluginActionContext } from '@burner-wallet/types';
import AdminPage from './ui/AdminPage';
import SpotsPage from './ui/SpotsPage';
import UserPage from './ui/UserPage';
import whitelistABI from './abis/whitelist.json';
import relayhubABI from './abis/IRelayHub.json';
import dispenserABI from './abis/Dispenser.json';
import walletABI from './abis/Wallet.json';
import faucetABI from './abis/Faucet.json';
import tokenABI from './abis/XPToken.json';
import { senderlist_address, receiverlist_address, xp_faucet_address, xp_dispenser_address } from 'denver-config';
import Accounts from 'web3-eth-accounts';

type AccountType = 'Contract Deployed' | 'EOA' | 'Unknown';
type CONTRACT = { name: string; network: string; address: string };

const WHITELISTS: CONTRACT[] = [
  { name: 'Senders', network: '100', address: senderlist_address },
  { name: 'Receivers', network: '100', address: receiverlist_address },
];

const FAUCETS: CONTRACT[] = [
  { name: 'Faucet', network: '100', address: xp_faucet_address },
];

export interface UserStatus {
  types: { [network: string]: AccountType };
  whitelists: { name: string, isWhitelisted: boolean, address: string, network: string }[];
  faucets: { name: string, rate: string, cap: string, address: string, network: string }[];
}

const RELAYHUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';
const ADMIN_WALLET = '0x6ebfe51d736c34eefb9107fcab912dd604682616';

const ADDRESS_REGEX = /(0x[0-9a-f]{40})/i;
const PK_REGEX = /(0x[0-9a-f]{64})/i;

interface AdminPluginProps {
  contractWalletFactory: string;
}

// @ts-ignore
const accounts = new Accounts();

export default class AdminPlugin implements Plugin {
  private context: BurnerPluginContext | null = null;
  public contractWalletFactory: string;

  constructor(props: AdminPluginProps) {
    this.contractWalletFactory = props.contractWalletFactory;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/admin/spots', SpotsPage);
    pluginContext.addPage('/admin/user/:account', UserPage);
    pluginContext.addPage('/admin', AdminPage);
    pluginContext.addButton('apps', 'Admin', '/admin');

    pluginContext.onQRScanned((qr: string, ctx: PluginActionContext) => {
      if (ADDRESS_REGEX.test(qr)) {
        const address = ADDRESS_REGEX.exec(qr)![1];
        ctx.actions.navigateTo(`/admin/user/${address}`);
        return true;
      }

      if (PK_REGEX.test(qr)) {
        const pk = PK_REGEX.exec(qr)![1];
        const account = accounts.privateKeyToAccount(pk);
        ctx.actions.navigateTo(`/admin/user/${account.address}`);
        return true;
      }
    });
  }

  async getGSNBalance(address: string, network: string) {
    const web3 = this.context!.getWeb3(network);
    const hub = new web3.eth.Contract(relayhubABI as any, RELAYHUB_ADDRESS);
    const balance = await hub.methods.balanceOf(address).call();
    return web3.utils.fromWei(balance, 'ether');
  }

  async getUserStatus(address: string): Promise<UserStatus> {
    const web3xdai = this.context!.getWeb3('100');
    const web3kovan = this.context!.getWeb3('42');
    
    const [xdaiType, kovanType, whitelists, isAdmin, faucets] = await Promise.all([
      this.getAccountType(address, web3xdai),
      this.getAccountType(address, web3kovan),
      this.getWhitelists(address),
      this.isAdmin(address),
      this.getFaucetRates(address),
    ]);

    const types: { [network: string]: AccountType } = {
      '42': kovanType,
      '100': xdaiType,
    };

    return { types, whitelists: whitelists.concat(isAdmin), faucets };
  }

  async getAccountType(address: string, web3: any): Promise<AccountType> {
    const [code, count] = await Promise.all([
      web3.eth.getCode(address),
      web3.eth.getTransactionCount(address),
    ]);
    if (code !== '0x') {
      return 'Contract Deployed';
    }
    if (count > 0) {
      return 'EOA';
    }

    return 'Unknown';
  }

  async getWhitelists(userAddress: string) {
    const whitelists = await Promise.all(WHITELISTS.map(async ({ name, network, address }) => {
      const web3 = this.context!.getWeb3(network);
      const isWhitelisted = await this.isWhitelisted(userAddress, address, web3);
      return { name, isWhitelisted, network, address };
    }));
    return whitelists;
  }

  async isWhitelisted(userAddress: string, whitelistAddress: string, web3: any): Promise<boolean> {
    const contract = new web3.eth.Contract(whitelistABI as any, whitelistAddress);
    const isWhitelisted = await contract.methods.isWhitelisted(userAddress).call();
    return isWhitelisted;
  }

  async setWhitelisted(address: string, _isWhitelisted: boolean, whitelist: string, network: string, sender: string) {
    if (whitelist === ADMIN_WALLET) {
      return this.setAdmin(address, _isWhitelisted, network, sender);
    }

    const web3 = this.context!.getWeb3(network);
    const contract = new web3.eth.Contract(whitelistABI as any, whitelist);
    const data = contract.methods.setWhitelisted(_isWhitelisted, [address]).encodeABI();
    return this.send(whitelist, data, sender, network);
  }

  async isAdmin(address: string) {
    const adminNetworks = ['100'];

    const admins = await Promise.all(adminNetworks.map(async (network: string) => {
      const web3 = this.context!.getWeb3(network);
      const wallet = new web3.eth.Contract(walletABI as any, ADMIN_WALLET);
      const isWhitelisted = await wallet.methods.isOwner(address).call();
      return { name: `Admin ${network}`, isWhitelisted, network, address: ADMIN_WALLET };
    }))
    return admins;
  }

  async setAdmin(address: string, _isWhitelisted: boolean, network: string, sender: string) {
    const web3 = this.context!.getWeb3(network);
    const wallet = new web3.eth.Contract(walletABI as any, ADMIN_WALLET);
    if (_isWhitelisted) {
      return wallet.methods.addOwner(address).send({ from: sender });
    } else {
      return wallet.methods.removeOwner(address).send({ from: sender });
    }
  }

  async send(target: string, data: string, sender: string, network: string) {
    const web3 = this.context!.getWeb3(network);
    const wallet = new web3.eth.Contract(walletABI as any, ADMIN_WALLET);
    const receipt = await wallet.methods.execute(target, data, '0').send({ from: sender });
    return receipt;
  }

  async getFaucets() {
    return await Promise.all(FAUCETS.map(async ({ name, network, address }) => {
      const web3 = this.context!.getWeb3(network);
      const faucet = new web3.eth.Contract(faucetABI as any, address);
      const cap = web3.utils.fromWei(await faucet.methods.cap().call(), 'ether');
      const tokenAddress = await faucet.methods.token().call();
      const token = new web3.eth.Contract(tokenABI as any, tokenAddress);
      const denominations = (await token.methods.getDenominations().call())
        .map((denomination: string) => web3.utils.fromWei(denomination, 'ether'));
      return { name, network, address, cap, denominations };
    }));
  }

  async setFaucetCap(cap: string, address: string, network: string, sender: string) {
    const web3 = this.context!.getWeb3(network);
    const faucet = new web3.eth.Contract(faucetABI as any, address);
    const data = faucet.methods.setCap(web3.utils.toWei(cap, 'ether')).encodeABI();
    return this.send(address, data, sender, network);
  }

  async setDenomination(denomination: string, isAllowed: boolean, faucetAddress: string, network: string, sender: string) {
    const web3 = this.context!.getWeb3(network);
    const faucet = new web3.eth.Contract(faucetABI as any, faucetAddress);
    const tokenAddress = await faucet.methods.token().call();
    const token = new web3.eth.Contract(tokenABI as any, tokenAddress);

    const data = token.methods.setDenomination(web3.utils.toWei(denomination, 'ether'), isAllowed).encodeABI();
    return this.send(tokenAddress, data, sender, network);
  }

  async getFaucetRates(user: string) {
    const faucets = await Promise.all(FAUCETS.map(async ({ name, network, address }) => {
      const web3 = this.context!.getWeb3(network);
      const faucet = new web3.eth.Contract(faucetABI as any, address);
      const rate = web3.utils.fromWei(await faucet.methods.rate(user).call(), 'ether');
      const cap = web3.utils.fromWei(await faucet.methods.userCap(user).call(), 'ether');
      return { name, rate, cap, network, address };
    }));
    return faucets;
  }

  async setFaucetRate(user: string, rate: string, address: string, network: string, sender: string) {
    const web3 = this.context!.getWeb3(network);
    const faucet = new web3.eth.Contract(faucetABI as any, address);
    const data = faucet.methods.setRate(web3.utils.toWei(rate, 'ether'), [user]).encodeABI();
    return this.send(address, data, sender, network);
  }

  async setUserFaucetCap(user: string, cap: string, address: string, network: string, sender: string) {
    const web3 = this.context!.getWeb3(network);
    const faucet = new web3.eth.Contract(faucetABI as any, address);
    const data = faucet.methods.setUserCap(web3.utils.toWei(cap, 'ether'), [user]).encodeABI();
    return this.send(address, data, sender, network);
  }

  async createSpot(signer: string, value: string, message: string, sender: string) {
    const web3 = this.context!.getWeb3('100');
    const dispenser = new web3.eth.Contract(dispenserABI as any, xp_dispenser_address);

    const limit = '0';
    const data = dispenser.methods.createCode(web3.utils.toWei(value, 'ether'), signer, message, limit).encodeABI();
    return this.send(xp_dispenser_address, data, sender, '100');
  }
}
