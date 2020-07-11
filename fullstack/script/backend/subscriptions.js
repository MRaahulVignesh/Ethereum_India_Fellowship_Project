const Web3 = require('web3');
const DaiDetails = require('../../src/static/ABI/dai');
const cryptoJS = require('crypto-js');

class Subscriptions {

    constructor(contractAbi, contractAddress, web3) {
        this.web3 = web3;
        this.contractInstance = new this.web3.eth.Contract(contractAbi, contractAddress);
        this.contractAddress = contractAddress;
        this.erc20Instance = new this.web3.eth.Contract(DaiDetails.abi, this.web3.utils.toChecksumAddress(DaiDetails.contractAddress));
    }

    //addSubscription() public validUser returns(bool)
    async addSubscription(fromAddress) {
        try {
            console.log(fromAddress);
            const tokenId = this.getTokenId(fromAddress);
            const approveResult = await this.erc20Instance.methods.approve(this.contractAddress, "10000000000000000000").send({ from: fromAddress });
            const receipt = await this.contractInstance.methods.addSubscription(tokenId).send({ from: fromAddress });
            return receipt;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //getRedeemTime() public view validUser returns(uint)
    async getRedeemTime(_fromAddress) {
        try {
            const result = await this.contractInstance.methods.getRedeemTime().call({ from: _fromAddress });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //redeemSubscription() public validUser returns(bool)
    async redeemSubscription(_fromAddress) {
        try {
            const receipt = await this.contractInstance.methods.redeemSubscription().send({ from: _fromAddress });
            return receipt;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //Helper funtion for getTokenId
    getTokenId(_fromAddress) {
        var timestamp = Date.now();
        var message = timestamp.toString() + _fromAddress.toString();
        var hash = cryptoJS.SHA3(message, { outputLength: 128 }).toString();
        hash = "0x" + hash;
        return hash;
    }

}

module.exports = Subscriptions;
