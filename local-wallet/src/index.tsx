import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { HTTPGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import BurnableENSSubdomainPlugin from 'burnable-ens-subdomain-plugin';
import FortmaticPlugin from 'fortmatic-plugin';
import ThreeBoxEditProfilePlugin from '3box-edit-profile-plugin';

const core = new BurnerCore({
  signers: [
    new InjectedSigner(),
    new LocalSigner({ privateKey: process.env.REACT_APP_PK, saveKey: false }),
  ],
  gateways: [
    new HTTPGateway('http://localhost:8545', '5777'),
  ],
  assets: [
    new ERC20Asset({
      id: 'localerc20',
      name: 'Local Token',
      network: '5777',
      // @ts-ignore
      address: process.env.REACT_APP_ERC20_ADDRESS,
    }),
    new NativeAsset({
      id: 'geth',
      name: 'Ganache ETH',
      network: '5777',
    }),
  ],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHDenver"
    core={core}
    plugins={[
      new BurnableENSSubdomainPlugin('myburner.eth'),
      new FortmaticPlugin(),
      new ThreeBoxEditProfilePlugin(),
    ]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
