import { BurnerPluginContext, Plugin, PluginPageContext } from '@burner-wallet/types';
import SendXPPage from './ui/SendXPPage';
import xpABI from './abi/xpABI.json';

interface SimpleMission {
  title: string;
  task: string;
  xp: string;
}

export interface Mission extends SimpleMission {
  canSend: boolean;
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
    // const web3 = this.context.getWeb3(this.dispenserNetwork);
    // const contract = new web3.eth.Contract(dispenserABI as any, this.dispenserAddress);

    const missionList = await this.getMissionList(sponsor);
    const missions = await Promise.all(missionList.map(async (mission: SimpleMission) => {
      return { ...mission, canSend: true };
    }));
    return missions;
  }

  async getMissionList(sponsor: string): Promise<SimpleMission[]> {
    const response = await fetch(`https://s.buffidao.com/sponsor/${sponsor}`);
    const missions = await response.json();
    return missions as SimpleMission[];
  }
}
