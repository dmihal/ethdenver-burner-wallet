import { Gateway } from '@burner-wallet/core/gateways';
import Web3 from 'web3';

export default class WhiteblockGateway extends Gateway {
  private provider: any = null;
  private stopping = false;

  isAvailable() {
    return true;
  }

  getNetworks() {
    return ['100'];
  }

  _provider() {
    if (!this.provider) {
      this._makeProvider();
    }
    return this.provider;
  }

  _makeProvider() {
    this.provider = new Web3.providers.WebsocketProvider('wss://xdai.whiteblock.io/ws/');
    this.provider.on('end', (e: any) => {
      if (!this.stopping) {
        console.log('WS closed. Attempting to reconnect...');
        this._makeProvider();
      }
    });
  }

  send(network: string, { jsonrpc, id, method, params }: any) {
    return new Promise((resolve, reject) => {
      if (network !== '100') {
        return reject(new Error('Infura does not support this network'));
      }
      this._provider().send({ jsonrpc, id, method, params }, (err: any, response: any) => {
        if (err || response.error) {
          reject(err || response.error);
        } else {
          resolve(response.result);
        }
      })
    });
  }

  stop() {
    this.stopping = true;
    this.provider.disconnect();
  }
}
