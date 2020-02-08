const { ERC777Asset } = require('@burner-wallet/assets');

const DISTRIBUTE_TOPIC = '0x77eb406d2a36b9cc3c9d570e9bfa855e5a47830463d08e8f5c875bae79867ef0';

class XPToken extends ERC777Asset {
  async getTx(txHash) {
    const web3 = this.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    const [log] = receipt.logs.filter(log => log.topics[0] === DISTRIBUTE_TOPIC);
    if (!log) {
      return null;
    }

    const decoded = web3.eth.abi.decodeParameters(['uint256','bytes'], log.data);
    const msg = web3.utils.toUtf8(decoded[1]);

    return {
      asset: this.id,
      assetName: this.name,
      from: web3.utils.toChecksumAddress(log.topics[1].substr(26)),
      to: web3.utils.toChecksumAddress(log.topics[2].substr(26)),
      value: decoded[0],
      displayValue: this.getDisplayValue(decoded[0]),
      message: msg.length > 0 ? msg : null,
      timestamp: await this._getBlockTimestamp(receipt.blockNumber),
    };
  }
}

module.exports = XPToken;
