// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Blog {

    mapping(bytes32 => string) private hashedContent;
    mapping(address => bytes32[]) private userContents;

    function addBlogHash(string memory hashedBody, bytes32 uuid) public returns(bool) {
        userContents[msg.sender].push(uuid);
        hashedContent[uuid] = hashedBody;
        return true;
    }

    function getHash(bytes32 id) public view returns(string memory) {
        return hashedContent[id];
    }

    function getContentArray(address publicKey) public view returns(bytes32[] memory) {
        return userContents[publicKey];
    }

}