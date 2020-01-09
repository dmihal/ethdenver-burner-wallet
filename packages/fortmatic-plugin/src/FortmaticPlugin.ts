import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import FortmaticStatusBar from './ui/FortmaticStatusBar';
import FortmaticSettings from './ui/FortmaticSettings';

export default class FortmaticPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', FortmaticStatusBar);
    pluginContext.addElement('advanced', FortmaticSettings);
  } 
}
