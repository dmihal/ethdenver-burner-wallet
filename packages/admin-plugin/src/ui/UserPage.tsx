import React, { useState, useEffect } from 'react';
import { PluginPageContext, Asset, AccountBalanceData } from '@burner-wallet/types';
import AdminPlugin, { UserStatus } from '../AdminPlugin';

const UserPage: React.FC<PluginPageContext<{ account: string }>> = ({ BurnerComponents, match, plugin, assets }) => {
  const _plugin = plugin as AdminPlugin;
  const [status, setStatus] = useState<UserStatus | null>(null);

  const refreshStatus = () => _plugin.getUserStatus(match.params.account)
    .then((status: UserStatus) => setStatus(status));

  useEffect(() => {
    refreshStatus();
  }, [match]);

  const { Page, Button, AccountBalance } = BurnerComponents;

  if (!status) {
    return (<Page title="User Details">Loading...</Page>);
  }

  return (
    <Page title="User Details">
      <h2>Balances</h2>
      {assets.map((asset: Asset) => (
        <AccountBalance
          key={asset.id}
          asset={asset}
          account={match.params.account}
          render={(data: AccountBalanceData | null) => {
            if (!data) {
              return null;
            }

            return (
              <div>{asset.name}: {data.displayBalance}</div>
            );
          }}
        />
      ))}

      <h2>Wallets</h2>
      <div>Kovan: {status.types['42']}</div>
      <div>xDai: {status.types['100']}</div>

      <h2>Whitelist</h2>
      {status.whitelists.map(({ name, isWhitelisted }) => (
        <div key={name}>{name}: {isWhitelisted ? 'whitelisted' : 'not whitelisted'}</div>
      ))}
    </Page>
  );
};

export default UserPage;