const Web3 = require('web3');
// const contractJSON = require('../../build/contracts/Master.json');
const Hasher = require('./hasher');
// require('dotenv').config();
// const config = require('../../truffle-config');

class Login {

    constructor(contractAbi, contractAddress, web3){
        this.web3 = web3;
        this.contractInstance = new this.web3.eth.Contract(contractAbi, contractAddress);
        this.hasher = new Hasher(this.web3);
    }

    //checkValidUser(address publicKey)
    async checkValidUser(_publicKey){
        try{
            const receipt = await this.contractInstance.methods.checkValidUser(_publicKey).call({from: _publicKey});
            return receipt;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //createUser()
    async createUser(fromAddress) {
        try{
            const result = await this.contractInstance.methods.createUser().send({from: fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //getRandom()
    async getRandom(fromAddress) {
        try{
            const result = await this.contractInstance.methods.getRandom().call({from: fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //authenticate(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    async authenticate(_hash, _sig, _fromAddress){
        try{
            const splitSignature = this.splitSignature(_sig);
            const result = await this.contractInstance.methods.authenticate(_hash, splitSignature.v, splitSignature.r, splitSignature.s).call({from: _fromAddress});
            return result;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //Helper Login function
    async login(_fromAddress) {
        const rand = await this.getRandom(_fromAddress);
        const hashedMessage = this.hasher.generateHash(rand);
        const sig = await this.hasher.signMessage(hashedMessage, _fromAddress);
        const result = await this.authenticate(hashedMessage, sig, _fromAddress);
        return result;
    }

    async oneClickLogin(fromAddress){
        try {
            const result = await this.checkValidUser(fromAddress);
            if (result) {
                try {
                    const loginResult = await this.login(fromAddress);
                    if (loginResult) {
                        return { resultCode: 0, message: "user logged in" };
                    }
                    else {
                        return { resultCode: 2, message: "Unable to login user. authentication failed" };
                    }
                }
                catch (error) {
                    console.log(error);
                    return {resultCode: 3, message: "error occured during login transaction" };
                }
    
            }
            else {
                try {
                    const createResult = await this.createUser(fromAddress);
                    if (createResult) {
                        try {
                            const loginResult = await this.login(fromAddress);
                            if (loginResult) {
                                return { resultCode: 0, message: "user logged in" };
                            }
                            else {
                                return{ resultCode: 2, message: "Unable to login user. authentication failed" };
                            }
                        }
                        catch (error) {
                            console.log(error);
                            return{ resultCode: 3, message: "error occured during login transaction" };
                        }
    
                    }
                    else {
                        return{ resultCode: 4, message: "Unable to create user. authentication failed" };
                    }
                }
                catch (error) {
                    console.log(error);
                    return{ resultCode: 5, message: "error occured during user creation process" };
                }
    
            }
        }
        catch (error) {
            console.log(error);
            return {resultCode: 1, message: "error occured during user validation process" };
        }
    }

    //Helper function for splitting signature
    splitSignature(_sig) {
        _sig = _sig.slice(2);
        var r = `0x${_sig.slice(0, 64)}`;
        var s = `0x${_sig.slice(64, 128)}`;
        var v = this.web3.utils.toDecimal(`0x${_sig.slice(128, 130)}`);
        const splitObject = {v:v,r:r,s:s};
        return splitObject;

    }

}
// var login = new Login(contractJSON.abi, process.env.MasterAddress, config.networks.kovan.provider);
//login.createUser("0x3fe833c1973931BE25b7C2d9BC6FF9324D4f8B0D").then(console.log);
//login.getRandom("0x60321f75ff8aedc36d214b1190eac7a80c28c15b").then(console.log);
//login.checkValidUser("0x60321f75ff8aedc36d214b1190eac7a80c28c15b").then(console.log);
//login.authenticate("0xa6a7704d8b54c1f3b145060566a9bbe657404713cbcfc001356f37e2f326d2a0","0xbeb40273402e8601dd3ff9faca2282baece5d9a7a2d4997c44b7d77e9a7ce42a659fe44cf8fc829a0023d62916a08b592379904b8659a4c91c8894450337d1e21c", "0x60321f75ff8aedc36d214b1190eac7a80c28c15b").then(console.log);
//login.login("0x60321f75FF8AEDc36d214B1190Eac7a80C28C15b").then(console.log);
module.exports = Login;
