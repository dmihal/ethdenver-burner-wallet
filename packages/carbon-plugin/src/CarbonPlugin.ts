import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import CarbonPage from './CarbonPage';

export default class CarbonPlugin implements Plugin {
  public apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/carbon', CarbonPage);
    pluginContext.addButton('apps', 'Carbon', '/carbon', {
      description: 'Purchase crypto with a credit card',
    });
  }
}
