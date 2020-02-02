import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ENSPlugin from '@burner-wallet/ens-plugin';
import Exchange, { Uniswap } from '@burner-wallet/exchange';
import DenverUI from 'denver-ui';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import CollectablePlugin from '@burner-factory/collectable-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import MissionPlugin from 'mission-plugin';
import schedule from './waterloo.json';
import ThreeBoxEditProfilePlugin from '3box-edit-profile-plugin';
import TestHelpersPlugin from 'test-helpers-plugin';


const buff = new ERC777Asset({
  id: 'buff',
  name: 'BuffiDai',
  network: '42',
  address: '0x78D7ac51Ea53aF5E98EDe66DF28Ccb2f9BE59CE1',
  icon: 'https://buffidai.io/static/media/bufficorn.e2983bb0.png',
});

const xp = new ERC777Asset({
  id: 'xp',
  name: 'XP',
  network: '42',
  address: '0xda0067da015674083dcad4e4431c00c273828fe5',
});

const keth = new NativeAsset({
  id: 'keth',
  name: 'kETH',
  network: '42',
});

const kdai = new ERC20Asset({
  id: 'kdai',
  name: 'kDai',
  network: '42',
  address: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
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
  assets: [buff, xp, keth, kdai],
});

const exchange = new Exchange({
  pairs: [new Uniswap('dai')],
});

const BurnerWallet = () =>
  <DenverUI
    title="ETHDenver"
    // @ts-ignore
    core={core}
    plugins={[
      exchange,
      new BurnableENSPlugin({
        domain: 'myburner.test',
        tokenAddress: '0xc03bbef8b85a19ABEace435431faED98c31852d9',
        network: '5',
      }),
      new ENSPlugin('5'),
      new CollectablePlugin('42', '0xdc6Bc87DD19a4e6877dCEb358d77CBe76e226B8b'),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new MissionPlugin(),
      new SchedulePlugin(schedule),
      new ContractWalletPlugin(),
      new ThreeBoxEditProfilePlugin(),
      new TestHelpersPlugin(process.env.REACT_APP_TEST_ADAPTER!),
      new BurnerConnectPlugin('ETHDenver test wallet'),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
