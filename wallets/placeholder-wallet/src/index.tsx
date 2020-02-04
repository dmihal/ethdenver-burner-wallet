import React from 'react';
import ReactDOM from 'react-dom';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ENSPlugin from '@burner-wallet/ens-plugin';
import PlaceholderUI from 'placeholder-ui';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';


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
    new InjectedGateway(),
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
      new BurnableENSPlugin({
        domain: 'myburner.test',
        tokenAddress: '0xc03bbef8b85a19ABEace435431faED98c31852d9',
        network: '5',
      }),
      new ENSPlugin('5'),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new ContractWalletPlugin(),
      new BurnerConnectPlugin('ETHDenver test wallet'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
