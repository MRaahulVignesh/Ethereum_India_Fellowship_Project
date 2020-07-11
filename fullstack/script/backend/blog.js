const Web3 = require('web3');
const Hasher = require('./hasher');



class QueryBlog {

    constructor(contractAbi, contractAddress, web3) {
        this.web3 = web3
        this.contractInstance = new this.web3.eth.Contract(contractAbi, contractAddress);
        this.hasher = new Hasher(this.web3);
    }

    async addBlog(_body, _id, fromAddress) {
        try {
            _body = this.hasher.generateHash(_body);
            _id = this.hasher.generateHash(_id);
            const receipt = await this.contractInstance.methods.addBlogHash(_body, _id).send({ from: fromAddress, gas: 3000000 });
            return receipt;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getHash(_id, _from) {
        try {
            _id = this.hasher.generateHash(_id);
            return await this.contractInstance.methods.getHash(_id).call({ from: _from });
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getHashArray(_publicKey) {
        try {
            return await this.contractInstance.methods.getContentArray(_publicKey).call({ from: _publicKey });
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async addValidityTag(blogData) {

        const updateData = [];
        for (var i = 0; i < blogData.length; i++) {
            var data = blogData[i];
            data._id = data._id.toString();
            data = JSON.parse(JSON.stringify(data));
            const hashedMessage = await this.getHash(data._id, data.author);
            const result = this.hasher.checkHash(data.content, hashedMessage);
            if (result) {
                data.verified = "true";
            } else {
                data.verified = "false";
            }
            updateData.push(data);
        }
        return updateData;
    }

}

module.exports = QueryBlog;
