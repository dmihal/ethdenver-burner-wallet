var Dispenser = artifacts.require("Dispenser");
var XPToken = artifacts.require("XPToken");
var Whitelist = artifacts.require("Whitelist");

const { toWei } = web3.utils;

contract("xp", ([creator, user]) => {
  it("should assert true", async () => {
    const dispenser = await Dispenser.deployed();
    const token = await XPToken.deployed();

    const [senderlist, receiverlist, minterlist] = await Promise.all([
      token.senderList().then(address => Whitelist.at(address)),
      token.receiverList().then(address => Whitelist.at(address)),
      token.minterList().then(address => Whitelist.at(address)),
    ]);

    receiverlist.setWhitelisted(true, [user]);

    const id = await dispenser.nextId();
    await dispenser.createCode(toWei('25', 'ether'), 'Test', { from: creator });
    await dispenser.claim(id, { from: user });
    
    assert.equal(await token.balanceOf(user), toWei('25', 'ether'));
  });
});
