import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset, ERC20Asset, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
import AdventurePlugin from 'adventure-plugin';
import BurnableENSSubdomainPlugin from 'burnable-ens-subdomain-plugin';
import FortmaticPlugin from 'fortmatic-plugin';
import DAOPlugin from 'dao-plugin';


const buff = new ERC777Asset({
  id: 'buff',
  name: 'BuffiDai',
  network: '42',
  address: '0xc0d48A6ED1C9CD4a784A025C366b868574AA33a0',
  icon: 'https://buffidai.io/static/media/bufficorn.e2983bb0.png',
});

const rep = new ERC777Asset({
  id: 'rep',
  name: 'Rep',
  network: '42',
  address: '0xc0d48A6ED1C9CD4a784A025C366b868574AA33a0',
  icon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/emojione/211/flexed-biceps_1f4aa.png',
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
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [buff, rep, keth, kdai],
});

const exchange = new Exchange({
  pairs: [new XDaiBridge(), new Uniswap('dai')],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHWaterloo"
    core={core}
    plugins={[
      exchange,
      new BurnableENSSubdomainPlugin('myburner.eth'),
      new FortmaticPlugin(),
      new DAOPlugin(),
      new AdventurePlugin(),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
