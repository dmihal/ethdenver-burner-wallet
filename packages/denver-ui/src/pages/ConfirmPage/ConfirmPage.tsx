import React, { useState, useEffect } from 'react';
import { SendData } from '@burner-wallet/types';
import { useBurner } from '@burner-wallet/ui-core';
import { RouteComponentProps } from 'react-router-dom';
import Address from '../../components/Address';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';

const ConfirmPage: React.FC<RouteComponentProps<{}, {}, SendData>> = ({ history }) => {
  const [showLogin, setShowLogin] = useState(true);
  const { BurnerComponents, assets, actions, pluginData, t, defaultAccount } = useBurner();
  const { PluginElements, AccountBalance } = BurnerComponents;

  const [sending, _setSending] = useState(false);
  const setSending = (isSending: boolean) => {
    _setSending(isSending);
    actions.setLoading(isSending ? 'Sending...' : null);
  }

  if (!history.location.state) {
    history.replace('/send');
    return null;
  }

  const {
    to,
    from,
    ether,
    value,
    asset: assetId,
    message,
    id
  } = history.location.state;
  const [asset] = assets.filter(a => a.id === assetId);

  const amount = ether || asset.getDisplayValue(value);

  const send = async () => {
    setSending(true);
    try {
      actions.setLoading('Sending...');
      const receipt = await asset.send({ from, to, ether, value, message });

      actions.setLoading(null);
      const redirect = pluginData.sent({
        asset: assetId,
        from,
        to,
        ether: amount,
        message,
        receipt,
        hash: receipt.transactionHash,
        id,
      });

      history.push(redirect || `/receipt/${asset.id}/${receipt.transactionHash}`);
    } catch (err) {
      setSending(false);
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.resolve(actions.callSigner('isLoggedIn', 'fortmatic')).then((isLoggedIn: any) => {
      const userType = window.localStorage.getItem('userType');
      setShowLogin(!isLoggedIn && userType !== 'claim');
    });
  }, [defaultAccount]);

  // const drip = async (account: string) => {
  //   const [xdai] = assets.filter((asset: any) => asset.id === 'xdai');
  //   const balance = await xdai.getBalance(account);
  //   if (balance.length < 15) {
  //     await fetch(``)
  //   }
  // };

  // useEffect(() => {
  //   drip(defaultAccount);
  // }, [defaultAccount]);

  return (
    <Page title={t('Confirm')}>
      <PluginElements position="confirm-top" tx={history.location.state} />

      <LineItem name={t('From')}>
        <Address address={from} />
      </LineItem>
      <LineItem name={t('To')}>
        <Address address={to} />
      </LineItem>
      <LineItem name={t('Amount')} value={`${amount} ${asset.name}`} />
      <AccountBalance asset={asset} render={(data: any) => data && (
        <div style={{ fontStyle: 'italic' }}>Balance: {data.displayBalance} {asset.name}</div>
        )} />
      {message && <LineItem name={t('Note')} value={message} />}

      <PluginElements position="confirm-middle" tx={history.location.state} />

      <div style={{ display: 'flex' }}>
        <Button disabled={sending || showLogin} onClick={send}>{t('Send')}</Button>
      </div>

      {showLogin && (
        <Button onClick={() => actions.callSigner('enable', 'fortmatic')}>Connect Fortmatic</Button>
      )}

      <PluginElements position="confirm-bottom" tx={history.location.state} />
    </Page>
  );
};

export default ConfirmPage;
