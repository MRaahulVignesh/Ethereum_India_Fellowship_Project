const Web3 = require('web3');

class Token {

    constructor(contractAbi, contractAddress, web3) {
        this.web3 = web3;
        this.contractAddress = this.web3.utils.toChecksumAddress(contractAddress);
        this.contractInstance = new this.web3.eth.Contract(contractAbi, this.contractAddress);
    }

    async tokenName(_fromAddress) {
        try {
            const result = await this.contractInstance.methods.name().call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async tokenSymbol(_fromAddress) {
        try {
            const result = await this.contractInstance.methods.symbol().call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async totalSupply(_fromAddress) {
        try {
            const result = await this.contractInstance.methods.totalSupply().call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async balanceOf(_fromAddress) {
        try {
            const result = await this.contractInstance.methods.balanceOf(_fromAddress).call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async ownerOf(tokenId, _fromAddress) {
        try {
            const result = await this.contractInstance.methods.ownerOf(tokenId).call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async tokenOfOwnerByIndex(_fromAddress, _index) {
        try {
            const result = await this.contractInstance.methods.tokenOfOwnerByIndex(_fromAddress, _index).call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async transfer(_fromAddress, _toAddress, _tokenID) {
        try {

            const receipt = await this.contractInstance.methods.approve(_toAddress, _tokenID).send({ from: _fromAddress });
            const result = await this.contractInstance.methods.safeTransferFrom(_fromAddress, _toAddress, _tokenID).send({ from: _fromAddress, gas: 300000 });
            if (result)
                return 0;
            else
                return 1;
        }
        catch (e) {
            console.log(e);
            return 2;
        }
    }

}

module.exports = Token;
