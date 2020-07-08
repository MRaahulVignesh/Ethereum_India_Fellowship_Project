// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "./Token.sol";
import "./Finance.sol";

contract Master is Token,Finance {

    struct Wallet{
        uint rand;
        bool valid;
        uint redeemTime;
    }

    modifier validUser() {
        require(checkValidUser(msg.sender), "Not a valid user");
        _;
    }

    mapping(address => Wallet) private users;

    event newUser(address publicKey, uint rand, uint redeemTime);

    function authenticate(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns(bool) {

       if(checkValidUser(msg.sender)){
           bool verified = _verify(hash,v,r,s, msg.sender);
           if(verified){
               return true;
           }
           else{
               return false;
           }
       }
        return false;
    }

    function createUser() public returns(bool) {
       Wallet memory temp = Wallet({
               rand: now,
               valid: true,
               redeemTime: 0
           });
        users[msg.sender] = temp;
        emit newUser(msg.sender, users[msg.sender].rand, users[msg.sender].redeemTime);
        return true;
    }

    function _verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s, address sender) private pure returns(bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
        return ecrecover(prefixedHash, v, r, s) == sender;
    }

    function addSubscription(uint tokenId) public validUser returns(bool) {
        address userAddress = msg.sender;
        require(balanceOf(userAddress) == 0, "Subscription already exists");
        bool result = mint(userAddress, tokenId);
        if(result){
            users[msg.sender].redeemTime = now + 300 seconds;
            uint subscriptionAmount = 10**18;
            uint code = receiveFunds(subscriptionAmount, userAddress);
            require(code == 0, "cannot receive your funds");
            return true;
        }

        return result;
    }

    function checkValidUser(address publicKey) public view returns(bool) {
        if(users[publicKey].valid)
            return true;
        else
            return false;
    }

    function getRandom() public view validUser returns(uint) {
        return users[msg.sender].rand;
    }

    function getRedeemTime() public view validUser returns(uint) {
        return users[msg.sender].redeemTime;
    }

    function redeemSubscription() public validUser returns(bool) {
        address userAddress = msg.sender;
        require(balanceOf(userAddress) > 0, "subscription doesnot exist");
        require(now > users[msg.sender].redeemTime, "Redeem time not reached");
        uint tokenID = tokenOfOwnerByIndex(userAddress, balanceOf(userAddress)-1);
        bool result = burn(tokenID);
        if(result){
             transferToUser();
            users[userAddress].redeemTime = 0;
            return true;
        }
        return result;
    }

    function transferOwnerFunds(uint _tokens) public returns(bool){
        uint totalDeposit = totalSupply() * (10**19);
        bool result = transferToOwner(_tokens, totalDeposit);
        return result;
    }

    function getOwnerShare() public returns(uint){
        uint totalDeposit = totalSupply() * (10**19);
        uint result = getProfit(totalDeposit);
        return result;
    }

}

