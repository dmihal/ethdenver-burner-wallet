import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, XDaiGateway, GSNGateway } from '@burner-wallet/core/gateways';
import ContractWalletSigner from '@burner-factory/contract-wallet-signer';
import FortmaticSigner from 'fortmatic-signer';
import { BurnerConnectBridge } from '@burner-wallet/burner-connect-wallet';
import AccountCacheSigner from 'account-cache-signer';

const core = new BurnerCore({
  signers: [
    new AccountCacheSigner(10),
    new ContractWalletSigner(process.env.REACT_APP_WALLET_FACTORY_ADDRESS!),
    new FortmaticSigner(process.env.REACT_APP_FORTMATIC_KEY!),
    new LocalSigner(),
  ],
  gateways: [
    new GSNGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY!),
    new XDaiGateway(),
  ],
  assets: [],
});

// @ts-ignore
export default new BurnerConnectBridge(core);
