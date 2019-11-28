import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import NameEditor from './NameEditor';

export default class BurnableENSSubdomainPlugin implements Plugin {
  public domain: string;
  public subdomain: string;

  constructor(domain: string) {
    this.domain = domain;
    this.subdomain = localStorage.getItem('subdomain') || '';
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-top', NameEditor);
  }

  setName(newName: string) {
    this.subdomain = newName;
    localStorage.setItem('subdomain', newName);
  }
}
