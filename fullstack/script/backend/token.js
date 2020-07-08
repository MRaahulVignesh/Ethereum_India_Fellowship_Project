const Web3 = require('web3');
//const contractJSON = require('../../build/contracts/Master.json');

class Token {

    constructor(contractAbi, contractAddress, web3) {
        this.web3 = web3;
        this.contractAddress = this.web3.utils.toChecksumAddress(contractAddress);
        this.contractInstance = new this.web3.eth.Contract(contractAbi, this.contractAddress);
    }

    async tokenName(_fromAddress){
        try{
            const result = await this.contractInstance.methods.name().call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async tokenSymbol(_fromAddress){
        try{
            const result = await this.contractInstance.methods.symbol().call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async totalSupply(_fromAddress){
        try{
            const result = await this.contractInstance.methods.totalSupply().call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async balanceOf(_fromAddress){
        try{
            const result = await this.contractInstance.methods.balanceOf(_fromAddress).call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async ownerOf(tokenId, _fromAddress){
        try{
            const result = await this.contractInstance.methods.ownerOf(tokenId).call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async tokenOfOwnerByIndex(_fromAddress, _index){
        try{
            const result = await this.contractInstance.methods.tokenOfOwnerByIndex(_fromAddress, _index).call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async transfer(_fromAddress, _toAddress, _tokenID){
        try{
            
            const receipt = await this.contractInstance.methods.approve(_toAddress, _tokenID).send({from: _fromAddress});
            const result = await this.contractInstance.methods.safeTransferFrom(_fromAddress, _toAddress, _tokenID).send({from: _fromAddress, gas: 300000});
            if(result)
                return 0;
            else
                return 1;
        }
        catch(e){
            console.log(e);
            return 2;
        }
    }

}

//const contractAddress = "0x5B8036a5e2Ee9e1Fd49A0B64B9a35892B40A677A";
//var token = new Token(contractJSON.abi, contractAddress);
//token.totalSupply().then(console.log);
//token.balanceOf("0xB593116857a7722ef51194961e6450838441b41D").then(console.log);
//token.mint("0xa95E65b4c64f14f36A222D4EA4DBF60837164fE2", 7).then(console.log);
//token.tokenOfOwnerByIndex("0xa95E65b4c64f14f36A222D4EA4DBF60837164fE2", 0).then(console.log);
//token.burn("0xB593116857a7722ef51194961e6450838441b41D", 2).then(console.log);
//token.transfer("0xB593116857a7722ef51194961e6450838441b41D", "0xa95E65b4c64f14f36A222D4EA4DBF60837164fE2", 2).then(console.log(result));
//token.ownerOf("0xB593116857a7722ef51194961e6450838441b41D", 4).then(console.log);

module.exports = Token;
