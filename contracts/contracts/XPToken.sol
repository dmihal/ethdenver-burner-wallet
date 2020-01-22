pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/GSN/Context.sol';
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './StringUtils.sol';

contract XPToken is Context, Ownable, ERC721Full {
  using ECDSA for bytes32;

  struct Token {
    uint256 clonedFrom;
    address claimer;
    uint16 maxClones;
    uint16 numClones;
    uint256 points;
  }

  Token[] public tokens;
  string public uriPrefix;

  mapping(address => mapping(uint256 => uint256)) private clonedTokenByAddress;
  mapping(address => uint256) public xpBalance;

  constructor(string memory name, string memory symbol, string memory _uriPrefix) public ERC721Full(name, symbol) {
    uriPrefix = _uriPrefix;

    // If the array is new, skip over the first index.
    Token memory _dummyToken;
    tokens.push(_dummyToken);
  }

  function tokenURI(uint256 tokenId) external view returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return string(abi.encodePacked(
      uriPrefix,
      "0x",
      StringUtils.toAsciiString(address(this)),
      "/",
      StringUtils.uint2str(tokenId)
    ));
  }

  /// @dev mint(): Mint a new Gen0 Tokens.  These are the tokens that other Tokens will be "cloned from".
  /// @param _to Address to mint to.
  /// @param numClonesAllowed Maximum number of times this Tokens is allowed to be cloned.
  /// @return the tokenId of the Tokens that has been minted.  Note that in a transaction only the tx_hash is returned.
  function mint(address _to, uint256 numClonesAllowed, uint256 points) public onlyOwner returns (uint256 tokenId) {

    Token memory _token;
    _token.numClonesAllowed = numClonesAllowed;
    // The new token is pushed onto the array and minted
    // Note that Solidity uses 0 as a default value when an item is not found in a mapping.

    tokenId = tokens.push(_token) - 1;
    tokens[tokenId].clonedFromId = tokenId;

    _mint(_to, tokenId);
    xpBalance[_to] = xpBalance[_to].add(points);
  }

  /// @dev clone(): Clone a new Tokens from a Gen0 Tokens.
  /// @param _to The address to clone to.
  /// @param _tokenId The token id of the Tokens to clone and transfer.
  function clone(address _to, uint256 _tokenId, bytes signature) public {
    require(clonedTokenByAddress[_to][_tokenId] == 0);

    uint256 newTokenId = _clone(_to, _tokenId);
    clonedTokenByAddress[_to][_tokenId] = newTokenId;
  }

  function _clone() private returns (uint256 newTokenId) {
    require(clonedTokenByAddress[_to][_tokenId] == 0);
    // Grab existing Token blueprint
    Token memory _token = tokens[_tokenId];
    require(
      _token.numClones < _token.numClonesAllowed,
      "The number of Tokens clones requested exceeds the number of clones allowed.");

    // Update original token struct in the array
    _token.numClones += 1;

    tokens[_tokenId].numClones = tokens[_tokenId].numClones.add(1);

    Token memory _newToken;
    _newToken.clonedFromId = _tokenId;
    _newToken.points = _token.points;

    // Note that Solidity uses 0 as a default value when an item is not found in a mapping.
    newTokenId = tokens.push(_newToken) - 1;

    _mint(_to, newTokenId);
  }

  function getClonedTokenByAddress(address user, uint256 baseToken) public view returns (uint256) {
    return clonedTokenByAddress[user][baseToken];
  }


  /// @dev burn(): Burn Tokens token.
  /// @param _owner The owner address of the token to burn.
  /// @param _tokenId The Tokens ID to be burned.
  function burn(address _owner, uint256 _tokenId) public onlyOwner {
    Token memory _token = tokens[_tokenId];
    uint256 gen0Id = _token.clonedFromId;
    if (_tokenId != gen0Id) {
      Token memory _gen0Token = tokens[gen0Id];
      _gen0Token.numClonesInWild -= 1;
      tokens[gen0Id] = _gen0Token;
    }
    delete tokens[_tokenId];
    _burn(_owner, _tokenId);
  }

  /// @dev getTokensById(): Return a Tokens struct/array given a Tokens Id. 
  /// @param _tokenId The Tokens Id.
  /// @return the Tokens struct, in array form.
  function getTokensById(uint256 _tokenId) view public returns
    (uint256 numClonesAllowed, uint256 numClonesInWild, uint256 clonedFromId)
  {
    Token memory _token = tokens[_tokenId];

    numClonesAllowed = _token.numClonesAllowed;
    numClonesInWild = _token.numClones;
    clonedFromId = _token.clonedFromId;
  }

  /// @dev getNumClonesInWild(): Return a Tokens struct/array given a Tokens Id. 
  /// @param _tokenId The Tokens Id.
  /// @return the number of cloes in the wild
  function getNumClones(uint256 _tokenId) view public returns (uint256)
  {   
    return tokens[_tokenId].numClones;
  }

  /// @dev getLatestId(): Returns the newest Tokens Id in the tokens array.
  /// @return the latest tokens id.
  function getLatestId() view public returns (uint256 tokenId)
  {
    if (tokens.length == 0) {
      tokenId = 0;
    } else {
      tokenId = tokens.length - 1;
    }
  }
}
