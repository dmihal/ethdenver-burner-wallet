import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import { get3Box } from './3boxlib';

import EditProfilePage from './ui/EditProfilePage';

const windowAny:any = window;

export default class ThreeBoxEditProfilePlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;
  private chain: string;
  private box: object;
  private profile: object;
  private address: string;
  private space: object;

  private boxPromise: object;

  constructor() {
    this.chain = '100';
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/profile', EditProfilePage);
    pluginContext.addButton('apps', 'Edit Profile', '/profile');

    this.boxPromise = this.createBox();
  }

  async createBox() {
    const web3 = this.pluginContext!.getWeb3(this.chain);
    this.address = (await web3.eth.getAccounts())[0];

    const Box = await get3Box();
    const box = await Box.create(web3.currentProvider);
    await box.auth(['ethDenver'], { address: this.address });

    this.profile = await Box.getProfile(this.address);
    this.space = await box.openSpace('ethDenver');
    this.box = box;

    await box.syncDone;
  }

  async exposeBox() {
    if (!this.box) await this.boxPromise;

    return {
      box: this.box,
      profile: this.profile,
      address: this.address,
      space: this.space,
    }
  }
}
