import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ENSPlugin from '@burner-wallet/ens-plugin';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import AdminPlugin from 'admin-plugin';
import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import TestHelpersPlugin from 'test-helpers-plugin';
import { faucet_test_address, xp_test_network } from 'denver-config';
import { XPToken } from 'denver-assets';


const testbuff = new ERC777Asset({
  id: 'testbuff',
  name: 'Test BuffiDai',
  network: '42',
  address: '0x78D7ac51Ea53aF5E98EDe66DF28Ccb2f9BE59CE1',
  icon: 'https://buffidai.io/static/media/bufficorn.e2983bb0.png',
});

const testxp = new XPToken({
  id: 'testxp',
  name: 'Test XP',
  network: xp_test_network,
  address: faucet_test_address,
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
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [testbuff, testxp],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHDenver Admin"
    // @ts-ignore
    core={core}
    plugins={[
      new AdminPlugin({
        contractWalletFactory: process.env.REACT_APP_WALLET_FACTORY_ADDRESS!,
      }),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new ContractWalletPlugin(),
      new TestHelpersPlugin(process.env.REACT_APP_TEST_ADAPTER!),
      new BurnerConnectPlugin('ETHDenver admin wallet'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
