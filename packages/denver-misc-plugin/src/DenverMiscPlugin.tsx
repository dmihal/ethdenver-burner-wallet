import React, { useState, useEffect } from 'react';
import { BurnerPluginContext, Plugin, PluginPageContext, PluginActionContext } from '@burner-wallet/types';
import PKClaimPage from './ui/PKClaimPage';
import SpotClaimPage from './ui/SpotClaimPage';
import SweepPage from './ui/SweepPage';
import dispenserABI from './abi/dispenserABI.json';
import simpledispenserABI from './abi/simpledispenserABI.json';
import Accounts from 'web3-eth-accounts';
import { xp_dispenser_address, xp_simple_dispenser_address } from 'denver-config';

// @ts-ignore
const accounts = new Accounts();


const RedirectToSend: React.FC<PluginPageContext<{ address: string; amount?: string }>> =
  ({ match, actions, defaultAccount, BurnerComponents }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.resolve(actions.callSigner('isLoggedIn', 'fortmatic')).then((isLoggedIn: any) => {
      const userType = window.localStorage.getItem('userType');
      setLoggedIn(isLoggedIn || userType === 'claim');
    });
  }, [defaultAccount]);

  if (isLoggedIn) {
    if (match.params.amount) {
      actions.send({
        to: match.params.address,
        asset: 'buff',
        ether: match.params.amount,
        from: defaultAccount,
      });
    } else {
      actions.navigateTo('/send', { to: match.params.address });
    }
  }

  return (
    <BurnerComponents.Page title="Loading...">{null}</BurnerComponents.Page>
  );
}

const VENDOR_URL_REGEX = /\/([vbd])\/(0x[0-9a-f]{40})(?:\/([\d\.]+))?/i;
const SWEEP_REGEX = /\/sweep#((?:0x[0-9a-f]{64})|(?:[\w\-]{43}))/;
const SPOT_REGEX = /\/spot\/((?:0x[0-9a-f]{64})|(?:simple\d+))/;

export default class DenverMiscPlugin implements Plugin {
  private context: BurnerPluginContext | null = null;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.context = pluginContext;
    pluginContext.addPage('/spot/:key', SpotClaimPage);
    pluginContext.addPage('/sweep', SweepPage);
    pluginContext.addPage('/v/:address/:amount?', RedirectToSend)
    pluginContext.addPage('/claim', PKClaimPage);

    pluginContext.onQRScanned((qr: string, ctx: PluginActionContext) => {
      if (VENDOR_URL_REGEX.test(qr)) {
        const parsed = VENDOR_URL_REGEX.exec(qr)!;
        const asset = parsed[1] === 'd' ? 'xdai' : 'buff';
        const address = parsed[2];
        const amount = parsed[3];
        if (amount && amount.length > 0) {
          ctx.actions.send({ to: address, asset, ether: amount });
        } else {
          ctx.actions.navigateTo('/send', { to: address });
        }
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
    const details = await contract.methods.getCode(signer.address).call();

    const hash = web3.utils.soliditySha3({ type: 'address', value: sender });
    const { signature } = signer.sign(hash);
    const response = await contract.methods.claim(signature).send({ from: sender });
    console.log(response);
    return { message: details.message, xp: web3.utils.fromWei(details.value, 'ether') };
  }

  async canClaimSimpleSpot(id: string, user: string) {
    const web3 = this.context!.getWeb3('100');
    const contract = new web3.eth.Contract(simpledispenserABI as any, xp_simple_dispenser_address);
    return await contract.methods.canClaim(id, user).call();
  }

  async claimSimpleSpot(id: string, sender: string) {
    const web3 = this.context!.getWeb3('100');
    const contract = new web3.eth.Contract(simpledispenserABI as any, xp_simple_dispenser_address);

    console.log('claiming', id, sender);
    const details = await contract.methods.getCode(id).call();

    const response = await contract.methods.claim(id).send({ from: sender });
    console.log(response);
    return { message: details.message, xp: web3.utils.fromWei(details.value, 'ether') };
  }
}
