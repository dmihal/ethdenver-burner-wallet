pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/GSN/Context.sol';
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './ModifiedERC777.sol';
import './IWhitelist.sol';
import './FreeGas.sol';
import './IMintableToken.sol';

contract XPToken is Context, Ownable, ModifiedERC777, FreeGas, IMintableToken {

  IWhitelist public senderList;
  IWhitelist public receiverList;
  IWhitelist public minterList;

  mapping(uint256 => bool) private _allowedDenominations;
  uint256[] private _allowedDenominationList;

  mapping(bytes32 => bool) private sent;

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

  function getDenominations() external view returns (uint256[] memory) {
    return _allowedDenominationList;
  }

  function setDenomination(uint256 denomination, bool isAllowed) external onlyOwner {
    require(_allowedDenominations[denomination] != isAllowed);

    _allowedDenominations[denomination] = isAllowed;

    if (isAllowed) {
      _allowedDenominationList.push(denomination);
    } else {
      uint256 lastValue = _allowedDenominationList[_allowedDenominationList.length - 1];

      if (lastValue != denomination) {
        for (uint256 i = 0; i < _allowedDenominationList.length; i++) {
          if (_allowedDenominationList[i] == denomination) {
            _allowedDenominationList[i] = lastValue;
          }
        }
      }
      _allowedDenominationList.length--;
    }
  }

  function canSend(
    address from,
    address to,
    uint256 amount
  ) external view returns (bool, string memory) {
    if (!senderList.isWhitelisted(from)) {
      return (false, "Not authorized sender");
    }
    if (!receiverList.isWhitelisted(to)) {
      return (false, "Not authorized sender");
    }
    if (!_allowedDenominations[amount]) {
      return (false, "Invalid denomination");
    }
    if (!sent[hash(from, to, amount)]) {
      return (false, "Already sent");
    }

    return (true, "");
  }

  function hash(
    address from,
    address to,
    uint256 amount
  ) private pure returns (bytes32) {
    return keccak256(abi.encode(from, to, amount));
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
    require(_allowedDenominations[amount], "Invalid denomination");
    require(!sent[hash(from,to,amount)], "Already sent");

    sent[hash(from, to, amount)] = true;

    ModifiedERC777._move(operator, from, to, amount, userData, operatorData);
  }

  function _postTransfer(address, address from, address to, uint256, bytes memory, bytes memory) internal {
  }
}
