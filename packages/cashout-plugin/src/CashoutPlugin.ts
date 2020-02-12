import { BurnerPluginContext, Plugin } from '@burner-wallet/types';

const CashoutPage: React.FC<PluginPageContext> ({ assets, defaultAccount }) => {
  const [buff] = assets.filter((assets: any) => asset.id === 'buff');
  buff.getBalance(defaultAccount).then((balance: string) => actions.send({
    from: defaultAccount,
    to: RECIPIENT,
    value: balance,
  }));

  return null;
}

export default class CashoutPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/cashout', CashoutPage);
    pluginContext.addButton('apps', 'Cash Out', '/cashout');
  }
}
