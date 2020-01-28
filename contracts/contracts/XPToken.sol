pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/GSN/Context.sol';
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './ModifiedERC777.sol';
import './IWhitelist.sol';
import './FreeGas.sol';

contract XPToken is Context, Ownable, ModifiedERC777, FreeGas {

  IWhitelist public senderList;
  IWhitelist public receiverList;
  IWhitelist public minterList;

  constructor(
    string memory name,
    string memory symbol,
    IWhitelist _senderList,
    IWhitelist _receiverList,
    IWhitelist _minterList,
    address[] memory operators
  ) public ModifiedERC777(name, symbol, operators) {
    senderList = _senderList;
    receiverList = _receiverList;
    minterList = _minterList;
  }

  function mint(address recipient, uint256 amount, bytes calldata data) external {
    address sender = _msgSender();
    require(minterList.isWhitelisted(sender), "Minter is not whitelisted");

    _mint(sender, recipient, amount, new bytes(0), data);
  }

  function _move(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes memory userData,
    bytes memory operatorData
  )
    internal
  {
    require(senderList.isWhitelisted(from), "Sender is not whitelisted");
    require(receiverList.isWhitelisted(to), "Receiver is not whitelisted");
    ModifiedERC777._move(operator, from, to, amount, userData, operatorData);
  }

  function _postTransfer(address, address from, address to, uint256, bytes memory, bytes memory) internal {
  }
}
