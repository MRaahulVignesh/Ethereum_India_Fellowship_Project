const Web3 = require('web3');

class Hasher {

    constructor(web3) {
        this.web3 = web3;
    }
    generateHash(_content) {
        return this.web3.utils.keccak256(_content);
    }

    checkHash(_content, _hash) {
        const temp = this.web3.utils.keccak256(_content)
        if (temp === _hash)
            return true;
        else
            return false;
    }

    async signMessage(_hashedMessage, _fromAddress) {
        var sig = await this.web3.eth.personal.sign(_hashedMessage, _fromAddress);
        return sig;
    }

}

module.exports = Hasher;