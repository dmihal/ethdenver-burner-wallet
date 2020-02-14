import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import DenverUI from 'denver-ui';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import SponsorPlugin from 'sponsor-plugin';
import { XPToken } from 'denver-assets';
import { xp_faucet_address } from 'denver-config';
import AccountCacheSigner from 'account-cache-signer';

const xp = new XPToken({
  id: 'xp',
  name: 'XP',
  network: '100',
  address: xp_faucet_address,
});

const core = new BurnerCore({
  // @ts-ignore
  signers: [
    new AccountCacheSigner(10),
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new InjectedSigner(),
    new LocalSigner(),
  ],
  gateways: [
    new GSNGateway(),
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [xp],
});

const BurnerWallet = () =>
  <DenverUI
    title="ETHDenver Sponsor"
    // @ts-ignore
    core={core}
    plugins={[
      new SponsorPlugin(),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new ContractWalletPlugin(),
      new BurnerConnectPlugin('ETHDenver sponsor wallet'),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
