import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { HTTPGateway } from '@burner-wallet/core/gateways';
import DenverUI from 'denver-ui';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import ContractWalletPlugin from '@burner-factory/contract-wallet-plugin';
import FortmaticPlugin from 'fortmatic-plugin';
import FortmaticSigner from 'fortmatic-signer';
import ThreeBoxEditProfilePlugin from '3box-edit-profile-plugin';
import LeaderboardPlugin from 'leaderboard';

const core = new BurnerCore({
  signers: [
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new InjectedSigner(),
    new LocalSigner({ privateKey: process.env.REACT_APP_PK, saveKey: false }),
  ],
  gateways: [
    new HTTPGateway('http://localhost:8545', '5777'),
  ],
  assets: [
    new ERC20Asset({
      id: 'buffidai',
      name: 'BuffiDai',
      network: '5777',
      address: process.env.REACT_APP_ERC20_ADDRESS!,
    }),
    new ERC777Asset({
      id: 'xp',
      name: 'XP',
      network: '5777',
      address: process.env.REACT_APP_XP_ADDRESS!,
    }),
    new NativeAsset({
      id: 'geth',
      name: 'Ganache ETH',
      network: '5777',
    }),
  ],
});

const BurnerWallet = () =>
  <DenverUI
    title="ETHDenver"
    // @ts-ignore
    core={core}
    plugins={[
      new FortmaticPlugin(),
      new ThreeBoxEditProfilePlugin(),
      new LeaderboardPlugin(),
      new ContractWalletPlugin(),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
