pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/GSN/Context.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './IWhitelist.sol';

contract Whitelist is Context, Ownable, IWhitelist {
}
