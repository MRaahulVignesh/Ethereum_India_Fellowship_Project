// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
    // optional
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (string memory);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

interface CERC20Interface {
    function mint(uint256) external returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);

    function balanceOfUnderlying(address) external returns (uint);
}

contract Finance {

    ERC20Interface erc20Interface;
    CERC20Interface cerc20Interface;
    address erc20TokenAddress = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
    address cerc20TokenAddress = 0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD;
    address public owner;

    event Log(uint profit);

    modifier onlyOwner(){
        require(msg.sender == owner, "Only authorized for owner to access");
        _;
    }

    constructor() public {
        owner = msg.sender;
        erc20Interface = ERC20Interface(erc20TokenAddress);
        cerc20Interface = CERC20Interface(cerc20TokenAddress);
    }

    function receiveFunds(uint tokens, address userAddress) internal returns(uint){
        erc20Interface.transferFrom(userAddress, address(this), tokens);
        uint supplyResult = supplyErc20ToCompounduint256(erc20Interface.balanceOf(address(this)));
       return supplyResult;
    }

    function supplyErc20ToCompounduint256(uint _numTokensToSupply) private returns(uint) {
        erc20Interface.approve(cerc20TokenAddress, _numTokensToSupply);
        uint mintResult = cerc20Interface.mint(_numTokensToSupply);
        return mintResult;
    }

    function transferToOwner(uint _tokens, uint totalDeposit) internal onlyOwner returns(bool) {
        address user = msg.sender;
        uint ownerShare = getProfit(totalDeposit);
        emit Log(ownerShare);
        require(ownerShare >= _tokens, "cannot withdraw more than your share");
        uint code = cerc20Interface.redeemUnderlying(_tokens);
        require(code == 0, "some problem while redeem your tokens");
        erc20Interface.transfer(user,_tokens);
        return true;
    }

    function getProfit(uint totalDeposit) internal onlyOwner returns(uint) {
        uint contractBalance = cerc20Interface.balanceOfUnderlying(address(this));
        uint profit = contractBalance - totalDeposit;
        emit Log(profit);
        return profit;
    }

    function transferToUser() internal returns(uint) {
        uint amount = 10**18;
        address user = msg.sender;
        uint code = cerc20Interface.redeemUnderlying(amount);
        require(code == 0, "some problem while redeem your tokens");
        erc20Interface.transfer(user,amount);
        return 200;
    }

}

