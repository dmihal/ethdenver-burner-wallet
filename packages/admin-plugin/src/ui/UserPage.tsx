import React, { useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import AdminPlugin, { UserStatus } from '../AdminPlugin';

const UserPage: React.FC<PluginPageContext<{ account: string }>> = ({ BurnerComponents, match, plugin }) => {
  const _plugin = plugin as AdminPlugin;
  const [status, setStatus] = useState<UserStatus | null>(null);

  const refreshStatus = () => _plugin.getUserStatus(match.params.account)
    .then((status: UserStatus) => setStatus(status));

  useEffect(() => {
    refreshStatus();
  }, [match]);

  const { Page, Button } = BurnerComponents;

  if (!status) {
    return (<Page title="User Details">Loading...</Page>);
  }

  return (
    <Page title="User Details">
      <h2>Wallets</h2>
      <div>Kovan: {status.types['42']}</div>
      <div>xDai: {status.types['100']}</div>
      <h2>Whitelist</h2>
    </Page>
  );
};

export default UserPage;