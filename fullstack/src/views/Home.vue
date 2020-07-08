/* eslint-disable */
<template >
  <div >
    <h2>
      Ethereum Based Blogging Site
      <b-badge>Dapp</b-badge>
    </h2>
    <div class="my-auto">
      <b-button pill variant="primary" size="lg" @click="login">Login With Metamask</b-button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import LoginBackend from '../../script/backend/login';
import ContractDetails from '../static/ABI/master'
var web3;
export default {
  data: function() {
    return {
      loginStatus: null,
    };
  },
  components: {},
  methods: {
    login: async function() {
      if (window.ethereum) {
        web3 = new Web3(ethereum);
        try {
          ethereum.enable();
        } catch (error) {
          console.log("error while getting permission");
        }
      } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
      var loginBackend = new LoginBackend(ContractDetails.abi, ContractDetails.contractAddress, web3);
      this.loginStatus = await loginBackend.oneClickLogin(ethereum.selectedAddress);
      if(this.loginStatus.resultCode == 0){
        this.$router.push('About');
      }
    },
  }
};
</script>

<style scoped>
.mainbackground{
  background: #000;
}
</style>
