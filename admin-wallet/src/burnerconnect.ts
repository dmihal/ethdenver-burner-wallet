import { ERC777Asset, NativeAsset, ERC20Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import FortmaticSigner from 'fortmatic-signer';
import { BurnerConnectBridge } from '@burner-wallet/burner-connect-wallet';

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
  signers: [
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new LocalSigner(),
  ],
  gateways: [
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY!),
    new XDaiGateway(),
  ],
  assets: [buff, xp, keth, kdai],
});

// @ts-ignore
export default new BurnerConnectBridge(core);
