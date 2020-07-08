const Web3 = require('web3');
const Hasher = require('./hasher');
const daiAbi = require('../../src/static/ABI/dai');
const contractJSON2 = require('../../build/contracts/Master.json');
require('dotenv').config();
const config = require('../../truffle-config');

class Owner {
    constructor(contractAbi, contractAddress, url) {
        this.url = url || "http://localhost:7545";
        this.web3 = new Web3(this.url);
        this.contractAddress = contractAddress;
        this.contractInstance = new this.web3.eth.Contract(contractAbi, contractAddress);
        const erc20TokenAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
        this.erc20Instance = new this.web3.eth.Contract(daiAbi, erc20TokenAddress);
    }

    // //receiveFunds(uint tokens) public returns(uint)
    // async receiveFunds(_tokens, _from) {
    //     var that = this;
    //     try {
    //         this.erc20Instance.methods.approve(this.contractAddress, _tokens).send({ from: _from })
    //         .then(async function (instance) {
    //             const receipt = await that.contractInstance.methods.receiveFunds(_tokens).send({ from: _from });
    //             return await receipt;
    //         }).catch(function (err) {
    //             console.log(err);
    //             return 200;
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return 202;
    //     }
    // }

    //redeemCErc20Tokens(uint256 _amount) public returns (uint)
    // async redeemCErc20Tokens(_tokens, _from) {
    //     try {
    //         const receipt = await this.contractInstance.methods.redeemCErc20Tokens(_tokens).send({ from: _from });
    //         return receipt;
    //     } catch (e) {
    //         console.log(e);
    //         return false;
    //     }
    // }

    //transferToOwner(uint _amount) public onlyOwner returns (uint)
    async transferOwnerFunds(_tokens, _from) {
        try {
            const receipt = await this.contractInstance.methods.transferToOwner(_tokens).send({ from: _from });
            return receipt;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //transferToUser() public returns (uint)
    async getProfit(_tokens, _from) {
        try {
            const result = await this.contractInstance.methods.transferToUser().call({ from: _from });
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async test(_from){
        const hello = await this.erc20Instance.methods.approve(process.env.MasterAddress, "10000000000000000000").send({ from: _from });
        return hello;
    }
}

var finance = new Owner(contractJSON2.abi, process.env.MasterAddress, config.networks.kovan.provider);
finance.test("0x60321f75FF8AEDc36d214B1190Eac7a80C28C15b").then(console.log);
module.exports = Owner;

   
