pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/GSN/Context.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './IWhitelist.sol';

contract Whitelist is Context, Ownable, IWhitelist {
  mapping(address => bool) private _isWhitelisted;

  event WhitelistChanged(address indexed user, bool isWhitelisted);

  function isWhitelisted(address user) external view returns (bool) {
    return _isWhitelisted[user];
  }

  function setWhitelisted(bool whitelisted, address[] calldata users) external onlyOwner {
    for(uint i = 0; i < users.length; i++) {
      _isWhitelisted[users[i]] = whitelisted;
      emit WhitelistChanged(users[i], whitelisted);
    }
  }
}
