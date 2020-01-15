import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import EditProfilePage from './ui/EditProfilePage';

export default class ThreeBoxEditProfilePlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;
  private chain: string;

  constructor(chain = '1') {
    this.chain = chain;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/profile', EditProfilePage);
    pluginContext.addButton('apps', 'Edit Profile', '/profile');
  } 

  getProvider() {
    return this.pluginContext!.getWeb3(this.chain).currentProvider;
  }
}
