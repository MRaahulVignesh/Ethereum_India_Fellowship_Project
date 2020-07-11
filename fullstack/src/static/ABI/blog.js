module.exports = {
  contractAddress: "0x5F6E2b86981Ca6a8cA9e149AdDbf450bD39a4Acc",
  abi: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "hashedBody",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "uuid",
          "type": "bytes32"
        }
      ],
      "name": "addBlogHash",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "getHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "publicKey",
          "type": "address"
        }
      ],
      "name": "getContentArray",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]
};

