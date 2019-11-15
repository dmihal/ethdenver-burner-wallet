import { BurnerPluginContext, Plugin, Actions } from '@burner-wallet/types';
import LinkdropSDK from '@linkdrop/sdk/src/index';
import linkdropABI from './abi/linkdrop-factory.json';
import LinkdropInfoPage from './ui/LinkdropInfoPage';
import LinkdropPage from './ui/LinkdropPage';

const FACTORY_ADDRESS = "0xBa051891B752ecE3670671812486fe8dd34CC1c8";

const CHAINS: { [id: string]: string } = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '5': 'goerli',
  '42': 'kovan',
  '100': 'xdai',
};

interface PluginActionContext {
  actions: Actions;
}

export default class LinkdropPlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/linkdrop/info', LinkdropInfoPage);
    pluginContext.addPage('/linkdrop', LinkdropPage);
    pluginContext.addButton('apps', 'Claim', '/linkdrop/info', {
      description: 'Linkdrop claim page',
    });
  }

  getLinkdropSDK(network: string, linkdropMasterAddress: string) {
    return new LinkdropSDK({
      factoryAddress: FACTORY_ADDRESS,
      chain: CHAINS[network],
      linkdropMasterAddress,
    })
  }

  async checkIfClaimed({ chainId, linkdropMasterAddress, linkKey, campaignId }:
    { chainId: string, linkdropMasterAddress: string, linkKey: string, campaignId: string }) {
    const web3 = this.pluginContext!.getWeb3(chainId);
    const factoryContract = new web3.eth.Contract(linkdropABI as any, FACTORY_ADDRESS);
    const { address: linkId } = web3.eth.accounts.privateKeyToAccount(linkKey);
    return await factoryContract.methods.isClaimedLink(linkdropMasterAddress, campaignId, linkId).call();
  }
}
