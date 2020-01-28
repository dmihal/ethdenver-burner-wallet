const Faucet = artifacts.require('Faucet');
const Whitelist = artifacts.require('Whitelist');
const XPToken = artifacts.require('XPToken');
const { singletons } = require('@openzeppelin/test-helpers');

module.exports = function(_deployer, network, [account]) {
  _deployer.then(async () => {
    await singletons.ERC1820Registry(account);

    const [sendList, receiveList, mintList, adminList] = await Promise.all(
      [Whitelist, Whitelist, Whitelist, Whitelist].map(contract => _deployer.deploy(contract)));

    const faucet = await _deployer.deploy(Faucet, adminList.address);

    const token = await _deployer.deploy(
      XPToken, 'XP', 'XP', sendList.address, receiveList.address, mintList.address, [faucet.address]);

    await mintList.setWhitelisted(true, [faucet.address]);
    await adminList.setWhitelisted(true, [account]);
    await faucet.setToken(token.address);
  });
};
