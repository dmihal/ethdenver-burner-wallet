import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import { buffidai_address } from 'denver-config';
import VendorPlugin from '@burner-factory/vendor-plugin';
import schedule from './waterloo.json';
import ThreeBoxEditProfilePlugin from '3box-edit-profile-plugin';
import LeaderboardPlugin from 'leaderboard';
import CashoutPlugin from 'cashout-plugin';
import DenverMiscPlugin from 'denver-misc-plugin';

import { menu_id } from 'denver-config';

const buff = new ERC777Asset({
  id: 'buff',
  name: 'BuffiDai',
  address: buffidai_address,
  network: '100',
  icon: 'https://buffidai.io/static/media/bufficorn.e2983bb0.png',
  usdPrice: 1,
});

const core = new BurnerCore({
  // @ts-ignore
  signers: [
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new InjectedSigner(),
    new LocalSigner(),
  ],
  gateways: [
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [buff],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHDenver Vendor"
    // @ts-ignore
    core={core}
    plugins={[
      new DenverMiscPlugin({
        dispenserAddress: '0x6Db43Ea17004b5efBc85A3708bDb0E8bAee9C89B', //TODO
        dispenserNetwork: '100',
      }),
      new CashoutPlugin('0xdb3e7b2fcc7568d4cffb9604520ccd154da56f3e'),
      new VendorPlugin(menu_id),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new ContractWalletPlugin(),
      new BurnerConnectPlugin('ETHDenver Vendor'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
