pragma solidity ^0.5.0;

library StringUtils {
  function toAsciiString(address x) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
      byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
      byte hi = byte(uint8(b) / 16);
      byte lo = byte(uint8(b) - 16 * uint8(hi));
      s[2*i] = char(hi);
      s[2*i+1] = char(lo);            
    }
    return string(s);
  }

  function char(byte b) internal pure returns (byte c) {
    if (uint8(b) < 10) return byte(uint8(b) + 0x30);
    else return byte(uint8(b) + 0x57);
  }

  function uint2str(uint i) internal pure returns (string memory) {
    if (i == 0) return "0";
    uint j = i;
    uint len;
    while (j != 0){
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len - 1;
    while (i != 0){
      bstr[k--] = byte(uint8(48 + i % 10));
      i /= 10;
    }
    return string(bstr);
  }
}
