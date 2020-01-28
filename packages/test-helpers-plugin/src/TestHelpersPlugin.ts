import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import ButtonBar from './ButtonBar';
import testHelperAbi from './testHelperAbi.json';
import { toWei } from 'web3-utils';

export default class TestHelpersPlugin implements Plugin {
  private adapterAddress: string;
  private adapterContract: any;
  private faucetOn = false;

  constructor(address: string) {
    this.adapterAddress = address;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', ButtonBar);

    const web3 = pluginContext.getWeb3('42');
    this.adapterContract = new web3.eth.Contract(testHelperAbi as any, this.adapterAddress);
  }

  async mint(account: string, amount: number) {
    await this.adapterContract.methods.mintBuffidai(toWei(amount.toString(), 'ether')).send({ from: account });
  }

  async toggleFaucet(account: string) {
    await this.adapterContract.methods.toggleFaucet(account, !this.faucetOn).send({ from: account });
  }
}
