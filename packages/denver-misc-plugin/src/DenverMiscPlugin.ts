import { BurnerPluginContext, Plugin, PluginPageContext, PluginActionContext } from '@burner-wallet/types';
import SpotClaimPage from './ui/SpotClaimPage';
import dispenserABI from './abi/dispenserABI.json';

interface PluginProps {
  dispenserAddress: string;
  dispenserNetwork: string;
}

const VENDOR_URL_REGEX = /\/([vd])\/(0x[0-9a-f]{40})(?:\/([\d\.]+))?/i;

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

    const RedirectToSend: React.FC<PluginPageContext<{ address: string; amount?: string }>> =
      ({ match, actions }) => {
        if (match.params.amount) {
          actions.send({
            to: match.params.address,
            asset: 'buff',
            ether: match.params.amount,
          });
        } else {
          actions.navigateTo('/send', { to: match.params.address });
        }
        return null;
      }
    pluginContext.addPage('/v/:address/:amount?', RedirectToSend)

    pluginContext.onQRScanned((qr: string, ctx: PluginActionContext) => {
      if (VENDOR_URL_REGEX.test(qr)) {
        const parsed = VENDOR_URL_REGEX.exec(qr)!;
        const asset = parsed[1] === 'd' ? 'xdai' : 'buff';
        const address = parsed[2];
        const amount = parsed[3];
        ctx.actions.send({ to: address, asset, ether: amount });
        return true;
      }
    });
  }

  async claimSpot(id: string, sender: string) {
    const web3 = this.context.getWeb3(this.dispenserNetwork);
    const contract = new web3.eth.Contract(dispenserABI as any, this.dispenserAddress);

    const response = await contract.methods.claim(id).send({ from: sender });
    console.log(response);
  }
}
