import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import SpotClaimPage from './ui/SpotClaimPage';
import dispenserABI from './abi/dispenserABI.json';

interface PluginProps {
  dispenserAddress: string;
  dispenserNetwork: string;
}

export default class DenverMiscPlugin implements Plugin {
  private context: BurnerPluginContext | null = null;
  private dispenserAddress: string;
  private dispenserNetwork: string;

  constructor({ dispenserAddress, dispenserNetwork }: PluginProps) {
    this.dispenserNetwork = dispenserNetwork;
    this.dispenserAddress = dispenserAddress;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/spot/:id', SpotClaimPage);
  }

  async claimSpot(id: string, sender: string) {
    const web3 = this.context.getWeb3(this.dispenserNetwork);
    const contract = new web3.eth.Contract(dispenserABI as any, this.dispenserAddress);

    const response = await contract.methods.claim(id).send({ from: sender });
    console.log(response);
  }
}
