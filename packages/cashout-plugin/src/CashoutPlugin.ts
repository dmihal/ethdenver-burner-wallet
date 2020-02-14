import { BurnerPluginContext, Plugin, PluginPageContext } from '@burner-wallet/types';

const CashoutPage: React.FC<PluginPageContext> = ({ assets, defaultAccount, actions, plugin }) => {
  const [buff] = assets.filter((asset: any) => asset.id === 'buff');
  buff.getBalance(defaultAccount).then((balance: string) => actions.send({
    from: defaultAccount,
    to: (plugin as CashoutPlugin).recipient,
    value: balance,
    asset: 'buff',
  }));

  return null;
}

export default class CashoutPlugin implements Plugin {
  public recipient: string;

  constructor(recipient: string) {
    this.recipient = recipient;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/cashout', CashoutPage);
    pluginContext.addButton('apps', 'Cash Out', '/cashout');
  }
}
