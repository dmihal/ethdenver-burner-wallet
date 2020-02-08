import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ENSPlugin from '@burner-wallet/ens-plugin';
import DenverUI from 'denver-ui';
import BurnableENSPlugin from '@burner-factory/burnable-ens-plugin';
import PushNotificationPlugin from '@burner-factory/push-notification-plugin';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import { BurnerConnectPlugin } from '@burner-wallet/burner-connect-wallet';
import 'worker-loader?name=burnerprovider.js!./burnerconnect'; // eslint-disable-line import/no-webpack-loader-syntax

import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import SponsorPlugin from 'sponsor-plugin';
import schedule from './waterloo.json';
import TestHelpersPlugin from 'test-helpers-plugin';
import { XPToken } from 'denver-assets';
import { faucet_test_address, xp_test_network } from 'denver-config';
import AccountCacheSigner from 'account-cache-signer';

const xp = new XPToken({
  id: 'xp',
  name: 'XP',
  network: xp_test_network,
  address: faucet_test_address,
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
    title="ETHDenver - test sponsor"
    // @ts-ignore
    core={core}
    plugins={[
      new SponsorPlugin(),
      new ENSPlugin('5'),
      new PushNotificationPlugin(process.env.REACT_APP_VAPID_KEY!, process.env.REACT_APP_WALLET_ID!),
      new FortmaticPlugin(),
      new SchedulePlugin(schedule),
      new ContractWalletPlugin(),
      new TestHelpersPlugin(process.env.REACT_APP_TEST_ADAPTER!),
      new BurnerConnectPlugin('ETHDenver test sponsor wallet'),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
