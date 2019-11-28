import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth, ERC777Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, } from '@burner-wallet/core/gateways';
import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';
// import LegacyPlugin from '@burner-wallet/legacy-plugin';
import CarbonPlugin from 'carbon-burner-wallet-plugin';
import LinkdropPlugin from 'linkdrop-plugin';
import SchedulePlugin from '@burner-factory/schedule-plugin';
import StockMarketMenuPlugin from '@burner-factory/stock-market-menu-plugin';

const waterloo = new ERC777Asset({
  id: 'waterloo',
  name: 'Waterloonies',
  address: '0x35fB13688F44DfcF3AE8aC508bBFCeab420762e0',
  network: '100',
});

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [waterloo, xdai, dai, eth],
  // @ts-ignore
  gsnGasPrice: 4100000000,
});

const exchange = new Exchange({
  pairs: [new XDaiBridge(), new Uniswap('dai')],
});

const BurnerWallet = () =>
  <ModernUI
    title="ETHDenver"
    core={core}
    plugins={[
      new StockMarketMenuPlugin('0x04a726C7a94dc374fF088537C9434bD7E9f06F6b', 'waterloo', '100', false),
      exchange,
      new SchedulePlugin(),
      new CarbonPlugin(process.env.REACT_APP_CARBON_API_KEY!, 'production'),
      new LinkdropPlugin(),
    ]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
