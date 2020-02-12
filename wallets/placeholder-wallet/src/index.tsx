import React from 'react';
import ReactDOM from 'react-dom';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import PlaceholderUI from 'placeholder-ui';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import AccountCacheSigner from 'account-cache-signer';
import DenverMiscPlugin from 'denver-misc-plugin';


const core = new BurnerCore({
  // @ts-ignore
  signers: [
    new AccountCacheSigner(10),
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new LocalSigner(),
  ],
  gateways: [
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [],
});

const BurnerWallet = () =>
  <PlaceholderUI
    title="ETHDenver"
    // @ts-ignore
    core={core}
    plugins={[
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new ContractWalletPlugin(),
      new BurnerConnectPlugin('ETHDenver test wallet'),
      new DenverMiscPlugin({
        dispenserAddress: '0x6Db43Ea17004b5efBc85A3708bDb0E8bAee9C89B',
        dispenserNetwork: '42',
      }),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
