import React, { useEffect } from 'react';
import { PluginPageContext, Asset } from '@burner-wallet/types';
import CarbonPlugin from './CarbonPlugin';

let carbonScriptTag: HTMLScriptElement | null = null;

const supportedTokens = ['eth', 'dai', 'xdai', 'usdc'];

const CarbonPage: React.FC<PluginPageContext> = ({ assets, plugin, burnerComponents, defaultAccount }) => {
  const _plugin = plugin as CarbonPlugin;
  const { Page } = burnerComponents;

  const carbonAssets = assets
        .map((asset: Asset) => asset.id)
        .filter((asset: string) => supportedTokens.indexOf(asset) !== -1);

  if (carbonAssets.length === 0) {
    return (
      <Page title="Carbon">No available tokens to purchase :(</Page>
    );
  }

  const initializeWidget = () => {
    const receiveAddress: { [assetId: string]: string } = {};
    carbonAssets.forEach(id => {
      receiveAddress[id] = defaultAccount;
    });
    // @ts-ignore
    window.CarbonWidget.default.carbonFiber.render({
      clientName: 'Burner Wallet',
      environment: _plugin.environment,
      apiKey: _plugin.apiKey,
      targetContainerId: 'carbon-container',
      tokens: carbonAssets.join(','),
      homeScreenMessage: 'Loading Carbon...',
      receiveAddress,
      showSell: false,
    });
  };

  useEffect(() => {
    if (!carbonScriptTag) {
      carbonScriptTag = document.createElement('script');
      carbonScriptTag.onload = initializeWidget;
      document.head.appendChild(carbonScriptTag);
      carbonScriptTag.src = 'https://carbon12.s3.amazonaws.com/carbonFiber.js';
    } else {
      initializeWidget();
    }
  }, []);

  return (
    <Page title="Carbon">
      <div id="carbon-container" style={{ display: 'flex', justifyContent: 'center' }} />
    </Page>
  );
};

export default CarbonPage;
