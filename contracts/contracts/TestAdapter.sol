pragma solidity ^0.5.0;

import './Faucet.sol';

contract VendingMachine {
  function distribute(address[] calldata recipients, uint256[] calldata values) external;
}

contract TestAdapter {
  Faucet public faucet;
  VendingMachine public vendingMachine;

  uint256 faucetRate = 100000000000000;

  constructor(Faucet _faucet, VendingMachine _machine) public {
    faucet = _faucet;
    vendingMachine = _machine;
  }

  function toggleFaucet(address user, bool isOn) external {
    uint256 rate = 0;
    if (isOn) {
      rate = faucetRate;
    }
    address[] memory _user = new address[](1);
    _user[0] = user;
    faucet.setRate(rate, _user);
  }

  function setFaucetRate(uint256 newRate) external {
    faucetRate = newRate;
  }

  function mintBuffidai(uint256 amount) external {
    uint[] memory _amount = new uint[](1);
    _amount[0] = amount;

    address[] memory _sender = new address[](1);
    _sender[0] = msg.sender;

    vendingMachine.distribute(_sender, _amount);
  }
}
