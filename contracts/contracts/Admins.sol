pragma solidity ^0.5.0;

import './IWhitelist.sol';

contract Admins {
  IWhitelist public admins;

  constructor(IWhitelist _admins) internal {
    admins = _admins;
  }

  modifier onlyAdmins {
    require(admins.isWhitelisted(msg.sender));
    _;
  }

  function _setAdminList(IWhitelist newAdmins) internal {
    admins = newAdmins;
  }
}