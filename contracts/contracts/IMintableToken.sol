pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC777/IERC777.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract IMintableToken is IERC777, IERC20 {
  function mint(address account, uint256 amount, bytes calldata data) external;

  function canSend(
    address from,
    address to,
    uint256 amount
  ) external view returns (bool, string memory);

}
