import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import AdminPage from './ui/AdminPage';
import UserPage from './ui/UserPage';
import whitelistABI from './abis/whitelist.json';
import relayhubABI from './abis/IRelayHub.json';

type AccountType = 'Contract Deployed' | 'EOA' | 'Unknown';
type Whitelist = { name: string; network: string; address: string };

const WHITELISTS: Whitelist[] = [
  { name: 'Test Senders', network: '42', address: '0x740bC1C24c993689030a1819De1Ec7d518F354d6' },
  { name: 'Test Receivers', network: '42', address: '0xb441F31f3fb330AAb3Ec24319BA7A7e7D6444701' },
];

export interface UserStatus {
  types: { [network: string]: AccountType };
  whitelists: { name: string, isWhitelisted: boolean }[];
}

const RELAYHUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';

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
    
    const [xdaiType, kovanType, whitelists] = await Promise.all([
      this.getAccountType(address, web3xdai),
      this.getAccountType(address, web3kovan),
      this.getWhitelists(address),
    ]);

    const types: { [network: string]: AccountType } = {
      '42': kovanType,
      '100': xdaiType,
    };

    return { types, whitelists };
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
      return { name, isWhitelisted };
    }));
    return whitelists;
  }

  async isWhitelisted(userAddress: string, whitelistAddress: string, web3: any): Promise<boolean> {
    const contract = new web3.eth.Contract(whitelistABI, whitelistAddress);
    const isWhitelisted = await contract.methods.isWhitelisted(userAddress).call();
    return isWhitelisted;
  }

  async getFaucetCap() {
    return '0';
  }

  async setFaucetCap(cap: string, sender: string) {
    return;
  }
}
