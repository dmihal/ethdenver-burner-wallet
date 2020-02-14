import React, { useState, Fragment } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import Accounts from 'web3-eth-accounts';
import AdminPlugin from '../AdminPlugin';

// @ts-ignore
const accounts = new Accounts();

const SpotsPage: React.FC<PluginPageContext> = ({ defaultAccount, plugin, BurnerComponents, actions }) => {
  const _plugin = plugin as AdminPlugin;
  const [status, setStatus] = useState('editing');
  const [xp, setXp] = useState('0');
  const [msg, setMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [locked, setLocked] = useState(false);
  const [account, setAccount] = useState<any>(accounts.create());

  const url = `https://buffidao.com/spot/${account.privateKey}`;

  const create = async () => {
    setCreating(true);
    actions.setLoading('Creating spot...');

    await _plugin.createSpot(account.address, xp, msg, defaultAccount);

    actions.setLoading(null);
    setCreating(false);
    setStatus('created');
  };

  const reset = () => setAccount(accounts.create());

  const { Page, QRCode } = BurnerComponents;
  return (
    <Page title="Spots">
      <div>
        XP: <input type="number" value={xp} min="0" onChange={(e: any) => setXp(e.target.value)} disabled={status !== 'editing'} />
      </div>
      <div>
        Title: {}
        <input value={msg} onChange={(e: any) => setMsg(e.target.value)} disabled={status !== 'editing'} />
      </div>
      <button
        onClick={() => setStatus(status === 'editing' ? 'locked' : 'editing')}
        disabled={status !== 'editing' && status !== 'locked'}
      >
        {status === 'editing' ? 'Generate' : 'Edit'}
      </button>

      {status !== 'editing' && (
        <Fragment>
          <QRCode value={url} />
          <div>{url}</div>
          <button onClick={status === 'created' ? reset : create}>
            {status === 'created' ? 'New Spot' : 'Create'}
          </button>
        </Fragment>
      )}
    </Page>
  );
}

export default SpotsPage;