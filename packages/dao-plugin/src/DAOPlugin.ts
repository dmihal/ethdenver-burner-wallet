import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import DAOPage from './ui/DAOPage';

export default class FortmaticPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/dao', DAOPage);
    pluginContext.addButton('apps', 'DAO', '/dao');
  } 
}
