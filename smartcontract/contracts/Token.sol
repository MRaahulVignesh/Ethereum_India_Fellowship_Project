// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721{
    
    constructor() ERC721("Bhip","Bp") public{
    }

    function burn(uint256 tokenId) internal virtual returns(bool){
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
        return true;
    }

    function mint(address to, uint256 tokenId) internal virtual returns(bool){
        _safeMint(to, tokenId, "");
        return true;
    }
}