import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PluginPageContext } from '@burner-wallet/types';
import AdminPlugin from '../AdminPlugin';
import Faucet from './Faucet';

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
  const [faucets, setFaucets] = useState<any[]>([]);
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

  const refreshFaucets = async () => {
    setLoading(true);
    const _faucets = await _plugin.getFaucets();
    setFaucets(_faucets);
    setLoading(false);
  };

  useEffect(() => {
    refreshFaucets();
    const gsnWatcher = setInterval(refreshGSNBalances, 10000);

    () => {
      clearInterval(gsnWatcher);
    }
  }, []);

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Admin">
      <Link to="/admin/spots">Spots</Link>

      <h2>User inspector</h2>
      <input value={address} onChange={(e: any) => setAddress(e.target.value)} />
      <Button onClick={() => actions.navigateTo(`/admin/user/${address}`)} disabled={address.length !== 42}>Go</Button>

      <h2>Faucets</h2>
      {faucets.map(({ name, network, address, cap, denominations }) => (
        <Faucet
          key={name}
          name={name}
          cap={cap}
          address={address}
          denominations={denominations}
          network={network}
          plugin={_plugin}
          sender={defaultAccount}
          refresh={refreshFaucets}
        />
      ))}

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