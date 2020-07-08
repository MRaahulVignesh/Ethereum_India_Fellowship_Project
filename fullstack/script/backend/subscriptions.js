const Web3 = require('web3');
// const contractJSON = require('../../build/contracts/Login.json');
// const Hasher = require('./hasher');
// const contractJSON = require('../../build/contracts/Master.json');
// require('dotenv').config();
// const config = require('../../truffle-config');
const DaiDetails = require('../../src/static/ABI/dai');

class Subscriptions {

    constructor(contractAbi, contractAddress, web3) {
        this.web3 = web3;
        this.contractInstance = new this.web3.eth.Contract(contractAbi, contractAddress);
        this.contractAddress = contractAddress;
        this.erc20Instance = new this.web3.eth.Contract(DaiDetails.abi, this.web3.utils.toChecksumAddress(DaiDetails.contractAddress));
        this.tokenIdCount = 7;
    }

    //addSubscription() public validUser returns(bool)
    async addSubscription(fromAddress) {
        try{
            console.log(fromAddress);
            const approveResult = await this.erc20Instance.methods.approve(this.contractAddress, "10000000000000000000").send({ from: fromAddress });
            const receipt = await this.contractInstance.methods.addSubscription(this.tokenIdCount).send({from: fromAddress});
            this.tokenIdCount++;
            return receipt;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //getRedeemTime() public view validUser returns(uint)
    async getRedeemTime(_fromAddress){
        try{
            const result = await this.contractInstance.methods.getRedeemTime().call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //redeemSubscription() public validUser returns(bool)
    async redeemSubscription(_fromAddress) {
        try{
            const receipt = await this.contractInstance.methods.redeemSubscription().send({from: _fromAddress});
            return receipt;
        }catch(e){
            console.log(e);
            return false;
        }
    }

}

//var subscriptions = new Subscriptions(contractJSON.abi, process.env.MasterAddress, config.networks.kovan.provider);
//subscriptions.addSubscription("0x60321f75FF8AEDc36d214B1190Eac7a80C28C15b").then(console.log());

module.exports = Subscriptions;
