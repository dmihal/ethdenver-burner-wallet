var Dispenser = artifacts.require("Dispenser");
var XPToken = artifacts.require("XPToken");
var Whitelist = artifacts.require("Whitelist");

const { toWei } = web3.utils;

contract("xp", ([creator, user]) => {
  it("should assert true", async () => {
    const dispenser = await Dispenser.deployed();
    const token = await XPToken.deployed();
    await token.setDenomination(toWei('25', 'ether'), true);

    const [senderlist, receiverlist, minterlist] = await Promise.all([
      token.senderList().then(address => Whitelist.at(address)),
      token.receiverList().then(address => Whitelist.at(address)),
      token.minterList().then(address => Whitelist.at(address)),
    ]);

    receiverlist.setWhitelisted(true, [user]);

    const account = web3.eth.accounts.create();

    await dispenser.createCode(toWei('25', 'ether'), account.address, 'Test', { from: creator });
    const code = await dispenser.getCode(account.address);
    assert.equal(code.value, toWei('25', 'ether'));
    assert.equal(code.enabled, true);
    assert.equal(code.message, 'Test');

    assert.isTrue(await dispenser.canClaim(account.address, user));

    const hash = web3.utils.soliditySha3({ type: 'address', value: user });
    const { signature } = account.sign(hash);
    const receipt = await dispenser.claim(signature, { from: user });
    
    assert.equal(await token.balanceOf(user), toWei('25', 'ether'));
  });
});
