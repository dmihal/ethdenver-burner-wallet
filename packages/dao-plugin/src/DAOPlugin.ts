import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import DAOPage from './ui/DAOPage';

export default class DAOPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/dao', DAOPage);
  }
}
