import React, { useEffect, useState } from 'react';
import { PluginPageContext, Asset } from '@burner-wallet/types';
import DenverMiscPlugin from '../DenverMiscPlugin';

const HASH_REGEX = /^#0x[0-9a-f]{64}$/i;

const moveAll = async (assets: Asset[], sender: string, recipient: string) => {
  const _assets = Array.from(assets).sort((asset: Asset) => asset.type === 'native' ? 1 : -1);
  for (const asset of _assets) {
    const balance = await asset.getMaximumSendableBalance(sender, recipient);
    if (balance !== '0') {
      await asset.send({
        to: recipient,
        from: sender,
        value: balance,
      });
    }
  }
};


const SweepPage: React.FC<PluginPageContext> = ({ plugin, defaultAccount, BurnerComponents, assets, actions }) => {
  const _plugin = plugin as DenverMiscPlugin;
  const [status, setStatus] = useState('Claiming');

  const sweep = async (pk: string) => {
    console.log('sweeping to', pk);
    await actions.callSigner('enable', 'temp', pk);
    const tempAddress = await actions.callSigner('getAddress', 'temp');
    await moveAll(assets, tempAddress, defaultAccount);
    await actions.callSigner('disable', 'temp');
  };

  useEffect(() => {
    if (!HASH_REGEX.test(window.location.hash)) {
      setStatus('Invalid Key')
      return;
    }

    sweep(window.location.hash.substr(1)).then(() => setStatus('Susccessfully claimed tokens!'));
  }, [window.location.hash]);

  return (
    <BurnerComponents.Page title="Claim funds">
      {status}
    </BurnerComponents.Page>
  )
}

export default SweepPage;
