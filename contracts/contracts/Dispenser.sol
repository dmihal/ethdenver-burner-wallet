pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/GSN/Context.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "openzeppelin-solidity/contracts/introspection/IERC1820Registry.sol";
import "openzeppelin-solidity/contracts/token/ERC777/IERC777Recipient.sol";
import './Admins.sol';
import './IMintableToken.sol';
import './IWhitelist.sol';
import './FreeGas.sol';


contract Dispenser is FreeGas, Admins, IERC777Recipient {
  using ECDSA for bytes32;

  struct Code {
    uint256 value;
    bool enabled;
    uint16 limit;
    string message;
    mapping(address => bool) claimed;
  }
  IMintableToken public token;

  mapping(address => Code) private codes;

  event Claim(address indexed claimer, address indexed code, uint256 value);
  event CodeCreated(address signer, uint256 value, string message);

  constructor(IWhitelist admins) public Admins(admins) {
    IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
      .setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
  }

  function setToken(IMintableToken _token) external onlyAdmins {
    token = _token;
  }

  function claim(bytes calldata signature) external {
    address sender = _msgSender();
    address signer = keccak256(abi.encodePacked(sender)).toEthSignedMessageHash().recover(signature);

    require(codes[signer].enabled, "Not an active code");
    require(!codes[signer].claimed[sender], "Already claimed");
    require(codes[signer].limit == 0 || codes[signer].limit > 1, "Limit reached");

    codes[signer].claimed[sender] = true;
    token.mint(address(this), codes[signer].value, new bytes(0));
    token.send(sender, codes[signer].value, bytes(codes[signer].message));
  }

  function getCode(address signer) external view returns (uint256 value, bool enabled, string memory message, uint16 limit) {
    value = codes[signer].value;
    enabled = codes[signer].enabled;
    message = codes[signer].message;
    limit = codes[signer].limit;
  }

  function canClaim(address signer, address user) external view returns (bool) {
    return !codes[signer].claimed[user];
  }

  function createCode(uint256 value, address signer, string calldata message, uint16 limit) external onlyAdmins {
    codes[signer].value = value;
    codes[signer].enabled = true;
    codes[signer].message = message;
    if (limit > 0) {
      codes[signer].limit = limit + 1;
    }
    emit CodeCreated(signer, value, message);
  }

  function setEnabled(address signer, bool isEnabled) external onlyAdmins {
    codes[signer].enabled = isEnabled;
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
