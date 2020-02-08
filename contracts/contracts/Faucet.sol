pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/GSN/Context.sol";
import "openzeppelin-solidity/contracts/token/ERC777/IERC777.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import './Admins.sol';
import './IMintableToken.sol';
import './IWhitelist.sol';
import './FreeGas.sol';

contract Faucet is Context, IERC777, IERC20, Admins, FreeGas {
  IMintableToken public token;

  event RateChange(address indexed user, uint256 rate);

  mapping(address => uint256) public lastTransaction;
  mapping(address => uint256) public rate;
  uint256 public cap;

  constructor(IWhitelist admins) public Admins(admins) {}

  function setCap(uint256 _cap) external onlyAdmins {
    cap = _cap;
  }

  function setToken(IMintableToken _token) external onlyAdmins {
    token = _token;
  }

  function setRate(uint256 _rate, address[] calldata users) external onlyAdmins {
    for(uint i = 0; i < users.length; i++) {
      _mint(users[i]);
      rate[users[i]] = _rate;
      lastTransaction[users[i]] = now;
      emit RateChange(users[i], _rate);
    }
  }

  function setAdminList(IWhitelist newAdmins) external onlyAdmins {
    _setAdminList(newAdmins);
  }

  function transfer(address recipient, uint256 amount) external returns (bool) {
    address sender = _msgSender();
    _mint(sender);

    lastTransaction[sender] = now;
    token.operatorSend(sender, recipient, amount, new bytes(0), new bytes(0));
    return true;
  }

  function send(address recipient, uint256 amount, bytes calldata data) external {
    address sender = _msgSender();
    _mint(sender);

    lastTransaction[sender] = now;
    token.operatorSend(sender, recipient, amount, data, new bytes(0));
  }

  function _mint(address user) private {
    if(rate[user] == 0) {
      return;
    }

    uint256 currentBalance = token.balanceOf(user);
    if (cap > 0 && currentBalance > cap) {
      return;
    }

    uint256 time = now - lastTransaction[user];
    uint256 newTokens = time * rate[user];

    if (newTokens + currentBalance > cap) {
      newTokens = cap - currentBalance;
    }

    if (newTokens > 0) {
      token.mint(user, newTokens, new bytes(0));
    }
  }

  function balanceOf(address owner) external view returns (uint256) {
    uint256 currentBalance = token.balanceOf(owner);
    if (cap != 0 && currentBalance > cap) {
      return currentBalance;
    }

    uint256 adjustedBalance = currentBalance + ((now - lastTransaction[owner]) * rate[owner]);

    if (adjustedBalance > cap) {
      return cap;
    }

    return adjustedBalance;
  }

  function canSend(
    address from,
    address to,
    uint256 amount
  ) external view returns (bool, string memory) {
    return token.canSend(from, to, amount);
  }


  function name() external view returns (string memory) {
    return token.name();
  }
  function symbol() external view returns (string memory) {
    return token.symbol();
  }
  function granularity() external view returns (uint256) {
    return token.granularity();
  }
  function totalSupply() external view returns (uint256) {
    return token.totalSupply();
  }
  function allowance(address owner, address spender) external view returns (uint256) {
    return token.allowance(owner, spender);
  }
  function burn(uint256 amount, bytes calldata data) external {
    token.operatorBurn(_msgSender(), amount, data, new bytes(0));
  }
  function isOperatorFor(address operator, address tokenHolder) external view returns (bool) {
    return token.isOperatorFor(operator, tokenHolder);
  }
  function approve(address spender, uint256 amount) external returns (bool) {}
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {}
  function authorizeOperator(address operator) external {}
  function revokeOperator(address operator) external {}
  function defaultOperators() external view returns (address[] memory) {
    return token.defaultOperators();
  }
  function operatorSend(
    address sender,
    address recipient,
    uint256 amount,
    bytes calldata data,
    bytes calldata operatorData
  ) external {}
  function operatorBurn(
    address account,
    uint256 amount,
    bytes calldata data,
    bytes calldata operatorData
  ) external {}
}
