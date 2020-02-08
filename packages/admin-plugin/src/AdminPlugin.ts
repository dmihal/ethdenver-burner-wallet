import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import AdminPage from './ui/AdminPage';
import UserPage from './ui/UserPage';
import whitelistABI from './abis/whitelist.json';
import relayhubABI from './abis/IRelayHub.json';
import walletABI from './abis/Wallet.json';
import { xp_test_network, senderlist_test_address, receiverlist_test_address } from 'denver-config';

type AccountType = 'Contract Deployed' | 'EOA' | 'Unknown';
type Whitelist = { name: string; network: string; address: string };

const WHITELISTS: Whitelist[] = [
  { name: 'Test Senders', network: xp_test_network, address: senderlist_test_address },
  { name: 'Test Receivers', network: xp_test_network, address: receiverlist_test_address },
];

export interface UserStatus {
  types: { [network: string]: AccountType };
  whitelists: { name: string, isWhitelisted: boolean, address: string, network: string }[];
}

const RELAYHUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';
const ADMIN_WALLET = '0x6ebfe51d736c34eefb9107fcab912dd604682616';

interface AdminPluginProps {
  contractWalletFactory: string;
}

export default class AdminPlugin implements Plugin {
  private context: BurnerPluginContext | null = null;
  public contractWalletFactory: string;

  constructor(props: AdminPluginProps) {
    this.contractWalletFactory = props.contractWalletFactory;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/admin/user/:account', UserPage);
    pluginContext.addPage('/admin', AdminPage);
    pluginContext.addButton('apps', 'Admin', '/admin');
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
    
    const [xdaiType, kovanType, whitelists, isAdmin] = await Promise.all([
      this.getAccountType(address, web3xdai),
      this.getAccountType(address, web3kovan),
      this.getWhitelists(address),
      this.isAdmin(address),
    ]);

    const types: { [network: string]: AccountType } = {
      '42': kovanType,
      '100': xdaiType,
    };

    return { types, whitelists: whitelists.concat(isAdmin) };
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
    const contract = new web3.eth.Contract(whitelistABI, whitelistAddress);
    const isWhitelisted = await contract.methods.isWhitelisted(userAddress).call();
    return isWhitelisted;
  }

  async setWhitelisted(address: string, _isWhitelisted: boolean, whitelist: string, network: string, sender: string) {
    if (whitelist === ADMIN_WALLET) {
      return this.setAdmin(address, _isWhitelisted, network, sender);
    }

    const web3 = this.context!.getWeb3(network);
    const contract = new web3.eth.Contract(whitelistABI, whitelist);
    const data = contract.methods.setWhitelisted(_isWhitelisted, [address]).encodeABI();
    console.log({ whitelist, data, sender });
    return this.send(whitelist, data, sender, network);
  }

  async isAdmin(address: string) {
    const adminNetworks = ['4','42'];

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

  async getFaucetCap() {
    return '0';
  }

  async setFaucetCap(cap: string, sender: string) {
    return;
  }
}
