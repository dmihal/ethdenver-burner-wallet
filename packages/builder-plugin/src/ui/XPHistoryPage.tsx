import React from 'react';
import { PluginPageContext, Asset, AccountBalanceData } from '@burner-wallet/types';

const XPHistoryPage: React.FC<PluginPageContext<{ account?: string }>> = ({ match, defaultAccount, BurnerComponents }) => {

  const { Page, History } = BurnerComponents;
  return (
    <Page title={match.params.account ? `XP for ${match.params.account}` : 'Your XP'}>
    </Page>
  );
}

export default XPHistoryPage;
