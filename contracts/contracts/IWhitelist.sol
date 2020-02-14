pragma solidity ^0.5.0;

contract IWhitelist {
  function isWhitelisted(address user) external view returns (bool);
}
