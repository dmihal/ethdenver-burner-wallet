import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';
import DenverUI from 'denver-ui';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import LegacyPlugin from '@burner-wallet/legacy-plugin';
import UnstoppableDomainsPlugin from "@unstoppabledomains/burner-plugin-domains";
import UnstoppableResolutionPlugin from "@unstoppabledomains/burner-plugin-resolution";
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import DenverMiscPlugin from 'denver-misc-plugin';
import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import MissionPlugin from 'mission-plugin';
// import schedule from './waterloo.json';
import ThreeBoxEditProfilePlugin from '3box-edit-profile-plugin';
import TestHelpersPlugin from 'test-helpers-plugin';
import ChingPlugin from 'ching-plugin';
import buffIcon from './buff.png';
import { xp_test_address, xp_test_network } from 'denver-config';
import { XPToken } from 'denver-assets';
import AccountCacheSigner from 'account-cache-signer';
import LeaderboardPlugin from 'leaderboard';
import BuilderPlugin from 'builder-plugin';

import { buffidai_address } from 'denver-config';
import schedule from './denver.json';

const buff = new ERC777Asset({
  id: 'buff',
  name: 'BuffiDai',
  address: buffidai_address,
  network: '100',
  icon: buffIcon,
  usdPrice: 1,
});

const core = new BurnerCore({
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
  assets: [buff, xdai],
});

const BurnerWallet = () =>
  <DenverUI
    title="ETHDenver"
    core={core}
    plugins={[
      new ThreeBoxEditProfilePlugin(),
      new DenverMiscPlugin({
        dispenserAddress: '0x6Db43Ea17004b5efBc85A3708bDb0E8bAee9C89B', //TODO
        dispenserNetwork: '42',
      }),
      new SchedulePlugin(schedule),
      new BuilderPlugin(),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new MissionPlugin('https://s.buffidao.com/map'),
      new ContractWalletPlugin(),
      new BurnerConnectPlugin('BuffiDAO'),
      new ChingPlugin(),
      new LegacyPlugin(),
      new UnstoppableDomainsPlugin(),
      new UnstoppableResolutionPlugin(process.env.REACT_APP_INFURA_KEY!),
      new LeaderboardPlugin(),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
