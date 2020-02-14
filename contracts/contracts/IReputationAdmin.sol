pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract IReputationAdmin is Ownable {
  function reputationMint(address[] calldata _beneficiaries, uint256[] calldata _amounts) external;
  function reputationBurn(address[] calldata _beneficiaries, uint256[] calldata _amounts) external;
}
