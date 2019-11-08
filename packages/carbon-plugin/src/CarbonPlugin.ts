import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import CarbonPage from './CarbonPage';

export default class CarbonPlugin implements Plugin {
  public apiKey: string;
  public environment: string;

  constructor(apiKey: string, environment: string = 'sandbox') {
    this.apiKey = apiKey;
    this.environment = environment;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/carbon', CarbonPage);
    pluginContext.addButton('apps', 'Carbon', '/carbon', {
      description: 'Purchase crypto with a credit card',
    });
  }
}
