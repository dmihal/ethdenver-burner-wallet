import React, { useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import AdminPlugin from '../AdminPlugin';

const walletNetworks = ['1', '4', '5', '42', '100'];
const CHAINS: { [id: string]: string } = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '5': 'goerli',
  '42': 'kovan',
  '100': 'xdai',
};

const AdminPage: React.FC<PluginPageContext> = ({ BurnerComponents, plugin, defaultAccount, actions }) => {
  const _plugin = plugin as AdminPlugin;
  const [currentCap, setCurrentCap] = useState('0');
  const [newCap, setNewCap] = useState('0');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [gsnBalances, setGSNBalances] = useState<{ [network: string]: string }>({});

  const refreshGSNBalances = () => walletNetworks.forEach(async (network: string) => {
    const balance = await _plugin.getGSNBalance(_plugin.contractWalletFactory, network);
    if (gsnBalances[network] !== balance) {
      gsnBalances[network] = balance;
      setGSNBalances({ ...gsnBalances });
    }
  });

  const refreshCaps = async () => {
    setLoading(true);
    const caps = await _plugin.getFaucetCaps();
    setNewCap(caps[0].cap);
    setCurrentCap(caps[0].cap);
    setLoading(false);
  };

  useEffect(() => {
    refreshCaps();
    const gsnWatcher = setInterval(refreshGSNBalances, 10000);

    () => {
      clearInterval(gsnWatcher);
    }
  }, []);

  const setCap = async () => {
    setLoading(true);
    // await _plugin.setFaucetCap(newCap, defaultAccount);
    await refreshCaps();
    setLoading(false);
  };

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Admin">
      <h2>User inspector</h2>
      <input value={address} onChange={(e: any) => setAddress(e.target.value)} />
      <Button onClick={() => actions.navigateTo(`/admin/user/${address}`)} disabled={address.length !== 42}>Go</Button>

      <h2>Faucets</h2>
      <div>
        Cap:
        <input
          type="number"
          disabled={loading}
          value={newCap}
          onChange={(e: any) => setNewCap(e.target.value)}
          min="0"
        />
        <Button disabled={loading || newCap === currentCap} onClick={setCap}>Set</Button>
      </div>

      <h2>Contract Wallet GSN</h2>
      <div>
        {Object.entries(gsnBalances).map(([network, balance]) => (
          <div key={network}>{CHAINS[network]}: {balance}</div>
        ))}
      </div>
    </Page>
  );
};

export default AdminPage;