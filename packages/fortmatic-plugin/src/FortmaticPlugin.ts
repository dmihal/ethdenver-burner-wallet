import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import FortmaticStatusBar from './ui/FortmaticStatusBar';

export default class FortmaticPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', FortmaticStatusBar);
  } 
}
