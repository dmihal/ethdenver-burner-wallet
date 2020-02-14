import { BurnerPluginContext, Plugin, PluginPageContext, PluginActionContext } from '@burner-wallet/types';
import PKClaimPage from './ui/PKClaimPage';
import SpotClaimPage from './ui/SpotClaimPage';
import SweepPage from './ui/SweepPage';
import dispenserABI from './abi/dispenserABI.json';
import Accounts from 'web3-eth-accounts';
import { xp_dispenser_address } from 'denver-config';

// @ts-ignore
const accounts = new Accounts();


const VENDOR_URL_REGEX = /\/([vd])\/(0x[0-9a-f]{40})(?:\/([\d\.]+))?/i;
const SWEEP_REGEX = /\/sweep#(0x[0-9a-f]{64})/;
const SPOT_REGEX = /\/spot\/(0x[0-9a-f]{64})/;

export default class DenverMiscPlugin implements Plugin {
  private context: BurnerPluginContext | null = null;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/spot/:key', SpotClaimPage);

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
    pluginContext.addPage('/sweep', SweepPage);
    pluginContext.addPage('/v/:address/:amount?', RedirectToSend)
    pluginContext.addPage('/claim', PKClaimPage);

    pluginContext.onQRScanned((qr: string, ctx: PluginActionContext) => {
      if (VENDOR_URL_REGEX.test(qr)) {
        const parsed = VENDOR_URL_REGEX.exec(qr)!;
        const asset = parsed[1] === 'd' ? 'xdai' : 'buff';
        const address = parsed[2];
        const amount = parsed[3];
        ctx.actions.send({ to: address, asset, ether: amount });
        return true;
      }

      if (SPOT_REGEX.test(qr)) {
        const pk = SPOT_REGEX.exec(qr)![1];
        ctx.actions.navigateTo(`/spot/${pk}`);
        return true;
      }

      if (SWEEP_REGEX.test(qr)) {
        const pk = SWEEP_REGEX.exec(qr)![1];
        ctx.actions.navigateTo(`/sweep#${pk}`);
        return true;
      }
    });
  }

  async canClaimSpot(pk: string, user: string) {
    const web3 = this.context!.getWeb3('100');
    const contract = new web3.eth.Contract(dispenserABI as any, xp_dispenser_address);
    const signer = accounts.privateKeyToAccount(pk);
    return await contract.methods.canClaim(signer.address, user).call();
  }

  async claimSpot(pk: string, sender: string) {
    const web3 = this.context!.getWeb3('100');
    const contract = new web3.eth.Contract(dispenserABI as any, xp_dispenser_address);

    const signer = accounts.privateKeyToAccount(pk);
    console.log('claiming', signer, sender);

    const hash = web3.utils.soliditySha3({ type: 'address', value: sender });
    const { signature } = signer.sign(hash);
    const response = await contract.methods.claim(signature).send({ from: sender });
    console.log(response);
  }
}
