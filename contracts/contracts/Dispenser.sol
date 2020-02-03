pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/GSN/Context.sol";
import "openzeppelin-solidity/contracts/introspection/IERC1820Registry.sol";
import "openzeppelin-solidity/contracts/token/ERC777/IERC777Recipient.sol";
import './Admins.sol';
import './IMintableToken.sol';
import './IWhitelist.sol';
import './FreeGas.sol';

contract Dispenser is FreeGas, Admins, IERC777Recipient {
  struct Code {
    uint256 value;
    bool enabled;
    string message;
    mapping(address => bool) claimed;
  }

  uint256 public nextId;

  IMintableToken public token;

  mapping(uint256 => Code) private codes;

  event Claim(address indexed claimer, uint256 indexed code, uint256 value);

  constructor(IWhitelist admins) public Admins(admins) {
    IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
      .setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
  }

  function setToken(IMintableToken _token) external onlyAdmins {
    token = _token;
  }

  function claim(uint256 codeId) external {
    address sender = _msgSender();
    require(codes[codeId].enabled, "Not an active code");
    require(!codes[codeId].claimed[sender], "Already claimed");

    codes[codeId].claimed[sender] = true;
    token.mint(address(this), codes[codeId].value, new bytes(0));
    token.send(sender, codes[codeId].value, bytes(codes[codeId].message));
  }

  function createCode(uint256 value, string calldata message) external onlyAdmins {
    codes[nextId].value = value;
    codes[nextId].enabled = true;
    codes[nextId].message = message;

    nextId = nextId + 1;
  }

  function setEnabled(uint256 id, bool isEnabled) external onlyAdmins {
    codes[id].enabled = isEnabled;
  }

  function tokensReceived(
    address /* operator */,
    address /* from */,
    address /* to */,
    uint256 /* amount */,
    bytes calldata /* userData */,
    bytes calldata /* operatorData */
  ) external {}
}
