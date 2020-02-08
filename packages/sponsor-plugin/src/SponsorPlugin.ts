import { BurnerPluginContext, Plugin, PluginPageContext, Asset } from '@burner-wallet/types';
import SendXPPage from './ui/SendXPPage';
import xpABI from './abi/xpABI.json';
import { toWei } from 'web3-utils';

interface SimpleMission {
  title: string;
  task: string;
  xp: string;
}

export interface Mission extends SimpleMission {
  canSend: boolean;
  error: string | null;
}

const RedirectToSendXP: React.FC<PluginPageContext<{ address: string }>> = ({ match, actions }) => {
  actions.navigateTo(`/sendxp/${match.params.address}`);
  return null;
};

export default class SponsorPlugin implements Plugin {
  private context?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/b/:address', RedirectToSendXP)

    pluginContext.addPage('/sendxp/:to', SendXPPage);
  }

  async getMissions(sponsor: string, recipient: string): Promise<Mission[]> {
    const contract = this.getXPContract();

    const missionList = await this.getMissionList(sponsor);
    const missions = await Promise.all(missionList.map(async (mission: SimpleMission) => {
      const result = await contract.methods.canSend(sponsor, recipient, toWei(mission.xp, 'ether')).call();
      return { ...mission, canSend: result[0], error: result[1].length === 0 ? null : result[1] };
    }));
    return missions;
  }

  async getMissionList(sponsor: string): Promise<SimpleMission[]> {
    const response = await fetch(`https://s.buffidao.com/sponsor/${sponsor}`);
    const missions = await response.json();
    return missions as SimpleMission[];
  }

  getXPContract(): any {
    const assets = this.context!.getAssets();
    const [xpAsset] = assets.filter((asset: Asset) => asset.id === 'xp');
    if (!xpAsset) {
      throw new Error('Can\'t find XP');
    }

    const web3 = this.context!.getWeb3(xpAsset.network);
    // @ts-ignore
    const contract = new web3.eth.Contract(xpABI as any, xpAsset.address);
    return contract;
  }
}
