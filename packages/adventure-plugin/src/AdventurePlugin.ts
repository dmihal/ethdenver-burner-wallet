import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import AdventurePage from './ui/AdventurePage';

export default class FortmaticPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/adventure', AdventurePage);
    pluginContext.addButton('apps', 'Adventure', '/adventure');
  } 
}
