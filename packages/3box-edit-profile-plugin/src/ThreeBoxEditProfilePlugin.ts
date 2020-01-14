import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import EditProfilePage from './ui/EditProfilePage';

export default class ThreeBoxEditProfilePlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/profile', EditProfilePage);
    pluginContext.addButton('apps', 'Edit Profile', '/profile');
  } 
}
