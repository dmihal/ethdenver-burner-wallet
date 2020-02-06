import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import Box from '3box';

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

  constructor(chain = '1') {
    this.chain = chain;
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/profile', EditProfilePage);
    pluginContext.addButton('apps', 'Edit Profile', '/profile');

    this.boxPromise = this.createBox();
  }

  getProvider() {
    return this.pluginContext!.getWeb3(this.chain).currentProvider;
  }

  async createBox() {
    const addresses = await windowAny.ethereum.enable();
    this.address = addresses[0];

    const box = await Box.create(windowAny.ethereum);
    await box.auth(['ethDenver'], { address: addresses[0] });

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
