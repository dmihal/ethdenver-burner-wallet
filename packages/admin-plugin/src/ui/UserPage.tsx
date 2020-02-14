import React, { useState, useEffect, Fragment } from 'react';
import { PluginPageContext, Asset, AccountBalanceData } from '@burner-wallet/types';
import AdminPlugin, { UserStatus } from '../AdminPlugin';
import EditableNumber from './EditableNumber';

const UserPage: React.FC<PluginPageContext<{ account: string }>> = ({
  BurnerComponents, match, plugin, assets, defaultAccount
}) => {
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

      <h2>Faucets</h2>
      {status.faucets.map(({ name, rate, cap, address, network }) => (
        <div key={name}>
          <div>{name}</div>
          <div>
            Rate:
            <EditableNumber
              value={rate}
              onSave={async (newVal: string) => {
                await _plugin.setFaucetRate(match.params.account, newVal, address, network, defaultAccount);
                refreshStatus();
              }}
            />
            {} XP/second
          </div>
          <div>
            Cap:
            <EditableNumber
              value={cap}
              onSave={async (newVal: string) => {
                await _plugin.setUserFaucetCap(match.params.account, newVal, address, network, defaultAccount);
                refreshStatus();
              }}
            />
          </div>
        </div>
      ))}


      <h2>Wallets</h2>
      <div>Kovan: {status.types['42']}</div>
      <div>xDai: {status.types['100']}</div>

      <h2>Whitelist</h2>
      {status.whitelists.map(({ name, isWhitelisted, address, network }) => (
        <div key={name}>
          {name}: {isWhitelisted ? 'whitelisted' : 'not whitelisted'}
          <Button
            onClick={async () => {
              await _plugin.setWhitelisted(match.params.account, !isWhitelisted, address, network, defaultAccount);
              refreshStatus();
            }}
          >
            Toggle
          </Button>
        </div>
      ))}
    </Page>
  );
};

export default UserPage;